import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("about").setDescription("Learn more about Haxemo"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 About Haxemo")
      .setDescription("A comprehensive Discord moderation bot with advanced features")
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 256 }))
      .setColor(0x5865f2)
      .addFields(
        { name: "👨‍💻 Developer", value: "Noan/Naikia", inline: true },
        { name: "📦 Version", value: "V0.0.1", inline: true },
        { name: "🔗 GitHub", value: "[View Source Code](https://github.com/naikia)", inline: true },
        {
          name: "🌟 Features",
          value:
            "• Advanced Moderation\n• MongoDB Integration\n• Rotating Status Messages\n• Developer Commands\n• Comprehensive Logging\n• Fun Commands & Games",
          inline: false,
        },
        {
          name: "📊 Statistics",
          value: `• Servers: ${interaction.client.guilds.cache.size}\n• Users: ${interaction.client.users.cache.size}\n• Commands: ${interaction.client.commands.size}`,
          inline: false,
        },
      )
      .setFooter({
        text: "Haxemo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
