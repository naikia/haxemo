import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Play a trivia game")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Trivia category")
        .addChoices(
          { name: "General Knowledge", value: "general" },
          { name: "Science", value: "science" },
          { name: "History", value: "history" },
          { name: "Geography", value: "geography" },
          { name: "Technology", value: "technology" },
        ),
    ),

  async execute(interaction) {
    const category = interaction.options.getString("category") || "general"

    const triviaQuestions = {
      general: [
        {
          question: "What is the largest planet in our solar system?",
          options: ["Earth", "Jupiter", "Saturn", "Neptune"],
          correct: 1,
        },
        {
          question: "Which element has the chemical symbol 'O'?",
          options: ["Gold", "Silver", "Oxygen", "Iron"],
          correct: 2,
        },
      ],
      science: [
        {
          question: "What is the speed of light in vacuum?",
          options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
          correct: 0,
        },
        {
          question: "What is the chemical formula for water?",
          options: ["H2O", "CO2", "NaCl", "CH4"],
          correct: 0,
        },
      ],
      history: [
        {
          question: "In which year did World War II end?",
          options: ["1944", "1945", "1946", "1947"],
          correct: 1,
        },
        {
          question: "Who was the first person to walk on the moon?",
          options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
          correct: 1,
        },
      ],
      geography: [
        {
          question: "What is the capital of Australia?",
          options: ["Sydney", "Melbourne", "Canberra", "Perth"],
          correct: 2,
        },
        {
          question: "Which is the longest river in the world?",
          options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
          correct: 1,
        },
      ],
      technology: [
        {
          question: "Who founded Microsoft?",
          options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Larry Page"],
          correct: 1,
        },
        {
          question: "What does 'HTTP' stand for?",
          options: [
            "HyperText Transfer Protocol",
            "High Tech Transfer Protocol",
            "HyperText Transport Protocol",
            "High Transfer Text Protocol",
          ],
          correct: 0,
        },
      ],
    }

    const questions = triviaQuestions[category]
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]

    const embed = new EmbedBuilder()
      .setTitle("🧠 Trivia Question")
      .setDescription(randomQuestion.question)
      .setColor(0x9b59b6)
      .addFields(
        { name: "A", value: randomQuestion.options[0], inline: true },
        { name: "B", value: randomQuestion.options[1], inline: true },
        { name: "C", value: randomQuestion.options[2], inline: true },
        { name: "D", value: randomQuestion.options[3], inline: true },
      )
      .setFooter({
        text: "Haxemo by Noan/Naikia • Made with love • React with 🇦 🇧 🇨 🇩",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    const message = await interaction.reply({ embeds: [embed], fetchReply: true })

    // Add reaction options
    const reactions = ["🇦", "🇧", "🇨", "🇩"]
    for (const reaction of reactions) {
      await message.react(reaction)
    }

    // Wait for user reaction
    const filter = (reaction, user) => {
      return reactions.includes(reaction.emoji.name) && user.id === interaction.user.id
    }

    try {
      const collected = await message.awaitReactions({ filter, max: 1, time: 30000, errors: ["time"] })
      const reaction = collected.first()
      const userAnswer = reactions.indexOf(reaction.emoji.name)

      const resultEmbed = new EmbedBuilder()
        .setTitle("🧠 Trivia Result")
        .setDescription(randomQuestion.question)
        .addFields(
          { name: "Your Answer", value: randomQuestion.options[userAnswer], inline: true },
          { name: "Correct Answer", value: randomQuestion.options[randomQuestion.correct], inline: true },
          {
            name: "Result",
            value: userAnswer === randomQuestion.correct ? "✅ Correct!" : "❌ Incorrect!",
            inline: true,
          },
        )
        .setColor(userAnswer === randomQuestion.correct ? 0x00ff00 : 0xff0000)
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      await interaction.editReply({ embeds: [resultEmbed] })
    } catch {
      const timeoutEmbed = new EmbedBuilder()
        .setTitle("⏰ Time's Up!")
        .setDescription(`The correct answer was: **${randomQuestion.options[randomQuestion.correct]}**`)
        .setColor(0xffaa00)
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      await interaction.editReply({ embeds: [timeoutEmbed] })
    }
  },
}
