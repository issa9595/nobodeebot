const { SlashCommandBuilder } = require("discord.js");
const { peopleEmbed } = require("../../embeds/people");
const { db } = require("../../firebase");

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
      const lastPickRes = await db.collection("last_pick").doc("current").get();
      let selectedMember = null;
      const lastPickId = lastPickRes.exists ? lastPickRes.data().userId : null;
      const eligibleMembers = members.filter(
        (member) => member.id !== lastPickId
      );

      if (eligibleMembers.length === 0) {
        selectedMember = members[Math.floor(Math.random() * members.length)];
      } else {
        selectedMember =
          eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
      }

      await Promise.all([
        db.collection("last_pick").doc("current").set({
          userId: selectedMember.id,
          date: Date.now(),
        }),
        interaction.reply({
          embeds: [peopleEmbed(selectedMember)],
        }),
      ]);
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
