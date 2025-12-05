const { SlashCommandBuilder } = require("discord.js");
const { peopleEmbed } = require("../../embeds/people");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pick")
    .setDescription("Pick a user in your voice channel"),
  async execute(interaction) {
    try {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel || voiceChannel.members.size === 0) {
        return interaction.reply(
          "Vous devez être dans un canal vocal non vide"
        );
      }

      const members = Array.from(voiceChannel.members.values());
      let selectedMember = null;
        selectedMember = members[Math.floor(Math.random() * members.length)];

      await interaction.reply({
        embeds: [peopleEmbed(selectedMember)],
      });
    } catch (error) {
      console.error("Erreur lors de la sélection d'un utilisateur:", error);
      await interaction.reply({
        content:
          "Une erreur s'est produite lors de la sélection d'un utilisateur",
        ephemeral: true,
      });
    }
  },
};
