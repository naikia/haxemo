import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8-ball a question")
    .addStringOption((option) =>
      option.setName("question").setDescription("Your question for the magic 8-ball").setRequired(true),
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question")

    const responses = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      "Reply hazy, try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const embed = new EmbedBuilder()
      .setTitle("🎱 Magic 8-Ball")
      .setColor(0x000000)
      .addFields(
        { name: "Question", value: question, inline: false },
        { name: "Answer", value: `*${randomResponse}*`, inline: false },
      )
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
