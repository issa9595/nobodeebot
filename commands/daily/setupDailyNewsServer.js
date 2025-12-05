const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../firebase");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-daily-news-server")
    .setDescription(
      "Configurer le serveur pour envoyer les nouvelles quotidiennes dans le canal actuel"
    ),
  async execute(interaction) {
    const channel = interaction.channel;
    const id = interaction.guild.id;
    await db.collection("daily_news_servers").doc(id).set({
      channelId: channel.id,
      guildId: interaction.guild.id,
    });
    await interaction.reply(
      `<@${interaction.user.id}>, Le serveur a bien été configuré pour envoyer les nouvelles quotidiennes dans ce canal : ${channel.name}`
    );
  },
};
