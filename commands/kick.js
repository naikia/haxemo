import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js"
import ModLog from "../models/ModLog.js"
import { generateCommandId } from "../utils/commandId.js"
import { sendModLog } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((option) => option.setName("user").setDescription("User to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for the kick").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user")
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

      if (!member.kickable) {
        return interaction.reply({
          content: "❌ I cannot kick this user. They may have higher permissions than me.",
          ephemeral: true,
        })
      }

      // Try to DM the user before kicking (don't await)
      targetUser
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("👢 You have been kicked")
              .setColor(0xff6600)
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

      // Kick the user
      await member.kick(`${reason} | Moderator: ${interaction.user.tag} | ID: ${commandId}`)

      // Create mod log entry
      const modLog = new ModLog({
        commandId: commandId,
        userId: targetUser.id,
        guildId: interaction.guild.id,
        moderatorId: interaction.user.id,
        action: "kick",
        reason: reason,
      })

      await modLog.save()

      const embed = new EmbedBuilder()
        .setTitle("👢 User Kicked")
        .setColor(0xff6600)
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
          action: "kick",
          reason: reason,
        },
        interaction,
      ).catch((error) => console.error("Failed to send mod log:", error))
    } catch (error) {
      console.error("Error kicking user:", error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"

      if (!interaction.replied) {
        await interaction[replyMethod]({
          content: "❌ An error occurred while kicking the user.",
          ephemeral: true,
        })
      }
    }
  },
}
