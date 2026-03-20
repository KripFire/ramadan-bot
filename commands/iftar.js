const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getPrayerTimes, checkRamadan } = require('../utils/aladhan');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iftar')
    .setDescription('Heure de l\'Iftar (rupture du jeûne) pour ce soir')
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

      const { Maghrib, Isha } = data.timings;
      const { date, meta }    = data;

      // Heure actuelle de la ville (approximation via timezone offset)
      const now = new Date();
      const [magH, magM] = Maghrib.split(':').map(Number);
      const iftarToday   = new Date();
      iftarToday.setHours(magH, magM, 0, 0);
      const alreadyPassed = now > iftarToday;

      const inRamadan = ramadan?.inRamadan;
      const day       = ramadan?.hijriDay;

      const embed = new EmbedBuilder()
        .setColor(0xE67E22)
        .setTitle(`🌅 Iftar — ${city}, ${country}`)
        .setDescription(
          inRamadan
            ? `☪️ Nous sommes au **jour ${day}** du Ramadan`
            : '📅 Horaire du coucher du soleil (Maghrib)'
        )
        .addFields(
          {
            name: '🍽️ Heure de l\'Iftar (Maghrib)',
            value: `## 🕌 ${Maghrib}`,
            inline: true,
          },
          {
            name: '🌙 Isha',
            value: `**${Isha}**`,
            inline: true,
          },
          {
            name: '📅 Date',
            value: `${date.readable}`,
            inline: true,
          },
        );

      if (alreadyPassed) {
        embed.addFields({
          name: '✅ Statut',
          value: 'L\'Iftar est **déjà passé** pour aujourd\'hui. Bonne soirée ! 🌙',
          inline: false,
        });
      } else {
        // Calcul du temps restant
        const diff    = iftarToday - now;
        const heures  = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        embed.addFields({
          name: '⏳ Temps restant',
          value: heures > 0
            ? `**${heures}h ${minutes}min** avant l'Iftar`
            : `**${minutes} minute(s)** avant l'Iftar`,
          inline: false,
        });
      }

      embed.addFields({
        name: '💡 Dou\'a de rupture du jeûne',
        value: '*"Allahumma laka sumtu wa bika amantu wa alayka tawakkaltu wa ala rizqika aftartu"*\n*"Ô Allah, j\'ai jeûné pour Toi, j\'ai cru en Toi, je me suis confié à Toi et c\'est avec Ta subsistance que je romps le jeûne."*',
        inline: false,
      });

      embed.setFooter({ text: `Méthode de calcul n°${method} • ${meta.timezone}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[/iftar]', err);
      await interaction.editReply({ content: '❌ Une erreur est survenue. Réessaie plus tard.' });
    }
  },
};
