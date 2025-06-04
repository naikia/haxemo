import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to get information about").setRequired(false),
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") || interaction.user
    const member = interaction.guild.members.cache.get(targetUser.id)

    const embed = new EmbedBuilder()
      .setTitle(`👤 User Information`)
      .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
      .setColor(0x5865f2)
      .addFields(
        { name: "Username", value: targetUser.tag, inline: true },
        { name: "User ID", value: targetUser.id, inline: true },
        { name: "Account Created", value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: false },
      )

    if (member) {
      embed.addFields(
        { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        {
          name: "Roles",
          value:
            member.roles.cache
              .filter((role) => role.name !== "@everyone")
              .map((role) => role.toString())
              .join(", ") || "No roles",
          inline: false,
        },
        { name: "Highest Role", value: member.roles.highest.toString(), inline: true },
        {
          name: "Permissions",
          value: member.permissions.has("Administrator") ? "Administrator" : "Member",
          inline: true,
        },
      )
    }

    // Special developer section
    if (targetUser.id === "1364720573682290811") {
      embed.addFields({
        name: "🌟 Special Recognition",
        value: "This is the developer of the backend that this bot uses!",
        inline: false,
      })
    }

    embed
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
