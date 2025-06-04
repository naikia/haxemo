import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play Rock Paper Scissors")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Your choice")
        .setRequired(true)
        .addChoices(
          { name: "🪨 Rock", value: "rock" },
          { name: "📄 Paper", value: "paper" },
          { name: "✂️ Scissors", value: "scissors" },
        ),
    ),

  async execute(interaction) {
    const userChoice = interaction.options.getString("choice")
    const choices = ["rock", "paper", "scissors"]
    const botChoice = choices[Math.floor(Math.random() * choices.length)]

    const emojis = {
      rock: "🪨",
      paper: "📄",
      scissors: "✂️",
    }

    let result = ""
    let color = 0x5865f2

    if (userChoice === botChoice) {
      result = "It's a tie!"
      color = 0xffaa00
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "You win! 🎉"
      color = 0x00ff00
    } else {
      result = "You lose! 😢"
      color = 0xff0000
    }

    const embed = new EmbedBuilder()
      .setTitle("🎮 Rock Paper Scissors")
      .setColor(color)
      .addFields(
        { name: "Your Choice", value: `${emojis[userChoice]} ${userChoice}`, inline: true },
        { name: "Bot's Choice", value: `${emojis[botChoice]} ${botChoice}`, inline: true },
        { name: "Result", value: result, inline: false },
      )
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
