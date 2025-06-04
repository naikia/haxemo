import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Lock or unlock a channel")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Lock or unlock the channel")
        .setRequired(true)
        .addChoices({ name: "Lock", value: "lock" }, { name: "Unlock", value: "unlock" }),
    )
    .addStringOption((option) => option.setName("reason").setDescription("Reason for the lockdown"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const action = interaction.options.getString("action")
    const reason = interaction.options.getString("reason") || "No reason provided"

    try {
      const channel = interaction.channel
      const everyone = interaction.guild.roles.everyone

      if (action === "lock") {
        await channel.permissionOverwrites.edit(everyone, {
          SendMessages: false,
        })
      } else {
        await channel.permissionOverwrites.edit(everyone, {
          SendMessages: null,
        })
      }

      const embed = new EmbedBuilder()
        .setTitle(`🔒 Channel ${action === "lock" ? "Locked" : "Unlocked"}`)
        .setColor(action === "lock" ? 0xff0000 : 0x00ff00)
        .addFields(
          { name: "Channel", value: channel.toString(), inline: true },
          { name: "Action", value: action === "lock" ? "Locked" : "Unlocked", inline: true },
          { name: "Moderator", value: interaction.user.tag, inline: true },
          { name: "Reason", value: reason, inline: false },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error("Error with lockdown:", error)
      await interaction.reply({
        content: "❌ An error occurred while changing channel permissions.",
        ephemeral: true,
      })
    }
  },
}
