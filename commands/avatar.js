import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar")
    .addUserOption((option) => option.setName("user").setDescription("User to get avatar from").setRequired(false)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") || interaction.user

    const embed = new EmbedBuilder()
      .setTitle(`🖼️ ${targetUser.tag}'s Avatar`)
      .setImage(targetUser.displayAvatarURL({ size: 512 }))
      .setColor(0x5865f2)
      .addFields({
        name: "Download Links",
        value: `[PNG](${targetUser.displayAvatarURL({ extension: "png", size: 512 })}) | [JPG](${targetUser.displayAvatarURL({ extension: "jpg", size: 512 })}) | [WEBP](${targetUser.displayAvatarURL({ extension: "webp", size: 512 })})`,
        inline: false,
      })
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
