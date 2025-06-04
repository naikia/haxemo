import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("math")
    .setDescription("Perform mathematical calculations")
    .addStringOption((option) =>
      option
        .setName("expression")
        .setDescription("Mathematical expression (e.g., 2+2, 5*3, sqrt(16))")
        .setRequired(true),
    ),

  async execute(interaction) {
    const expression = interaction.options.getString("expression")

    try {
      // Basic security: only allow safe mathematical operations
      const safeExpression = expression.replace(/[^0-9+\-*/().\s]/g, "").replace(/\s/g, "")

      if (safeExpression !== expression.replace(/\s/g, "")) {
        return interaction.reply({
          content:
            "❌ Invalid characters in expression. Only numbers and basic operators (+, -, *, /, ()) are allowed.",
          ephemeral: true,
        })
      }

      // Evaluate the expression
      const result = eval(safeExpression)

      if (!isFinite(result)) {
        return interaction.reply({
          content: "❌ Invalid calculation result.",
          ephemeral: true,
        })
      }

      const embed = new EmbedBuilder()
        .setTitle("🧮 Calculator")
        .setColor(0x5865f2)
        .addFields(
          { name: "Expression", value: `\`${expression}\``, inline: false },
          { name: "Result", value: `\`${result}\``, inline: false },
        )
        .setTimestamp()
        .setFooter({
          text: "Haxemo by Noan/Naikia • Made with love",
          iconURL: "https://noans.space/images/PFPLatex.png",
        })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error("Math calculation error:", error)
      await interaction.reply({
        content: "❌ Invalid mathematical expression.",
        ephemeral: true,
      })
    }
  },
}
