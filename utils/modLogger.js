import { EmbedBuilder } from "discord.js"
import { config } from "../index.js"

/**
 * Send moderation log to designated channel and handle failures
 * @param {Object} client - Discord client
 * @param {Object} logData - Moderation log data
 * @param {Object} interaction - Discord interaction (optional)
 */
export async function sendModLog(client, logData, interaction = null) {
  try {
    // Check if mod log channel is configured
    if (!process.env.MOD_LOG_CHANNEL_ID) {
      console.log("⚠️ MOD_LOG_CHANNEL_ID not configured, skipping channel log")
      return
    }

    const modLogChannel = await client.channels.fetch(process.env.MOD_LOG_CHANNEL_ID)

    if (!modLogChannel) {
      throw new Error("Mod log channel not found")
    }

    // Get user and moderator info
    let targetUser = null
    let moderator = null

    try {
      if (logData.userId && logData.userId !== "all") {
        targetUser = await client.users.fetch(logData.userId)
      }
      moderator = await client.users.fetch(logData.moderatorId)
    } catch (userError) {
      console.warn("Could not fetch user info for mod log:", userError.message)
    }

    // Create embed based on action type
    const embed = new EmbedBuilder().setTimestamp().setFooter({
      text: "Haxemo Moderation System",
      iconURL: client.user.displayAvatarURL(),
    })

    // Set color and title based on action
    const actionColors = {
      warn: 0xffaa00,
      kick: 0xff6600,
      ban: 0xff0000,
      timeout: 0xffaa00,
      clear: 0x00ff00,
      pardon: 0x00ff00,
      slowmode: 0x5865f2,
      lockdown: 0xff0000,
    }

    const actionEmojis = {
      warn: "⚠️",
      kick: "👢",
      ban: "🔨",
      timeout: "⏰",
      clear: "🧹",
      pardon: "✅",
      slowmode: "⏱️",
      lockdown: "🔒",
    }

    embed.setColor(actionColors[logData.action] || 0x5865f2)
    embed.setTitle(`${actionEmojis[logData.action] || "📋"} ${logData.action.toUpperCase()} Action`)

    // Add fields based on action type
    if (logData.action === "pardon") {
      embed.addFields(
        {
          name: "User",
          value: targetUser ? `${targetUser.tag}\n(${logData.userId})` : `Unknown User\n(${logData.userId})`,
          inline: true,
        },
        {
          name: "Pardoned By",
          value: moderator ? `${moderator.tag}\n(${logData.moderatorId})` : `Unknown\n(${logData.moderatorId})`,
          inline: true,
        },
        { name: "Command ID", value: `\`${logData.commandId}\``, inline: true },
        { name: "Reason", value: logData.reason, inline: false },
      )

      if (logData.additionalInfo) {
        embed.addFields({ name: "Details", value: logData.additionalInfo, inline: false })
      }
    } else if (logData.action === "clear") {
      embed.addFields(
        {
          name: "Moderator",
          value: moderator ? `${moderator.tag}\n(${logData.moderatorId})` : `Unknown\n(${logData.moderatorId})`,
          inline: true,
        },
        { name: "Command ID", value: `\`${logData.commandId}\``, inline: true },
        { name: "Channel", value: interaction ? `<#${interaction.channelId}>` : "Unknown", inline: true },
        { name: "Details", value: logData.reason, inline: false },
      )

      if (logData.additionalInfo) {
        embed.addFields({ name: "Target", value: logData.additionalInfo, inline: true })
      }
    } else {
      // Standard moderation actions
      embed.addFields(
        {
          name: "User",
          value: targetUser ? `${targetUser.tag}\n(${logData.userId})` : `Unknown User\n(${logData.userId})`,
          inline: true,
        },
        {
          name: "Moderator",
          value: moderator ? `${moderator.tag}\n(${logData.moderatorId})` : `Unknown\n(${logData.moderatorId})`,
          inline: true,
        },
        { name: "Command ID", value: `\`${logData.commandId}\``, inline: true },
        { name: "Reason", value: logData.reason, inline: false },
      )

      if (logData.duration) {
        embed.addFields({ name: "Duration", value: logData.duration, inline: true })
      }

      if (logData.additionalInfo) {
        embed.addFields({ name: "Additional Info", value: logData.additionalInfo, inline: false })
      }

      // Add server info if available
      if (interaction && interaction.guild) {
        embed.addFields({ name: "Server", value: interaction.guild.name, inline: true })
      }
    }

    await modLogChannel.send({ embeds: [embed] })
    console.log(`✅ Mod log sent to channel for action: ${logData.action} (ID: ${logData.commandId})`)
  } catch (error) {
    console.error("❌ Failed to send mod log to channel:", error)

    // Notify developer about the failure
    await notifyDeveloper(client, {
      type: "Mod Log Channel Error",
      error: error.message,
      logData: logData,
      channelId: process.env.MOD_LOG_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Notify developer about system errors
 * @param {Object} client - Discord client
 * @param {Object} errorData - Error information
 */
export async function notifyDeveloper(client, errorData) {
  try {
    if (!config.devId) {
      console.warn("⚠️ DEV_DISCORD_ID not configured, cannot notify developer")
      return
    }

    const developer = await client.users.fetch(config.devId)

    const embed = new EmbedBuilder()
      .setTitle("🚨 Haxemo System Error")
      .setColor(0xff0000)
      .addFields(
        { name: "Error Type", value: errorData.type, inline: true },
        { name: "Timestamp", value: errorData.timestamp, inline: true },
        { name: "Error Message", value: `\`\`\`${errorData.error}\`\`\``, inline: false },
      )
      .setTimestamp()
      .setFooter({
        text: "Haxemo Error Notification System",
        iconURL: client.user.displayAvatarURL(),
      })

    // Add specific error details
    if (errorData.channelId) {
      embed.addFields({ name: "Channel ID", value: errorData.channelId, inline: true })
    }

    if (errorData.logData) {
      embed.addFields({
        name: "Failed Log Data",
        value: `Action: ${errorData.logData.action}\nCommand ID: ${errorData.logData.commandId}\nUser: ${errorData.logData.userId}`,
        inline: false,
      })
    }

    if (errorData.guildInfo) {
      embed.addFields({
        name: "Guild Info",
        value: `Name: ${errorData.guildInfo.name}\nID: ${errorData.guildInfo.id}`,
        inline: false,
      })
    }

    await developer.send({ embeds: [embed] })
    console.log("✅ Developer notified about error")
  } catch (dmError) {
    console.error("❌ Failed to notify developer:", dmError.message)
    // Log to console as fallback
    console.error("🚨 CRITICAL ERROR - Could not notify developer:")
    console.error("Original Error:", errorData)
    console.error("DM Error:", dmError.message)
  }
}

/**
 * Test mod log channel configuration
 * @param {Object} client - Discord client
 * @returns {Object} Test result
 */
export async function testModLogChannel(client) {
  try {
    if (!process.env.MOD_LOG_CHANNEL_ID) {
      return {
        success: false,
        error: "MOD_LOG_CHANNEL_ID not configured",
      }
    }

    const channel = await client.channels.fetch(process.env.MOD_LOG_CHANNEL_ID)

    if (!channel) {
      return {
        success: false,
        error: "Channel not found",
      }
    }

    if (!channel.isTextBased()) {
      return {
        success: false,
        error: "Channel is not text-based",
      }
    }

    // Test permissions
    const permissions = channel.permissionsFor(client.user)
    if (!permissions.has(["SendMessages", "EmbedLinks"])) {
      return {
        success: false,
        error: "Missing permissions (Send Messages, Embed Links)",
      }
    }

    return {
      success: true,
      channel: {
        name: channel.name,
        id: channel.id,
        guild: channel.guild.name,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
