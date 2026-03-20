const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getPrayerTimes, checkRamadan, formatDate } = require('../utils/aladhan');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suhoor')
    .setDescription('Heure limite du Suhoor (repas du matin avant le jeûne)')
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
      // Suhoor = avant Fajr. Si on est après minuit, on veut le Fajr du jour même.
      // Si on est avant minuit, on veut le Fajr du lendemain.
      const now       = new Date();
      const hour      = now.getHours();
      const tomorrow  = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Après 18h, on affiche le suhoor du lendemain (nuit à venir)
      const targetDate = hour >= 18 ? tomorrow : now;
      const dateStr    = formatDate(targetDate);
      const isTomorrow = targetDate.getDate() !== now.getDate();

      const [data, ramadan] = await Promise.all([
        getPrayerTimes(city, country, dateStr, method),
        checkRamadan(),
      ]);

      if (!data) {
        return interaction.editReply({ content: `❌ Ville introuvable : **${city}, ${country}**. Vérifie l'orthographe.` });
      }

      const { Fajr, Imsak } = data.timings;
      const { date, meta }  = data;

      const inRamadan = ramadan?.inRamadan;
      const day       = ramadan?.hijriDay;

      // Imsak = moment où on doit s'arrêter de manger (10 min avant Fajr généralement)
      const [fajrH, fajrM] = Fajr.split(':').map(Number);
      const fajrTime = new Date();
      fajrTime.setDate(targetDate.getDate());
      fajrTime.setHours(fajrH, fajrM, 0, 0);

      const alreadyPassed = !isTomorrow && now > fajrTime;

      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`🌙 Suhoor — ${city}, ${country}`)
        .setDescription(
          inRamadan
            ? `☪️ Nous sommes au **jour ${day}** du Ramadan`
            : '📅 Horaire du Fajr (aube)'
        )
        .addFields(
          {
            name: isTomorrow ? '🌙 Suhoor — Demain matin' : '🌙 Suhoor — Ce matin',
            value: `## 🕌 Avant **${Fajr}** (Fajr)`,
            inline: false,
          },
          {
            name: '⏰ Imsak (arrêt recommandé)',
            value: `**${Imsak}** *(~10 min avant Fajr)*`,
            inline: true,
          },
          {
            name: '🌅 Fajr (aube)',
            value: `**${Fajr}**`,
            inline: true,
          },
          {
            name: '📅 Date',
            value: date.readable,
            inline: true,
          },
        );

      if (alreadyPassed) {
        embed.addFields({
          name: '☀️ Statut',
          value: 'L\'heure du Suhoor est **passée**, le jeûne a commencé. Bon courage ! 💪',
          inline: false,
        });
      } else {
        const diff    = fajrTime - now;
        const heures  = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        embed.addFields({
          name: '⏳ Temps restant pour manger',
          value: heures > 0
            ? `**${heures}h ${minutes}min** pour le Suhoor`
            : `**${minutes} minute(s)** pour le Suhoor !`,
          inline: false,
        });
      }

      embed.addFields({
        name: '💡 Conseil',
        value: [
          '• Mange des aliments riches en fibres et protéines (dattes, œufs, flocons d\'avoine)',
          '• Bois suffisamment d\'eau pour rester hydraté',
          '• Le Suhoor est une **Sunna** recommandée par le Prophète ﷺ',
          '• Il est recommandé de retarder le Suhoor le plus possible',
        ].join('\n'),
        inline: false,
      });

      embed.setFooter({ text: `Méthode de calcul n°${method} • ${meta.timezone}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[/suhoor]', err);
      await interaction.editReply({ content: '❌ Une erreur est survenue. Réessaie plus tard.' });
    }
  },
};
