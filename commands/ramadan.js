const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const {
  checkRamadan,
  getRamadanStart,
  getEidDate,
  getPrayerTimes,
  getCurrentHijriYear,
} = require('../utils/aladhan');

const MOIS_HIJRI = [
  '', 'Mouharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Joumada al-Awwal', 'Joumada al-Thani', 'Rajab', 'Chaabane',
  'Ramadan', 'Chawwal', 'Dhou al-Qida', 'Dhou al-Hijja',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ramadan')
    .setDescription('Toutes les infos sur le Ramadan (dates, décompte, statut)')
    .addStringOption(o =>
      o.setName('ville')
        .setDescription('Ville pour les horaires (ex: Paris)')
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
      // Date hijri actuelle + statut Ramadan
      const ramadanStatus = await checkRamadan();
      if (!ramadanStatus) throw new Error('API indisponible');

      const { inRamadan, hijriDay, hijriYear, hijriMonth } = ramadanStatus;

      // Dates clés
      const [ramadanStart, eidData] = await Promise.all([
        getRamadanStart(hijriYear),
        getEidDate(hijriYear),
      ]);

      // Horaires du jour si en Ramadan
      let prayerTimes = null;
      if (inRamadan) {
        prayerTimes = await getPrayerTimes(city, country, null, method);
      }

      // Calcul des jours
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let startDate = null, eidDate = null;
      if (ramadanStart) {
        const [d, m, y] = ramadanStart.gregorian.date.split('-');
        startDate = new Date(`${y}-${m}-${d}`);
      }
      if (eidData) {
        const [d, m, y] = eidData.gregorian.date.split('-');
        eidDate = new Date(`${y}-${m}-${d}`);
      }

      // Couleur selon statut
      const color = inRamadan ? 0x1DB954 : 0xC9A84C;

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('☪️  Informations Ramadan')
        .setThumbnail('https://i.imgur.com/6Xk9MkB.png')
        .setTimestamp();

      // Date islamique actuelle
      const hijriMonthName = MOIS_HIJRI[hijriMonth] || `Mois ${hijriMonth}`;
      embed.addFields({
        name: '📅 Date islamique aujourd\'hui',
        value: `**${hijriDay} ${hijriMonthName} ${hijriYear} H**`,
        inline: false,
      });

      // Statut Ramadan
      if (inRamadan) {
        const daysIn    = hijriDay;
        const daysLeft  = eidDate ? Math.ceil((eidDate - today) / 86400000) : '?';
        embed.addFields({
          name: '🌙 Statut',
          value: `✅ **Nous sommes au Ramadan !**\nJour **${daysIn}/30** — encore **${daysLeft} jour(s)** avant l'Aïd`,
          inline: false,
        });
      } else if (startDate && startDate > today) {
        const daysUntil = Math.ceil((startDate - today) / 86400000);
        embed.addFields({
          name: '🌙 Statut',
          value: `⏳ Le Ramadan commence dans **${daysUntil} jour(s)**`,
          inline: false,
        });
      } else {
        embed.addFields({
          name: '🌙 Statut',
          value: '📆 Le Ramadan est terminé. Le prochain arrivera bientôt.',
          inline: false,
        });
      }

      // Dates clés
      if (ramadanStart && eidData) {
        const [sd, sm, sy] = ramadanStart.gregorian.date.split('-');
        const [ed, em, ey] = eidData.gregorian.date.split('-');
        embed.addFields(
          {
            name: '🌅 Début du Ramadan',
            value: `1er Ramadan ${hijriYear} H\n📌 **${sd}/${sm}/${sy}**`,
            inline: true,
          },
          {
            name: '🎉 Aïd el-Fitr (1er Chawwal)',
            value: `1er Chawwal ${hijriYear} H\n📌 **${ed}/${em}/${ey}**`,
            inline: true,
          },
        );
      }

      // Horaires du jour (si Ramadan)
      if (prayerTimes) {
        const { Fajr, Maghrib, Isha, Midnight } = prayerTimes.timings;
        embed.addFields({
          name: `🕌 Horaires du jour — ${city}`,
          value: [
            `🌙 **Suhoor (dernier repas)** → avant **${Fajr}** (Fajr)`,
            `🌅 **Iftar (rupture du jeûne)** → **${Maghrib}** (Maghrib)`,
            `🌃 **Isha** → **${Isha}**`,
            `🌙 **Milieu de la nuit** → **${Midnight}**`,
          ].join('\n'),
          inline: false,
        });
      }

      // Infos générales
      embed.addFields({
        name: '📖 Le saviez-vous ?',
        value: [
          '• Le **Suhoor** est le repas du matin avant l\'aube (avant Fajr)',
          '• L\'**Iftar** est la rupture du jeûne au coucher du soleil (Maghrib)',
          '• Le **Ramadan** dure 29 ou 30 jours selon la lune',
          '• L\'**Aïd el-Fitr** marque la fin du Ramadan',
          '• La nuit du **Laylat al-Qadr** (nuit du destin) est l\'une des dernières nuits impaires du Ramadan',
        ].join('\n'),
        inline: false,
      });

      embed.setFooter({ text: `Horaires pour ${city}, ${country} • Méthode ${method}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[/ramadan]', err);
      await interaction.editReply({ content: '❌ Impossible de récupérer les infos Ramadan. Réessaie plus tard.' });
    }
  },
};
