import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { generateCommandId } from "../utils/commandId.js"
import { sendModLog } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addUserOption((option) => option.setName("user").setDescription("User to warn").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for the warning").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user")
    const reason = interaction.options.getString("reason") || "No reason provided"
    const commandId = generateCommandId()

    try {
      // Create mod log entry first
      const modLog = new ModLog({
        commandId: commandId,
        userId: targetUser.id,
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        action: "warn",
        reason: reason,
      })

      await modLog.save()

      const embed = new EmbedBuilder()
        .setTitle("⚠️ User Warned")
        .setColor(0xffaa00)
        .addFields(
          { name: "User", value: `${targetUser.tag} (${targetUser.id})`, inline: true },
          { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
          { name: "Command ID", value: `\`${commandId}\``, inline: true },
          { name: "Reason", value: reason, inline: false },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      // Try to DM the user (don't await to prevent delays)
      targetUser
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("⚠️ You have been warned")
              .setColor(0xffaa00)
              .addFields(
                { name: "Server", value: interaction.guild.name, inline: true },
                { name: "Moderator", value: interaction.user.tag, inline: true },
                { name: "Command ID", value: `\`${commandId}\``, inline: true },
                { name: "Reason", value: reason, inline: false },
              )
              .setTimestamp()
              .setFooter({
                text: "Haxemo by Noan/Naikia • Made with love",
                iconURL: "https://noans.space/images/PFPLatex.png",
              }),
          ],
        })
        .catch(() => {
          embed.addFields({ name: "Note", value: "Could not send DM to user", inline: false })
        })

      // Send response immediately
      const replyMethod = interaction.deferred ? "editReply" : "reply"
      await interaction[replyMethod]({ embeds: [embed] })

      // Send to mod log channel asynchronously (don't await)
      sendModLog(
        interaction.client,
        {
          commandId: commandId,
          userId: targetUser.id,
          moderatorId: interaction.user.id,
          action: "warn",
          reason: reason,
        },
        interaction,
      ).catch((error) => console.error("Failed to send mod log:", error))
    } catch (error) {
      console.error("Error warning user:", error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"

      if (!interaction.replied) {
        await interaction[replyMethod]({
          content: "❌ An error occurred while warning the user.",
          ephemeral: true,
        })
      }
    }
  },
}
