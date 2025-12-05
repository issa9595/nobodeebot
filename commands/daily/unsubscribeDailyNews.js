const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../firebase");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unsubscribe-daily-news")
    .setDescription("Se désabonner de l'alerte quotidienne du serveur"),
  async execute(interaction) {
    try {
      const serverId = interaction.guild.id;
      const user = interaction.user;
      await db
        .collection("daily_news_servers")
        .doc(serverId)
        .collection("subscribers")
        .doc(user.id)
        .delete();
      await interaction.reply(
        `<@${user.id}>, vous êtes désormais désabonné de l'alerte quotidienne du serveur`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Une erreur est survenue lors du désabonnement à l'alerte quotidienne du serveur`
      );
    }
  },
};
