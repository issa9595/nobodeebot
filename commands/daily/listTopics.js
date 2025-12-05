const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../firebase");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-daily-news-topics")
    .setDescription("Lister les sujets de l'alerte quotidienne"),
  async execute(interaction) {
    try {
      const topicsRes = await db.collection("daily_news_topics").get();
      if (topicsRes.docs.length === 0) {
        await interaction.reply(
          `Il n'y a actuellement aucun sujet dans la liste des sujets de l'alerte quotidienne`
        );
      } else {
        const topics = topicsRes.docs.map((doc) => doc.data().topic);
        await interaction.reply(
          `Les sujets de l'alerte quotidienne sont : ${topics.join(", ")}`
        );
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Une erreur est survenue lors de la récupération des sujets de l'alerte quotidienne`
      );
    }
  },
};
