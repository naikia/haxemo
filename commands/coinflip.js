import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder().setName("coinflip").setDescription("Flip a coin"),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails"
    const emoji = result === "Heads" ? "🪙" : "🥈"

    const embed = new EmbedBuilder()
      .setTitle(`${emoji} Coin Flip`)
      .setDescription(`The coin landed on **${result}**!`)
      .setColor(result === "Heads" ? 0xffd700 : 0xc0c0c0)
      .setFooter({
        text: "Hexmo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await interaction.reply({ embeds: [embed] })
  },
}
