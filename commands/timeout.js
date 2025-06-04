import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { generateCommandId } from "../utils/commandId.js"
import { sendModLog } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) => option.setName("user").setDescription("User to timeout").setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in minutes (1-40320)")
        .setMinValue(1)
        .setMaxValue(40320)
        .setRequired(true),
    )
    .addStringOption((option) => option.setName("reason").setDescription("Reason for the timeout").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user")
    const duration = interaction.options.getInteger("duration")
    const reason = interaction.options.getString("reason") || "No reason provided"
    const commandId = generateCommandId()

    try {
      const member = interaction.guild.members.cache.get(targetUser.id)

      if (!member) {
        return interaction.reply({
          content: "❌ User is not in this server.",
          ephemeral: true,
        })
      }

      if (!member.moderatable) {
        return interaction.reply({
          content: "❌ I cannot timeout this user. They may have higher permissions than me.",
          ephemeral: true,
        })
      }

      // Calculate timeout duration
      const timeoutDuration = duration * 60 * 1000 // Convert minutes to milliseconds
      const timeoutUntil = new Date(Date.now() + timeoutDuration)

      // Apply timeout
      await member.timeout(timeoutDuration, `${reason} | Moderator: ${interaction.user.tag} | ID: ${commandId}`)

      // Create mod log entry
      const modLog = new ModLog({
        commandId: commandId,
        userId: targetUser.id,
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        action: "timeout",
        reason: reason,
        duration: `${duration} minutes`,
      })

      await modLog.save()

      // Try to DM the user (don't await)
      targetUser
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("⏰ You have been timed out")
              .setColor(0xffaa00)
              .addFields(
                { name: "Server", value: interaction.guild.name, inline: true },
                { name: "Moderator", value: interaction.user.tag, inline: true },
                { name: "Command ID", value: `\`${commandId}\``, inline: true },
                { name: "Duration", value: `${duration} minutes`, inline: true },
                { name: "Reason", value: reason, inline: false },
                { name: "Timeout ends", value: `<t:${Math.floor(timeoutUntil.getTime() / 1000)}:F>`, inline: false },
              )
              .setTimestamp()
              .setFooter({
                text: "Haxemo by Noan/Naikia • Made with love",
                iconURL: "https://noans.space/images/PFPLatex.png",
              }),
          ],
        })
        .catch(() => {
          // Ignore DM errors
        })

      const embed = new EmbedBuilder()
        .setTitle("⏰ User Timed Out")
        .setColor(0xffaa00)
        .addFields(
          { name: "User", value: `${targetUser.tag} (${targetUser.id})`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Command ID", value: `\`${commandId}\``, inline: true },
          { name: "Duration", value: `${duration} minutes`, inline: true },
          { name: "Reason", value: reason, inline: false },
          { name: "Timeout ends", value: `<t:${Math.floor(timeoutUntil.getTime() / 1000)}:F>`, inline: false },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      // Send response immediately
      const replyMethod = interaction.deferred ? "editReply" : "reply"
      await interaction[replyMethod]({ embeds: [embed] })

      // Send to mod log channel asynchronously
      sendModLog(
        interaction.client,
        {
          commandId: commandId,
          userId: targetUser.id,
          moderatorId: interaction.user.id,
          action: "timeout",
          reason: reason,
          duration: `${duration} minutes`,
        },
        interaction,
      ).catch((error) => console.error("Failed to send mod log:", error))
    } catch (error) {
      console.error("Error timing out user:", error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"

      if (!interaction.replied) {
        await interaction[replyMethod]({
          content: "❌ An error occurred while timing out the user.",
          ephemeral: true,
        })
      }
    }
  },
}
