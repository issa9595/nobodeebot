const { SlashCommandBuilder } = require("discord.js");
const { peopleEmbed } = require("../../embeds/people");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Rank users in your voice channel")
    .addRoleOption((option) => {
      return option
        .setName("role")
        .setDescription("Role to filter")
        .setRequired(false);
    }),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply("You should be in a voice channel");
    }

    const role = interaction.options.getRole("role");

    if (role && !interaction.guild.roles.cache.has(role.id)) {
      return interaction.reply("The role does not exist");
    }

    let shuffledMembers = voiceChannel.members.sort(
      (a, b) => 0.5 - Math.random()
    );

    if (role) {
      const roleMembers = shuffledMembers.filter((member) =>
        member.roles.cache.has(role.id)
      );
      shuffledMembers = roleMembers;
    }

    const embeds = shuffledMembers.map((people) => {
      return peopleEmbed(people);
    });

    try {
      await interaction.reply({
        embeds,
      });
    } catch (error) {
      console.error(error); // Log the detailed error for debugging
      interaction.reply("An error occurred while trying to send the message."); // Send a generic error message to the user
    }
  },
};
