import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { generateCommandId } from "../utils/commandId.js"
import { sendModLog } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("pardon")
    .setDescription("Remove a moderation log entry")
    .addStringOption((option) =>
      option.setName("command-id").setDescription("Command ID of the log to remove").setRequired(true),
    )
    .addStringOption((option) => option.setName("reason").setDescription("Reason for pardoning").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const commandIdInput = interaction.options.getString("command-id").toUpperCase()
    const reason = interaction.options.getString("reason")
    const pardonCommandId = generateCommandId()

    try {
      // Find the moderation log
      const modLog = await ModLog.findOne({
        commandId: commandIdInput,
        guildId: interaction.guild.id,
      })

      if (!modLog) {
        const replyMethod = interaction.deferred ? "editReply" : "reply"
        return interaction[replyMethod]({
          content: `❌ No moderation log found with Command ID: \`${commandIdInput}\``,
          ephemeral: true,
        })
      }

      // Store original log info for the embed
      const originalAction = modLog.action
      const originalReason = modLog.reason
      const originalTimestamp = modLog.timestamp
      const originalUserId = modLog.userId
      const originalModeratorId = modLog.moderatorId

      // Remove the original log first
      await ModLog.deleteOne({ _id: modLog._id })

      // Create a pardon log entry
      const pardonLog = new ModLog({
        commandId: pardonCommandId,
        userId: originalUserId,
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        action: "pardon",
        reason: reason,
        additionalInfo: `Pardoned ${originalAction} (ID: ${commandIdInput}) - Original reason: ${originalReason}`,
      })

      await pardonLog.save()

      // Get user and moderator info
      let targetUser = null
      let originalModerator = null

      try {
        if (originalUserId && originalUserId !== "all") {
          targetUser = await interaction.client.users.fetch(originalUserId)
        }
        originalModerator = await interaction.client.users.fetch(originalModeratorId)
      } catch {
        // User/moderator not found
      }

      const embed = new EmbedBuilder()
        .setTitle("✅ Moderation Log Pardoned")
        .setColor(0x00ff00)
        .addFields(
          {
            name: "User",
            value: targetUser ? `${targetUser.tag} (${originalUserId})` : `Unknown User (${originalUserId})`,
            inline: true,
          },
          { name: "Pardoned By", value: interaction.user.tag, inline: true },
          { name: "Pardon Command ID", value: `\`${pardonCommandId}\``, inline: true },
          { name: "Original Action", value: originalAction.toUpperCase(), inline: true },
          {
            name: "Original Moderator",
            value: originalModerator ? originalModerator.tag : "Unknown",
            inline: true,
          },
          { name: "Removed Command ID", value: `\`${commandIdInput}\``, inline: true },
          { name: "Original Reason", value: originalReason, inline: false },
          { name: "Pardon Reason", value: reason, inline: false },
          {
            name: "Original Date",
            value: `<t:${Math.floor(originalTimestamp.getTime() / 1000)}:F>`,
            inline: true,
          },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      // Send DM to the user about the pardon
      if (targetUser) {
        try {
          const dmEmbed = new EmbedBuilder()
            .setTitle("✅ Moderation Action Pardoned")
            .setColor(0x00ff00)
            .addFields(
              { name: "Server", value: interaction.guild.name, inline: true },
              { name: "Pardoned By", value: interaction.user.tag, inline: true },
              { name: "Pardon ID", value: `\`${pardonCommandId}\``, inline: true },
              { name: "Original Action", value: originalAction.toUpperCase(), inline: true },
              { name: "Pardon Reason", value: reason, inline: false },
              {
                name: "What This Means",
                value: "Your moderation record has been cleared. This action has been removed from your history.",
                inline: false,
              },
            )
            .setTimestamp()
            .setFooter({
              text: "Haxemo by Noan/Naikia • Made with love",
              iconURL: "https://noans.space/images/PFPLatex.png",
            })

          await targetUser.send({ embeds: [dmEmbed] })
          embed.addFields({ name: "Notification", value: "✅ User notified via DM", inline: true })
        } catch (dmError) {
          console.error("Failed to send pardon DM:", dmError)
          embed.addFields({ name: "Notification", value: "❌ Could not send DM to user", inline: true })
        }
      } else {
        embed.addFields({ name: "Notification", value: "⚠️ User not found for DM", inline: true })
      }

      // Send response immediately
      const replyMethod = interaction.deferred ? "editReply" : "reply"
      await interaction[replyMethod]({ embeds: [embed], ephemeral: true })

      // Send to mod log channel asynchronously
      sendModLog(
        interaction.client,
        {
          commandId: pardonCommandId,
          userId: originalUserId,
          moderatorId: interaction.user.id,
          action: "pardon",
          reason: reason,
          additionalInfo: `Pardoned ${originalAction} (ID: ${commandIdInput}) - Original reason: ${originalReason}`,
        },
        interaction,
      ).catch((error) => console.error("Failed to send mod log:", error))
    } catch (error) {
      console.error("Error pardoning moderation log:", error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"

      if (!interaction.replied) {
        await interaction[replyMethod]({
          content: "❌ An error occurred while pardoning the moderation log.",
          ephemeral: true,
        })
      }
    }
  },
}
