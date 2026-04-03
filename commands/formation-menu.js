const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('formation-menu')
    .setDescription('Sommaire complet de la formation TikTok Ads Manager (10 modules)'),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
      .setColor(0x010101)
      .setTitle('📚 Formation TikTok Ads Manager — Sommaire')
      .setDescription(
        'Formation complète en **10 modules** pour maîtriser TikTok Ads Manager de A à Z.\n' +
        '> `/formation module:X` pour les modules 1 à 5\n' +
        '> `/formation2 module:X` pour les modules 6 à 10'
      )
      .addFields(
        {
          name: '📱 Module 1',
          value: 'Introduction & Interface\n`/formation module:1`',
          inline: true,
        },
        {
          name: '🏗️ Module 2',
          value: 'Structure des campagnes\n`/formation module:2`',
          inline: true,
        },
        {
          name: '🎯 Module 3',
          value: 'Objectifs de campagne\n`/formation module:3`',
          inline: true,
        },
        {
          name: '👥 Module 4',
          value: "Ciblage d'audience\n`/formation module:4`",
          inline: true,
        },
        {
          name: '🎬 Module 5',
          value: 'Formats publicitaires\n`/formation module:5`',
          inline: true,
        },
        {
          name: '💰 Module 6',
          value: 'Budget & Enchères\n`/formation2 module:6`',
          inline: true,
        },
        {
          name: '🎨 Module 7',
          value: 'Création de publicités\n`/formation2 module:7`',
          inline: true,
        },
        {
          name: '🔍 Module 8',
          value: 'TikTok Pixel\n`/formation2 module:8`',
          inline: true,
        },
        {
          name: '📊 Module 9',
          value: 'Analyse & Optimisation\n`/formation2 module:9`',
          inline: true,
        },
        {
          name: '🚀 Module 10',
          value: 'Stratégies avancées\n`/formation2 module:10`',
          inline: true,
        },
        {
          name: '💡 Conseil de progression',
          value:
            'Commence par le **Module 1** et progresse dans l\'ordre. ' +
            'Les modules **8** (Pixel) et **10** (Stratégies avancées) sont plus techniques — assure-toi d\'avoir les bases des modules précédents avant de les aborder.',
          inline: false,
        }
      )
      .setFooter({ text: 'Formation TikTok Ads Manager • 10 modules • Contenu en français' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
