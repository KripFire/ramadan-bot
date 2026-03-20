const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { checkRamadan, hijriToGregorian, getPrayerTimes } = require('../utils/aladhan');
const fetch = require('node-fetch');

const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS_FR  = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

function formatDateFR(ddmmyyyy) {
  const [d, m, y] = ddmmyyyy.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${JOURS_FR[date.getDay()]} **${d} ${MOIS_FR[m - 1]} ${y}**`;
}

function daysUntil(ddmmyyyy) {
  const [d, m, y] = ddmmyyyy.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const today  = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / 86400000);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eid')
    .setDescription('Dates de l\'Aïd el-Fitr et l\'Aïd el-Adha + horaires de la prière de l\'Aïd')
    .addStringOption(o =>
      o.setName('ville')
        .setDescription('Ville pour les horaires de la prière de l\'Aïd (ex: Paris)')
        .setRequired(false))
    .addStringOption(o =>
      o.setName('pays')
        .setDescription('Pays (ex: France)')
        .setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const city    = interaction.options.getString('ville')  || process.env.DEFAULT_CITY    || 'Paris';
    const country = interaction.options.getString('pays')   || process.env.DEFAULT_COUNTRY || 'France';
    const method  = parseInt(process.env.PRAYER_METHOD) || 12;

    try {
      const ramadan = await checkRamadan();
      if (!ramadan) throw new Error('API indisponible');
      const { hijriYear } = ramadan;

      // Récupérer Aïd el-Fitr (1 Chawwal) et Aïd el-Adha (10 Dhou al-Hijja)
      const [fitrData, adhaData] = await Promise.all([
        hijriToGregorian(1, 10, hijriYear),
        fetch(`http://api.aladhan.com/v1/hToG/10-12-${hijriYear}`).then(r => r.json()).then(j => j.data),
      ]);

      if (!fitrData || !adhaData) throw new Error('Impossible de récupérer les dates');

      const fitrDate = fitrData.gregorian.date; // DD-MM-YYYY
      const adhaDate = adhaData.gregorian.date;

      const daysToFitr = daysUntil(fitrDate);
      const daysToAdha = daysUntil(adhaDate);

      // Horaires de prière le jour de l'Aïd el-Fitr (pour la prière de l'Aïd)
      const [fitrD, fitrM, fitrY] = fitrDate.split('-');
      const fitrDateStr = `${fitrD}-${fitrM}-${fitrY}`;
      const prayerOnEid = await getPrayerTimes(city, country, fitrDateStr, method);

      const embed = new EmbedBuilder()
        .setColor(0xFFD700)
        .setTitle('🎉 Aïd Mubarak — Dates & Horaires')
        .setThumbnail('https://i.imgur.com/6Xk9MkB.png')
        .setTimestamp();

      // ── Aïd el-Fitr ──────────────────────────────────────────────────────────
      let fitrStatus;
      if (daysToFitr === 0) {
        fitrStatus = '🎊 **C\'est aujourd\'hui ! Aïd Mubarak !** 🎊';
      } else if (daysToFitr > 0) {
        fitrStatus = `⏳ Dans **${daysToFitr} jour(s)**`;
      } else {
        fitrStatus = '✅ Passé cette année';
      }

      embed.addFields({
        name: '🌙 Aïd el-Fitr — 1er Chawwal ' + hijriYear + ' H',
        value: [
          `📅 ${formatDateFR(fitrDate)}`,
          fitrStatus,
          '',
          '_Fête de la rupture du jeûne, marquant la fin du Ramadan._',
        ].join('\n'),
        inline: false,
      });

      // Horaires de la prière de l'Aïd el-Fitr
      if (prayerOnEid) {
        const { Fajr, Sunrise, Dhuhr } = prayerOnEid.timings;
        embed.addFields({
          name: `🕌 Prière de l\'Aïd el-Fitr — ${city}`,
          value: [
            `🌅 **Fajr** : \`${Fajr}\``,
            `☀️ **Chourouk (lever du soleil)** : \`${Sunrise}\``,
            `💡 La prière de l\'Aïd se fait généralement **après le lever du soleil** (entre Chourouk et Dhuhr)`,
            `☀️ **Dhuhr** : \`${Dhuhr}\` _(limite)_`,
          ].join('\n'),
          inline: false,
        });
      }

      // ── Aïd el-Adha ──────────────────────────────────────────────────────────
      let adhaStatus;
      if (daysToAdha === 0) {
        adhaStatus = '🎊 **C\'est aujourd\'hui ! Aïd Mubarak !** 🎊';
      } else if (daysToAdha > 0) {
        adhaStatus = `⏳ Dans **${daysToAdha} jour(s)**`;
      } else {
        adhaStatus = '✅ Passé cette année';
      }

      embed.addFields({
        name: '🐑 Aïd el-Adha — 10 Dhou al-Hijja ' + hijriYear + ' H',
        value: [
          `📅 ${formatDateFR(adhaDate)}`,
          adhaStatus,
          '',
          '_Fête du sacrifice, commémorant le sacrifice d\'Ibrahim (AS)._',
        ].join('\n'),
        inline: false,
      });

      // ── Infos générales ───────────────────────────────────────────────────────
      embed.addFields({
        name: '📖 Le saviez-vous ?',
        value: [
          '• Le jour de l\'Aïd, il est **interdit de jeûner**',
          '• Il est Sunna de manger quelques **dattes** avant la prière de l\'Aïd el-Fitr',
          '• La prière de l\'Aïd el-Adha se fait **avant** le sacrifice',
          '• Le **Takbir de l\'Aïd** : اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ',
        ].join('\n'),
        inline: false,
      });

      embed.setFooter({ text: `${city}, ${country} • Année hijri ${hijriYear} H` });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[/eid]', err);
      await interaction.editReply({ content: '❌ Une erreur est survenue. Réessaie plus tard.' });
    }
  },
};
