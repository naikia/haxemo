import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { config } from "../index.js"
import { testModLogChannel } from "../utils/modLogger.js"

export default {
  data: new SlashCommandBuilder()
    .setName("dev")
    .setDescription("Developer menu - restricted access")
    .addSubcommand((subcommand) => subcommand.setName("uptime").setDescription("Check bot uptime"))
    .addSubcommand((subcommand) => subcommand.setName("ping").setDescription("Check bot latency"))
    .addSubcommand((subcommand) => subcommand.setName("info").setDescription("Get bot information"))
    .addSubcommand((subcommand) => subcommand.setName("system").setDescription("Get system information"))
    .addSubcommand((subcommand) => subcommand.setName("db").setDescription("Test database connection"))
    .addSubcommand((subcommand) => subcommand.setName("guilds").setDescription("List all guilds the bot is in"))
    .addSubcommand((subcommand) => subcommand.setName("stats").setDescription("View command usage statistics"))
    .addSubcommand((subcommand) => subcommand.setName("modlog").setDescription("Test mod log channel configuration")),

  async execute(interaction) {
    // Check if user is the developer
    if (interaction.user.id !== config.devId) {
      const replyMethod = interaction.deferred ? "editReply" : "reply"
      return interaction[replyMethod]({
        content: "❌ This command is restricted to the bot developer.",
        ephemeral: true,
      })
    }

    const subcommand = interaction.options.getSubcommand()

    try {
      switch (subcommand) {
        case "uptime":
          const uptime = process.uptime()
          const days = Math.floor(uptime / 86400)
          const hours = Math.floor((uptime % 86400) / 3600)
          const minutes = Math.floor((uptime % 3600) / 60)
          const seconds = Math.floor(uptime % 60)

          const embed = new EmbedBuilder()
            .setTitle("⏱️ Bot Uptime")
            .setDescription(`${days}d ${hours}h ${minutes}m ${seconds}s`)
            .setColor(0x00ff00)
            .setTimestamp()
            .setFooter({
              text: "Haxemo by Noan/Naikia • Made with love",
              iconURL: "https://noans.space/images/PFPLatex.png",
            })

          const replyMethod = interaction.deferred ? "editReply" : "reply"
          await interaction[replyMethod]({ embeds: [embed], ephemeral: true })
          break

        case "ping":
          const start = Date.now()
          const replyMethod2 = interaction.deferred ? "editReply" : "reply"
          const sent = await interaction[replyMethod2]({ content: "Pinging...", ephemeral: true, fetchReply: true })

          const pingEmbed = new EmbedBuilder()
            .setTitle("🏓 Pong!")
            .addFields(
              {
                name: "Roundtrip Latency",
                value: `${Date.now() - start}ms`,
                inline: true,
              },
              { name: "WebSocket Heartbeat", value: `${interaction.client.ws.ping}ms`, inline: true },
            )
            .setColor(0x00ff00)
            .setTimestamp()
            .setFooter({
              text: "Haxemo by Noan/Naikia • Made with love",
              iconURL: "https://noans.space/images/PFPLatex.png",
            })

          await interaction.editReply({ content: "", embeds: [pingEmbed] })
          break

        case "modlog":
          const testResult = await testModLogChannel(interaction.client)

          const modlogEmbed = new EmbedBuilder()
            .setTitle("🔧 Mod Log Channel Test")
            .setColor(testResult.success ? 0x00ff00 : 0xff0000)
            .setTimestamp()
            .setFooter({
              text: "Haxemo by Noan/Naikia • Made with love",
              iconURL: "https://noans.space/images/PFPLatex.png",
            })

          if (testResult.success) {
            modlogEmbed.addFields(
              { name: "Status", value: "✅ Working", inline: true },
              { name: "Channel", value: testResult.channel.name, inline: true },
              { name: "Guild", value: testResult.channel.guild, inline: true },
              { name: "Channel ID", value: testResult.channel.id, inline: false },
            )
          } else {
            modlogEmbed.addFields(
              { name: "Status", value: "❌ Failed", inline: true },
              { name: "Error", value: testResult.error, inline: false },
              { name: "Channel ID", value: process.env.MOD_LOG_CHANNEL_ID || "Not configured", inline: false },
            )
          }

          const replyMethod4 = interaction.deferred ? "editReply" : "reply"
          await interaction[replyMethod4]({ embeds: [modlogEmbed], ephemeral: true })
          break

        // Add other cases here with similar error handling...
        default:
          const replyMethod3 = interaction.deferred ? "editReply" : "reply"
          await interaction[replyMethod3]({
            content: "This subcommand is not yet implemented.",
            ephemeral: true,
          })
      }
    } catch (error) {
      console.error(`Error in dev command ${subcommand}:`, error)
      const replyMethod = interaction.deferred ? "editReply" : "reply"
      await interaction[replyMethod]({
        content: "❌ An error occurred while executing this command.",
        ephemeral: true,
      })
    }
  },
}
