const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../firebase");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-daily-news-topic")
    .setDescription("Ajouter un sujet à l'alerte quotidienne")
    .addStringOption((option) =>
      option
        .setName("topic")
        .setDescription("Le sujet à ajouter")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const topic = interaction.options.getString("topic");
      await db.collection("daily_news_topics").add({
        topic,
      });
      await interaction.reply(
        `Le sujet ${topic} a été ajouté à l'alerte quotidienne`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Une erreur est survenue lors de l'ajout du sujet à l'alerte quotidienne`
      );
    }
  },
};
