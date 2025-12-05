const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../firebase");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-daily-news-topic")
    .setDescription("Supprimer un sujet de l'alerte quotidienne")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("Le sujet à supprimer")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const topic = interaction.options.getString("topic");
      const topicsRes = await db
        .collection("daily_news_topics")
        .where("topic", "==", topic)
        .get();
      if (topicsRes.docs.length === 0) {
        await interaction.reply(
          `Ce sujet n'existe pas dans la liste des sujets de l'alerte quotidienne`
        );
      } else {
        await db
          .collection("daily_news_topics")
          .doc(topicsRes.docs[0].id)
          .delete();
        await interaction.reply(
          `Le sujet ${topic} a été supprimé de l'alerte quotidienne`
        );
      }
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Une erreur est survenue lors de la suppression du sujet de l'alerte quotidienne`
      );
    }
  },
};
