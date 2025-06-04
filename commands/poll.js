import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll")
    .addStringOption((option) => option.setName("question").setDescription("The poll question").setRequired(true))
    .addStringOption((option) => option.setName("option1").setDescription("First option").setRequired(true))
    .addStringOption((option) => option.setName("option2").setDescription("Second option").setRequired(true))
    .addStringOption((option) => option.setName("option3").setDescription("Third option").setRequired(false))
    .addStringOption((option) => option.setName("option4").setDescription("Fourth option").setRequired(false)),

  async execute(interaction) {
    const question = interaction.options.getString("question")
    const option1 = interaction.options.getString("option1")
    const option2 = interaction.options.getString("option2")
    const option3 = interaction.options.getString("option3")
    const option4 = interaction.options.getString("option4")

    const options = [option1, option2]
    if (option3) options.push(option3)
    if (option4) options.push(option4)

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"]

    let description = ""
    for (let i = 0; i < options.length; i++) {
      description += `${emojis[i]} ${options[i]}\n`
    }

    const embed = new EmbedBuilder()
      .setTitle("📊 Poll")
      .addFields(
        { name: "Question", value: question, inline: false },
        { name: "Options", value: description, inline: false },
      )
      .setColor(0x5865f2)
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    const message = await interaction.reply({ embeds: [embed], fetchReply: true })

    // Add reactions for voting
    for (let i = 0; i < options.length; i++) {
      await message.react(emojis[i])
    }
  },
}
