import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Number of sides on the dice (default: 6)")
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false),
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Number of dice to roll (default: 1)")
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false),
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger("sides") || 6
    const count = interaction.options.getInteger("count") || 1

    const results = []
    let total = 0

    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1
      results.push(roll)
      total += roll
    }

    const embed = new EmbedBuilder()
      .setTitle("🎲 Dice Roll")
      .setColor(0xff6b6b)
      .addFields(
        { name: "Dice", value: `${count}d${sides}`, inline: true },
        { name: "Results", value: results.join(", "), inline: true },
        { name: "Total", value: total.toString(), inline: true },
      )
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
