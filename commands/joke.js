import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("joke").setDescription("Get a random joke"),

  async execute(interaction) {
    const jokes = [
      {
        setup: "Why don't scientists trust atoms?",
        punchline: "Because they make up everything!",
      },
      {
        setup: "Why did the scarecrow win an award?",
        punchline: "He was outstanding in his field!",
      },
      {
        setup: "Why don't eggs tell jokes?",
        punchline: "They'd crack each other up!",
      },
      {
        setup: "What do you call a fake noodle?",
        punchline: "An impasta!",
      },
      {
        setup: "Why did the math book look so sad?",
        punchline: "Because it was full of problems!",
      },
      {
        setup: "What do you call a bear with no teeth?",
        punchline: "A gummy bear!",
      },
      {
        setup: "Why don't programmers like nature?",
        punchline: "It has too many bugs!",
      },
      {
        setup: "What's the best thing about Switzerland?",
        punchline: "I don't know, but the flag is a big plus!",
      },
      {
        setup: "Why do programmers prefer dark mode?",
        punchline: "Because light attracts bugs!",
      },
      {
        setup: "How do you organize a space party?",
        punchline: "You planet!",
      },
    ]

    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]

    const embed = new EmbedBuilder()
      .setTitle("😂 Random Joke")
      .setColor(0xffdd44)
      .addFields(
        { name: "Setup", value: randomJoke.setup, inline: false },
        { name: "Punchline", value: randomJoke.punchline, inline: false },
      )
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
