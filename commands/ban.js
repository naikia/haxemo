import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { generateCommandId } from "../utils/commandId.js"
import { sendModLog } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) => option.setName("user").setDescription("User to ban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for the ban").setRequired(false))
    .addIntegerOption((option) =>
      option
        .setName("delete-days")
        .setDescription("Days of messages to delete (0-7)")
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user")
    const reason = interaction.options.getString("reason") || "No reason provided"
    const deleteDays = interaction.options.getInteger("delete-days") || 0
    const commandId = generateCommandId()

    try {
      // Check if user is bannable
      const member = interaction.guild.members.cache.get(targetUser.id)
      if (member && !member.bannable) {
        return interaction.reply({
          content: "❌ I cannot ban this user. They may have higher permissions than me.",
          ephemeral: true,
        })
      }

      // Try to DM the user before banning (don't await)
      targetUser
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("🔨 You have been banned")
              .setColor(0xff0000)
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
          // Ignore DM errors
        })

      // Ban the user
      await interaction.guild.members.ban(targetUser, {
        reason: `${reason} | Moderator: ${interaction.user.tag} | ID: ${commandId}`,
        deleteMessageDays: deleteDays,
      })

      // Create mod log entry
      const modLog = new ModLog({
        commandId: commandId,
        userId: targetUser.id,
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        action: "ban",
        reason: reason,
        additionalInfo: deleteDays > 0 ? `${deleteDays} days of messages deleted` : null,
      })

      await modLog.save()

      const embed = new EmbedBuilder()
        .setTitle("🔨 User Banned")
        .setColor(0xff0000)
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

      if (deleteDays > 0) {
        embed.addFields({ name: "Messages Deleted", value: `${deleteDays} days`, inline: true })
      }

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
          action: "ban",
          reason: reason,
          additionalInfo: deleteDays > 0 ? `${deleteDays} days of messages deleted` : null,
        },
        interaction,
      ).catch((error) => console.error("Failed to send mod log:", error))
    } catch (error) {
      console.error("Error banning user:", error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"

      if (!interaction.replied) {
        await interaction[replyMethod]({
          content: "❌ An error occurred while banning the user.",
          ephemeral: true,
        })
      }
    }
  },
}
