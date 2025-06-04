import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Set a reminder")
    .addStringOption((option) => option.setName("time").setDescription("Time (e.g., 5m, 1h, 2d)").setRequired(true))
    .addStringOption((option) => option.setName("message").setDescription("Reminder message").setRequired(true)),

  async execute(interaction) {
    const timeString = interaction.options.getString("time")
    const message = interaction.options.getString("message")

    // Parse time string
    const timeRegex = /^(\d+)([smhd])$/
    const match = timeString.match(timeRegex)

    if (!match) {
      return interaction.reply({
        content: "❌ Invalid time format! Use: 5s, 10m, 2h, or 1d",
        ephemeral: true,
      })
    }

    const amount = Number.parseInt(match[1])
    const unit = match[2]

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    }

    const delay = amount * multipliers[unit]

    if (delay > 7 * 24 * 60 * 60 * 1000) {
      // 7 days max
      return interaction.reply({
        content: "❌ Reminder time cannot exceed 7 days!",
        ephemeral: true,
      })
    }

    const embed = new EmbedBuilder()
      .setTitle("⏰ Reminder Set")
      .setColor(0x00ff00)
      .addFields(
        { name: "Time", value: timeString, inline: true },
        { name: "Message", value: message, inline: false },
        { name: "Reminder Time", value: `<t:${Math.floor((Date.now() + delay) / 1000)}:F>`, inline: false },
      )
      .setTimestamp()
      .setFooter({
        text: "Haxemo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })

    await interaction.reply({ embeds: [embed] })

    // Set the reminder
    setTimeout(async () => {
      try {
        const reminderEmbed = new EmbedBuilder()
          .setTitle("⏰ Reminder!")
          .setDescription(message)
          .setColor(0xffaa00)
          .addFields({ name: "Set by", value: interaction.user.tag, inline: true })
          .setTimestamp()
          .setFooter({
            text: "Haxemo by Noan/Naikia • Made with love",
            iconURL: "https://noans.space/images/PFPLatex.png",
          })

        await interaction.followUp({
          content: `${interaction.user}`,
          embeds: [reminderEmbed],
        })
      } catch (error) {
        console.error("Error sending reminder:", error)
      }
    }, delay)
  },
}
