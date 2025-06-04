import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("quote").setDescription("Get an inspirational quote"),

  async execute(interaction) {
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
      },
      {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      },
      {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
      },
      {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers",
      },
      {
        text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
        author: "Unknown",
      },
    ]

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

    const embed = new EmbedBuilder()
      .setTitle("💭 Inspirational Quote")
      .setDescription(`*"${randomQuote.text}"*`)
      .addFields({ name: "Author", value: `— ${randomQuote.author}`, inline: false })
      .setColor(0x9b59b6)
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
