require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
// Vérifiez si le chemin est un répertoire avant de continuer
if (fs.existsSync(foldersPath) && fs.lstatSync(foldersPath).isDirectory()) {
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    // Vérifiez si le chemin est un répertoire avant de lire son contenu
    if (fs.lstatSync(commandsPath).isDirectory()) {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
      // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
  }
} else {
  console.log(
    "[ERREUR] Le répertoire 'commands' n'existe pas ou n'est pas un répertoire."
  );
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Début du déploiement de ${commands.length} commande(s).`);
    console.log("Commandes à déployer :");
    commands.forEach((cmd, index) => {
      console.log(`${index + 1}. ${cmd.name}: ${cmd.description}`);
    });

    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(`${data.length} commande(s) déployée(s) avec succès :`);
    data.forEach((cmd, index) => {
      console.log(`${index + 1}. ${cmd.name} (ID: ${cmd.id})`);
    });
  } catch (error) {
    console.error("Erreur lors du déploiement des commandes :", error);
    if (error.response) {
      console.error("Détails de l'erreur :", error.response.data);
    }
  }
})();
