require("dotenv").config();
const { REST, Routes } = require("discord.js");
const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;

// Specify ids of commands to delete
const commands = [];

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

const deleteCommandById = async (commandId) => {
  try {
    await rest.delete(
      Routes.applicationGuildCommand(clientId, guildId, commandId)
    );
  } catch (error) {
    console.error(error);
  }
};

// and delete your commands!
(async () => {
  await Promise.all(commands.map((commandId) => deleteCommandById(commandId)));
})();
