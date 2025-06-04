import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("help").setDescription("Show all available commands"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Haxemo Commands")
      .setDescription("Here are all the available commands:")
      .setColor(0x5865f2)
      .addFields(
        {
          name: "🛡️ Moderation Commands",
          value:
            "`/warn` - Warn a user\n`/kick` - Kick a user\n`/ban` - Ban a user\n`/timeout` - Timeout a user\n`/clear` - Delete multiple messages\n`/slowmode` - Set channel slowmode\n`/lockdown` - Lock/unlock channels\n`/mod-logs` - View user moderation logs\n`/pardon` - Remove moderation log entry",
          inline: false,
        },
        {
          name: "📋 Information Commands",
          value:
            "`/help` - Show this help menu\n`/about` - Learn about Haxemo\n`/userinfo` - Get user information\n`/serverinfo` - Get server information\n`/avatar` - Get user's avatar",
          inline: false,
        },
        {
          name: "🎮 Fun Commands",
          value:
            "`/8ball` - Ask the magic 8-ball\n`/joke` - Get a random joke\n`/coinflip` - Flip a coin\n`/dice` - Roll dice\n`/poll` - Create a poll\n`/rps` - Rock Paper Scissors\n`/quote` - Get inspirational quotes\n`/trivia` - Play trivia games",
          inline: false,
        },
        {
          name: "🔧 Utility Commands",
          value: "`/remind` - Set reminders\n`/math` - Calculate expressions",
          inline: false,
        },
        {
          name: "⚡ Quick Prefix Commands",
          value:
            "Type `>command` for quick help:\n`>warn` `>kick` `>ban` `>timeout`\n`>clear` `>slowmode` `>lockdown` `>pardon`",
          inline: false,
        },
        {
          name: "🔗 Links",
          value:
            "[Bot Website](https://naikia.me/haxemo) | [GitHub](https://github.com/naikia) | [Commands Guide](./COMMANDS.md)",
          inline: false,
        },
      )
      .setFooter({
        text: "Haxemo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed], ephemeral: true })
  },
}
