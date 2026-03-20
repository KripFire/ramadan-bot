const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getRamadanCalendar, checkRamadan, getCurrentHijriYear } = require('../utils/aladhan');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calendrier')
    .setDescription('Calendrier complet du Ramadan (Suhoor & Iftar pour chaque jour)')
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
      const ramadan    = await checkRamadan();
      const hijriYear  = ramadan?.hijriYear || await getCurrentHijriYear();
      if (!hijriYear) throw new Error('Impossible de récupérer l\'année hijri');

      const calendar = await getRamadanCalendar(hijriYear, city, country, method);
      if (!calendar || !Array.isArray(calendar)) {
        return interaction.editReply({ content: `❌ Impossible de récupérer le calendrier pour **${city}, ${country}**.` });
      }

      const inRamadan = ramadan?.inRamadan;
      const todayDay  = ramadan?.hijriDay;

      // Construction du tableau (groupé en 2 embeds pour ne pas dépasser les limites Discord)
      // Embed 1 : jours 1-15 | Embed 2 : jours 16-30
      const buildRows = (days) => {
        return days.map(entry => {
          const dayNum   = parseInt(entry.date.hijri.day);
          const gregDate = entry.date.gregorian.date; // DD-MM-YYYY
          const [gd, gm] = gregDate.split('-');
          const fajr     = entry.timings.Fajr.replace(/\s*\(.*?\)/g, '');
          const maghrib  = entry.timings.Maghrib.replace(/\s*\(.*?\)/g, '');
          const isToday  = inRamadan && dayNum === todayDay;
          const arrow    = isToday ? ' ◀ Aujourd\'hui' : '';
          return `\`${String(dayNum).padStart(2, '0')}\` ${gd}/${gm}  🌙\`${fajr}\`  🍽️\`${maghrib}\`${arrow}`;
        }).join('\n');
      };

      const firstHalf  = calendar.slice(0, 15);
      const secondHalf = calendar.slice(15);

      const header = '`Jour` Date      🌙Suhoor  🍽️Iftar';

      const embed1 = new EmbedBuilder()
        .setColor(0xC9A84C)
        .setTitle(`📅 Calendrier Ramadan ${hijriYear} H — ${city}`)
        .setDescription(
          `**Jours 1–15**\n\`\`\`\n${header}\n${'─'.repeat(36)}\n\`\`\`\n` +
          buildRows(firstHalf)
        )
        .setFooter({ text: `🌙 = Heure limite Suhoor (Fajr) | 🍽️ = Iftar (Maghrib)` });

      const embed2 = new EmbedBuilder()
        .setColor(0xC9A84C)
        .setTitle(`📅 Calendrier Ramadan ${hijriYear} H — ${city} (suite)`)
        .setDescription(
          `**Jours 16–${calendar.length}**\n\`\`\`\n${header}\n${'─'.repeat(36)}\n\`\`\`\n` +
          buildRows(secondHalf)
        )
        .setFooter({ text: `${city}, ${country} • Méthode ${method} • Calendrier Ramadan 1447 H` })
        .setTimestamp();

      // Résumé des dates clés
      if (calendar.length > 0) {
        const first = calendar[0];
        const last  = calendar[calendar.length - 1];
        const [fd, fm, fy] = first.date.gregorian.date.split('-');
        const [ld, lm, ly] = last.date.gregorian.date.split('-');

        embed1.addFields({
          name: '📌 Récapitulatif',
          value: [
            `🌙 **Début Ramadan** : 1er jour → **${fd}/${fm}/${fy}**`,
            `🎉 **Fin Ramadan** : ${calendar.length}ème jour → **${ld}/${lm}/${ly}**`,
            `🕌 **Durée** : **${calendar.length} jours**`,
            `🎊 **Aïd el-Fitr** : 1er Chawwal ${hijriYear} H (lendemain du dernier jour)`,
          ].join('\n'),
        });
      }

      await interaction.editReply({ embeds: [embed1, embed2] });
    } catch (err) {
      console.error('[/calendrier]', err);
      await interaction.editReply({ content: '❌ Une erreur est survenue. Réessaie plus tard.' });
    }
  },
};
