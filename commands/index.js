const fs = require("node:fs");
const path = require("node:path");

function loadCommands(client) {
  const foldersPath = path.join(__dirname);
  const commandFolders = fs
    .readdirSync(foldersPath)
    .filter((file) => fs.statSync(path.join(foldersPath, file)).isDirectory());

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[AVERTISSEMENT] La commande à ${filePath} manque d'une propriété "data" ou "execute" requise.`
        );
      }
    }
  }
}

module.exports = { loadCommands };
