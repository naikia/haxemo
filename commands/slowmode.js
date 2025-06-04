import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for the current channel")
    .addIntegerOption((option) =>
      option
        .setName("seconds")
        .setDescription("Slowmode duration in seconds (0-21600)")
        .setMinValue(0)
        .setMaxValue(21600)
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger("seconds")

    try {
      await interaction.channel.setRateLimitPerUser(seconds)

      const embed = new EmbedBuilder()
        .setTitle("⏱️ Slowmode Updated")
        .setColor(0x5865f2)
        .addFields(
          { name: "Channel", value: interaction.channel.toString(), inline: true },
          { name: "Slowmode", value: seconds === 0 ? "Disabled" : `${seconds} seconds`, inline: true },
          { name: "Moderator", value: interaction.user.tag, inline: true },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error("Error setting slowmode:", error)
      await interaction.reply({
        content: "❌ An error occurred while setting slowmode.",
        ephemeral: true,
      })
    }
  },
}
