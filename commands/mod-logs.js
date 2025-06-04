import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { parseCommandId } from "../utils/commandId.js"

export default {
  data: new SlashCommandBuilder()
    .setName("mod-logs")
    .setDescription("View moderation logs for a user")
    .addStringOption((option) =>
      option.setName("user").setDescription("User ID or username to check logs for").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("command-id").setDescription("Specific command ID to look up").setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const userInput = interaction.options.getString("user")
    const commandIdInput = interaction.options.getString("command-id")
    let targetUser = null
    let userId = null

    try {
      // If searching by command ID
      if (commandIdInput) {
        const log = await ModLog.findOne({
          commandId: commandIdInput.toUpperCase(),
          guildId: interaction.guild.id,
        })

        if (!log) {
          const replyMethod = interaction.deferred ? "editReply" : "reply"
          return interaction[replyMethod]({
            content: `❌ No moderation log found with Command ID: \`${commandIdInput}\``,
            ephemeral: true,
          })
        }

        // Get user info
        try {
          targetUser = await interaction.client.users.fetch(log.userId)
        } catch {
          // User not found
        }

        const moderator = await interaction.client.users.fetch(log.moderatorId).catch(() => null)
        const commandDate = parseCommandId(log.commandId)

        const embed = new EmbedBuilder()
          .setTitle(`📋 Moderation Log Details`)
          .setDescription(`**Command ID:** \`${log.commandId}\``)
          .setColor(0xff6b6b)
          .addFields(
            {
              name: "User",
              value: targetUser ? `${targetUser.tag} (${log.userId})` : `Unknown User (${log.userId})`,
              inline: true,
            },
            { name: "Action", value: log.action.toUpperCase(), inline: true },
            { name: "Moderator", value: moderator ? moderator.tag : "Unknown", inline: true },
            { name: "Reason", value: log.reason, inline: false },
            { name: "Timestamp", value: `<t:${Math.floor(log.timestamp.getTime() / 1000)}:F>`, inline: true },
          )
          .setTimestamp()
          .setFooter({
            text: "Haxemo by Noan/Naikia • Made with love",
            iconURL: "https://noans.space/images/PFPLatex.png",
          })

        if (log.duration) {
          embed.addFields({ name: "Duration", value: log.duration, inline: true })
        }

        if (log.additionalInfo) {
          embed.addFields({ name: "Additional Info", value: log.additionalInfo, inline: false })
        }

        if (commandDate) {
          embed.addFields({
            name: "Command Executed",
            value: `<t:${Math.floor(commandDate.getTime() / 1000)}:F>`,
            inline: true,
          })
        }

        const replyMethod = interaction.deferred ? "editReply" : "reply"
        return interaction[replyMethod]({ embeds: [embed], ephemeral: true })
      }

      // Regular user lookup
      // Check if it's a user ID
      if (/^\d{17,19}$/.test(userInput)) {
        userId = userInput
        try {
          targetUser = await interaction.client.users.fetch(userId)
        } catch {
          // User not found, but we can still search logs
        }
      } else {
        // Try to find by username in guild
        const member = interaction.guild.members.cache.find(
          (m) =>
            m.user.username.toLowerCase() === userInput.toLowerCase() ||
            m.user.tag.toLowerCase() === userInput.toLowerCase(),
        )
        if (member) {
          targetUser = member.user
          userId = member.user.id
        }
      }

      if (!userId) {
        const replyMethod = interaction.deferred ? "editReply" : "reply"
        return interaction[replyMethod]({
          content: "❌ Could not find user. Please provide a valid user ID or username.",
          ephemeral: true,
        })
      }

      // Fetch mod logs from database
      const logs = await ModLog.find({
        userId: userId,
        guildId: interaction.guild.id,
      })
        .sort({ timestamp: -1 })
        .limit(10)

      if (logs.length === 0) {
        const replyMethod = interaction.deferred ? "editReply" : "reply"
        return interaction[replyMethod]({
          content: `📋 No moderation logs found for ${targetUser ? targetUser.tag : `User ID: ${userId}`}`,
          ephemeral: true,
        })
      }

      const embed = new EmbedBuilder()
        .setTitle(`📋 Moderation Logs`)
        .setDescription(
          `**User:** ${targetUser ? `${targetUser.tag} (${userId})` : `Unknown User (${userId})`}\n**Total Actions:** ${logs.length}`,
        )
        .setColor(0xff6b6b)
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love • Use /mod-logs with command-id for details",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      let logText = ""
      for (const log of logs) {
        const moderator = await interaction.client.users.fetch(log.moderatorId).catch(() => null)
        const date = log.timestamp.toLocaleDateString()
        const time = log.timestamp.toLocaleTimeString()

        logText += `**${log.action.toUpperCase()}** - ${date} ${time}\n`
        logText += `ID: \`${log.commandId}\` | Moderator: ${moderator ? moderator.tag : "Unknown"}\n`
        logText += `Reason: ${log.reason}\n`
        if (log.duration) logText += `Duration: ${log.duration}\n`
        logText += "\n"
      }

      // Split into multiple fields if too long
      if (logText.length > 1024) {
        const logs1 = logs.slice(0, 5)
        const logs2 = logs.slice(5, 10)

        let logText1 = ""
        let logText2 = ""

        for (const log of logs1) {
          const moderator = await interaction.client.users.fetch(log.moderatorId).catch(() => null)
          const date = log.timestamp.toLocaleDateString()
          const time = log.timestamp.toLocaleTimeString()

          logText1 += `**${log.action.toUpperCase()}** - ${date} ${time}\n`
          logText1 += `ID: \`${log.commandId}\` | Moderator: ${moderator ? moderator.tag : "Unknown"}\n`
          logText1 += `Reason: ${log.reason.substring(0, 50)}${log.reason.length > 50 ? "..." : ""}\n\n`
        }

        for (const log of logs2) {
          const moderator = await interaction.client.users.fetch(log.moderatorId).catch(() => null)
          const date = log.timestamp.toLocaleDateString()
          const time = log.timestamp.toLocaleTimeString()

          logText2 += `**${log.action.toUpperCase()}** - ${date} ${time}\n`
          logText2 += `ID: \`${log.commandId}\` | Moderator: ${moderator ? moderator.tag : "Unknown"}\n`
          logText2 += `Reason: ${log.reason.substring(0, 50)}${log.reason.length > 50 ? "..." : ""}\n\n`
        }

        embed.addFields(
          { name: "Recent Actions (1-5)", value: logText1 || "No logs found", inline: false },
          { name: "Recent Actions (6-10)", value: logText2 || "No additional logs", inline: false },
        )
      } else {
        embed.addFields({ name: "Recent Actions", value: logText || "No logs found", inline: false })
      }

      const replyMethod = interaction.deferred ? "editReply" : "reply"
      await interaction[replyMethod]({ embeds: [embed], ephemeral: true })
    } catch (error) {
      console.error("Error fetching mod logs:", error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"
      await interaction[replyMethod]({
        content: "❌ An error occurred while fetching moderation logs.",
        ephemeral: true,
      })
    }
  },
}
