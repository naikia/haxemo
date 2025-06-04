import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { generateCommandId } from "../utils/commandId.js"
import { sendModLog } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete multiple messages at once")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    )
    .addUserOption((option) => option.setName("user").setDescription("Only delete messages from this user"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount")
    const targetUser = interaction.options.getUser("user")
    const commandId = generateCommandId()

    try {
      await interaction.deferReply({ ephemeral: true })

      const messages = await interaction.channel.messages.fetch({ limit: amount })

      let messagesToDelete = messages
      if (targetUser) {
        messagesToDelete = messages.filter((msg) => msg.author.id === targetUser.id)
      }

      const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true)

      // Create mod log entry
      const modLog = new ModLog({
        commandId: commandId,
        userId: targetUser?.id || "all",
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        action: "clear",
        reason: `Cleared ${deletedMessages.size} messages in #${interaction.channel.name}`,
        additionalInfo: targetUser ? `Target user: ${targetUser.tag}` : "All users",
      })

      await modLog.save()

      // Send to mod log channel
      await sendModLog(
        interaction.client,
        {
          commandId: commandId,
          userId: targetUser?.id || "all",
          moderatorId: interaction.user.id,
          action: "clear",
          reason: `Cleared ${deletedMessages.size} messages in #${interaction.channel.name}`,
          additionalInfo: targetUser ? `Target user: ${targetUser.tag}` : "All users",
        },
        interaction,
      )

      const embed = new EmbedBuilder()
        .setTitle("🧹 Messages Cleared")
        .setColor(0x00ff00)
        .addFields(
          { name: "Messages Deleted", value: deletedMessages.size.toString(), inline: true },
          { name: "Moderator", value: interaction.user.tag, inline: true },
          { name: "Command ID", value: `\`${commandId}\``, inline: true },
          { name: "Channel", value: `#${interaction.channel.name}`, inline: true },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      if (targetUser) {
        embed.addFields({ name: "Target User", value: targetUser.tag, inline: true })
      }

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error("Error clearing messages:", error)
      await interaction.editReply({
        content: "❌ An error occurred while clearing messages. Messages older than 14 days cannot be bulk deleted.",
      })
    }
  },
}
