require("dotenv").config();
require("./firebase");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { loadCommands } = require("./commands");
const { loadEvents } = require("./events");
const token = process.env.TOKEN;
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const router = require("./routes");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();
client.login(token);

loadCommands(client);
loadEvents(client);
app.use(express.json());
app.use((req, res, next) => {
  req.client = client;
  next();
});
app.use("", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
