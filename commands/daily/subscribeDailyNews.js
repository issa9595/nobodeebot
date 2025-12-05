const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../firebase");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("subscribe-daily-news")
    .setDescription("S'abonner à l'alerte quotidienne du serveur"),
  async execute(interaction) {
    try {
      const serverId = interaction.guild.id;
      const dailyNewsServerRes = await db
        .collection("daily_news_servers")
        .doc(serverId)
        .get();
      if (!dailyNewsServerRes.exists) {
        return await interaction.reply(
          "Le serveur n'a pas été configuré pour envoyer les nouvelles quotidiennes, veuillez configurer le serveur en executant la commande `/setup-daily-news-server` dans le canal où vous souhaitez recevoir les nouvelles quotidiennes"
        );
      }
      const user = interaction.user;
      await dailyNewsServerRes.ref.collection("subscribers").doc(user.id).set({
        userId: user.id,
        date: Date.now(),
      });
      await interaction.reply(
        `<@${user.id}>, vous êtes désormais abonné à l'alerte quotidienne du serveur`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Une erreur est survenue lors de l'abonnement à l'alerte quotidienne du serveur`
      );
    }
  },
};
