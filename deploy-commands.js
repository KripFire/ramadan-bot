require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs   = require('fs');
const path = require('path');

const commands  = [];
const cmdPath   = path.join(__dirname, 'commands');
const cmdFiles  = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));

for (const file of cmdFiles) {
  const cmd = require(path.join(cmdPath, file));
  if (cmd.data) commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🚀 Déploiement de ${commands.length} commande(s)...`);

    if (process.env.GUILD_ID) {
      // Déploiement sur un seul serveur (instantané)
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      );
      console.log(`✅ Commandes déployées sur le serveur ${process.env.GUILD_ID}`);
    } else {
      // Déploiement global (peut prendre jusqu'à 1h)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      console.log('✅ Commandes déployées globalement (délai jusqu\'à 1h)');
    }

    console.log('\n📋 Commandes déployées :');
    commands.forEach(c => console.log(`   /${c.name} — ${c.description}`));
  } catch (err) {
    console.error('❌ Erreur lors du déploiement :', err);
  }
})();
