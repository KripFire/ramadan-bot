require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, MessageFlags } = require('discord.js');
const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');
const cron = require('node-cron');
const { getPrayerTimes, checkRamadan } = require('./utils/aladhan');

// ─── Client ───────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// ─── Chargement des commandes ──────────────────────────────────────────────────
const cmdPath  = path.join(__dirname, 'commands');
const cmdFiles = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));

for (const file of cmdFiles) {
  const cmd = require(path.join(cmdPath, file));
  if (cmd.data && cmd.execute) {
    client.commands.set(cmd.data.name, cmd);
    console.log(`[✓] Commande chargée : /${cmd.data.name}`);
  }
}

// ─── Bot prêt ─────────────────────────────────────────────────────────────────
client.once('ready', async () => {
  console.log(`\n✅ ${client.user.tag} est en ligne !`);
  console.log(`📡 Connecté à ${client.guilds.cache.size} serveur(s)\n`);

  client.user.setPresence({
    activities: [{ name: 'Ramadan Mubarak ☪️', type: 3 }],
    status: 'online',
  });

  // Démarrage des rappels automatiques
  startReminders();
});

// ─── Slash commands ────────────────────────────────────────────────────────────
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Erreur sur /${interaction.commandName} :`, err);
    const msg = { content: '❌ Une erreur est survenue.', flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(msg);
    else await interaction.reply(msg);
  }
});

// ─── Rappels automatiques ─────────────────────────────────────────────────────
function startReminders() {
  const channelId = process.env.REMINDER_CHANNEL_ID;
  if (!channelId) {
    console.log('⚠️  REMINDER_CHANNEL_ID non défini — rappels automatiques désactivés.');
    return;
  }

  const city    = process.env.DEFAULT_CITY    || 'Paris';
  const country = process.env.DEFAULT_COUNTRY || 'France';
  const method  = parseInt(process.env.PRAYER_METHOD) || 12;

  // Vérification toutes les minutes
  cron.schedule('* * * * *', async () => {
    try {
      const ramadan = await checkRamadan();
      if (!ramadan?.inRamadan) return; // Rappels seulement en Ramadan

      const data = await getPrayerTimes(city, country, null, method);
      if (!data) return;

      const now     = new Date();
      const nowH    = now.getHours();
      const nowM    = now.getMinutes();
      const channel = client.channels.cache.get(channelId);
      if (!channel) return;

      const { Fajr, Imsak, Maghrib } = data.timings;
      const [fajrH, fajrM]    = Fajr.split(':').map(Number);
      const [imsakH, imsakM]  = Imsak.split(':').map(Number);
      const [magH, magM]      = Maghrib.split(':').map(Number);

      // ── Rappel Suhoor : 30 min avant Imsak ──────────────────────────────────
      const imsak30H = imsakH;
      const imsak30M = imsakM - 30;
      const realH30  = imsak30M < 0 ? imsak30H - 1 : imsak30H;
      const realM30  = imsak30M < 0 ? 60 + imsak30M : imsak30M;
      if (nowH === realH30 && nowM === realM30) {
        const embed = new EmbedBuilder()
          .setColor(0x3498DB)
          .setTitle('🌙 Rappel Suhoor — 30 minutes restantes !')
          .setDescription(
            `@here Il vous reste **30 minutes** pour le Suhoor !\n\n` +
            `⏰ **Imsak** (arrêt du repas) : **${Imsak}**\n` +
            `🌅 **Fajr** (début du jeûne) : **${Fajr}**\n\n` +
            `Mangez, hydratez-vous et faites vos dernières intentions !`
          )
          .setFooter({ text: `${city}, ${country}` })
          .setTimestamp();
        await channel.send({ content: '@here', embeds: [embed] });
        console.log(`[🌙 Rappel Suhoor 30min envoyé — ${nowH}:${nowM}]`);
      }

      // ── Rappel Suhoor : 10 min avant Imsak ──────────────────────────────────
      const imsak10M_ = imsakM - 10;
      const realH10   = imsak10M_ < 0 ? imsakH - 1 : imsakH;
      const realM10   = imsak10M_ < 0 ? 60 + imsak10M_ : imsak10M_;
      if (nowH === realH10 && nowM === realM10) {
        const embed = new EmbedBuilder()
          .setColor(0xE74C3C)
          .setTitle('⚠️ Suhoor — Plus que 10 minutes !')
          .setDescription(
            `@here **Dépêchez-vous !** Il ne reste que **10 minutes** avant l\'Imsak !\n\n` +
            `⏰ **Imsak** : **${Imsak}**\n` +
            `🌅 **Fajr** : **${Fajr}**\n\n` +
            `Finissez votre repas et faites l'intention de jeûner.`
          )
          .setFooter({ text: `${city}, ${country}` })
          .setTimestamp();
        await channel.send({ content: '@here', embeds: [embed] });
        console.log(`[⚠️ Rappel Suhoor 10min envoyé — ${nowH}:${nowM}]`);
      }

      // ── Rappel Iftar : 15 min avant Maghrib ──────────────────────────────────
      const mag15M_ = magM - 15;
      const realMagH = mag15M_ < 0 ? magH - 1 : magH;
      const realMagM = mag15M_ < 0 ? 60 + mag15M_ : mag15M_;
      if (nowH === realMagH && nowM === realMagM) {
        const embed = new EmbedBuilder()
          .setColor(0xE67E22)
          .setTitle('🌅 Rappel Iftar — 15 minutes restantes !')
          .setDescription(
            `@here L'**Iftar** approche ! Plus que **15 minutes** !\n\n` +
            `🍽️ **Iftar (Maghrib)** : **${Maghrib}**\n\n` +
            `Préparez vos dattes, votre eau et vos repas 🌙`
          )
          .setFooter({ text: `${city}, ${country}` })
          .setTimestamp();
        await channel.send({ content: '@here', embeds: [embed] });
        console.log(`[🌅 Rappel Iftar 15min envoyé — ${nowH}:${nowM}]`);
      }

      // ── Annonce Iftar : à l'heure exacte ─────────────────────────────────────
      if (nowH === magH && nowM === magM) {
        const embed = new EmbedBuilder()
          .setColor(0x2ECC71)
          .setTitle('🎉 IFTAR ! Rompez le jeûne !')
          .setDescription(
            `@here **اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ**\n\n` +
            `*"Ô Allah, j'ai jeûné pour Toi, j'ai cru en Toi, je me suis confié à Toi et c'est avec Ta subsistance que je romps le jeûne."*\n\n` +
            `🕌 **Iftar** : **${Maghrib}** — Ramadan Mubarak ! 🌙\n` +
            `Commencez par des **dattes** et de l'**eau** selon la Sunna.`
          )
          .setColor(0xFFD700)
          .setFooter({ text: `Ramadan Mubarak • ${city}, ${country}` })
          .setTimestamp();
        await channel.send({ content: '@here', embeds: [embed] });
        console.log(`[🎉 Annonce Iftar envoyée — ${nowH}:${nowM}]`);
      }

    } catch (err) {
      console.error('[Rappels] Erreur :', err.message);
    }
  });

  console.log('⏰ Rappels automatiques activés (Suhoor 30min & 10min, Iftar 15min & heure exacte)');
}

// ─── Connexion ─────────────────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
