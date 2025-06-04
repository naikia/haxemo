import "dotenv/config"
import { REST, Routes } from "discord.js"
import { readdirSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function deployCommands() {
  try {
    // Validate environment variables
    const token = process.env.DISCORD_TOKEN
    const clientId = process.env.CLIENT_ID

    if (!token || !clientId) {
      console.error("❌ Missing environment variables:")
      if (!token) console.error("   - DISCORD_TOKEN")
      if (!clientId) console.error("   - CLIENT_ID")
      console.error("\nPlease check your .env file.")
      process.exit(1)
    }

    console.log("🔄 Loading commands for deployment...")

    const commands = []
    const commandsPath = join(__dirname, "commands")
    const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".js"))

    // Load all commands
    for (const file of commandFiles) {
      const filePath = `file://${join(commandsPath, file).replace(/\\/g, "/")}`
      try {
        const command = await import(filePath)
        if ("data" in command.default && "execute" in command.default) {
          commands.push(command.default.data.toJSON())
          console.log(`   ✅ Loaded: /${command.default.data.name}`)
        } else {
          console.log(`   ⚠️ Skipped: ${file} (missing required properties)`)
        }
      } catch (error) {
        console.error(`   ❌ Failed to load ${file}:`, error.message)
      }
    }

    if (commands.length === 0) {
      console.error("❌ No valid commands found to deploy!")
      process.exit(1)
    }

    const rest = new REST().setToken(token)

    console.log(`\n🚀 Started refreshing ${commands.length} application (/) commands...`)

    const data = await rest.put(Routes.applicationCommands(clientId), { body: commands })

    console.log(`✅ Successfully reloaded ${data.length} application (/) commands!`)
    console.log("\n🎉 Commands deployed successfully! You can now start your bot.")
  } catch (error) {
    console.error("❌ Error deploying commands:", error)

    if (error.code === 50001) {
      console.error("   This error usually means the bot doesn't have the required permissions.")
      console.error("   Make sure your bot has the 'applications.commands' scope.")
    } else if (error.code === 401) {
      console.error("   Invalid bot token. Please check your DISCORD_TOKEN in the .env file.")
    }

    process.exit(1)
  }
}

// Run the deployment
deployCommands()
