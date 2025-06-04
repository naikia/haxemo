import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("serverinfo").setDescription("Get information about this server"),

  async execute(interaction) {
    const guild = interaction.guild
    const owner = await guild.fetchOwner()

    const embed = new EmbedBuilder()
      .setTitle(`🏰 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .setColor(0x5865f2)
      .addFields(
        { name: "Server ID", value: guild.id, inline: true },
        { name: "Owner", value: owner.user.tag, inline: true },
        { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false },
        { name: "Members", value: guild.memberCount.toString(), inline: true },
        { name: "Channels", value: guild.channels.cache.size.toString(), inline: true },
        { name: "Roles", value: guild.roles.cache.size.toString(), inline: true },
        { name: "Boost Level", value: `Level ${guild.premiumTier}`, inline: true },
        { name: "Boost Count", value: guild.premiumSubscriptionCount?.toString() || "0", inline: true },
        { name: "Verification Level", value: guild.verificationLevel.toString(), inline: true },
      )

    // Check if the developer is in this server
    const developerMember = guild.members.cache.get("1364720573682290811")
    if (developerMember) {
      embed.addFields({
        name: "🌟 Special Recognition",
        value: `${developerMember.user.tag} is in this server - This is the developer of the backend that this bot uses!`,
        inline: false,
      })
    }

    embed
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    if (guild.description) {
      embed.setDescription(guild.description)
    }

    await interaction.reply({ embeds: [embed] })
  },
}
