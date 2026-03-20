const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getPrayerTimes, checkRamadan } = require('../utils/aladhan');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('horaires')
    .setDescription('Tous les horaires de prière du jour')
    .addStringOption(o =>
      o.setName('ville')
        .setDescription('Ville (ex: Paris, Lyon, Marseille...)')
        .setRequired(false))
    .addStringOption(o =>
      o.setName('pays')
        .setDescription('Pays (ex: France, Belgique, Maroc...)')
        .setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const city    = interaction.options.getString('ville')  || process.env.DEFAULT_CITY    || 'Paris';
    const country = interaction.options.getString('pays')   || process.env.DEFAULT_COUNTRY || 'France';
    const method  = parseInt(process.env.PRAYER_METHOD) || 12;

    try {
      const [data, ramadan] = await Promise.all([
        getPrayerTimes(city, country, null, method),
        checkRamadan(),
      ]);

      if (!data) {
        return interaction.editReply({ content: `❌ Ville introuvable : **${city}, ${country}**. Vérifie l'orthographe.` });
      }

      const t = data.timings;
      const inRamadan = ramadan?.inRamadan;
      const day       = ramadan?.hijriDay;

      // Prière actuelle (pour surligner)
      const now      = new Date();
      const nowMins  = now.getHours() * 60 + now.getMinutes();

      const prayerList = [
        { name: 'Fajr',    emoji: '🌄', time: t.Fajr    },
        { name: 'Chourouk',emoji: '🌅', time: t.Sunrise  },
        { name: 'Dhuhr',   emoji: '☀️',  time: t.Dhuhr   },
        { name: 'Asr',     emoji: '🌤️',  time: t.Asr     },
        { name: 'Maghrib', emoji: '🌇', time: t.Maghrib  },
        { name: 'Isha',    emoji: '🌙', time: t.Isha     },
      ];

      // Trouver la prochaine prière
      let nextPrayer = null;
      for (const p of prayerList) {
        const [h, m] = p.time.split(':').map(Number);
        if (h * 60 + m > nowMins) { nextPrayer = p.name; break; }
      }

      const rows = prayerList.map(p => {
        const isNext = p.name === nextPrayer;
        return `${p.emoji} ${isNext ? '**' : ''}${p.name.padEnd(10)}${isNext ? '**' : ''} \`${p.time}\`${isNext ? ' ← prochaine' : ''}`;
      });

      const embed = new EmbedBuilder()
        .setColor(inRamadan ? 0x1DB954 : 0x5865F2)
        .setTitle(`🕌 Horaires de prière — ${city}, ${country}`)
        .setDescription(
          inRamadan
            ? `☪️ **Ramadan jour ${day}** • ${data.date.readable}`
            : `📅 ${data.date.readable}`
        )
        .addFields(
          {
            name: '🕐 Horaires',
            value: rows.join('\n'),
            inline: false,
          },
          {
            name: '📿 Informations Ramadan',
            value: [
              `⏰ **Imsak** (arrêt du Suhoor) → \`${t.Imsak}\``,
              `🌙 **Suhoor** → avant \`${t.Fajr}\` (Fajr)`,
              `🍽️ **Iftar** → à \`${t.Maghrib}\` (Maghrib)`,
              `🌃 **Milieu de nuit** → \`${t.Midnight}\``,
            ].join('\n'),
            inline: false,
          },
        )
        .setFooter({ text: `Latitude: ${data.meta.latitude} | Longitude: ${data.meta.longitude} | Méthode: ${method}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[/horaires]', err);
      await interaction.editReply({ content: '❌ Une erreur est survenue. Réessaie plus tard.' });
    }
  },
};
