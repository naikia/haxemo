import "dotenv/config"
import { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } from "discord.js"
import { connect } from "mongoose"
import { readdirSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
})

// Configuration with validation
const config = {
  token: process.env.DISCORD_TOKEN,
  mongoUri: process.env.MONGODB_URI,
  devId: process.env.DEV_DISCORD_ID,
  clientId: process.env.CLIENT_ID,
}

// Validate environment variables
function validateConfig() {
  const missing = []

  if (!config.token) missing.push("DISCORD_TOKEN")
  if (!config.mongoUri) missing.push("MONGODB_URI")
  if (!config.devId) missing.push("DEV_DISCORD_ID")
  if (!config.clientId) missing.push("CLIENT_ID")

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:")
    missing.forEach((env) => console.error(`   - ${env}`))
    console.error("\nPlease check your .env file and make sure all variables are set.")
    process.exit(1)
  }

  console.log("✅ All environment variables loaded successfully")
}

// Validate config on startup
validateConfig()

// Collections for commands
client.commands = new Collection()

// Load commands function
async function loadCommands() {
  const commandsPath = join(__dirname, "commands")
  const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".js"))

  console.log(`📁 Loading ${commandFiles.length} commands...`)

  for (const file of commandFiles) {
    const filePath = `file://${join(commandsPath, file).replace(/\\/g, "/")}`
    try {
      const command = await import(filePath)
      if ("data" in command.default && "execute" in command.default) {
        client.commands.set(command.default.data.name, command.default)
        console.log(`   ✅ Loaded: /${command.default.data.name}`)
      } else {
        console.log(`   ⚠️ Skipped: ${file} (missing required properties)`)
      }
    } catch (error) {
      console.error(`   ❌ Failed to load ${file}:`, error.message)
    }
  }
}

// Rotating status messages
const statusMessages = [
  { name: "over the server", type: ActivityType.Watching },
  { name: "For this bot visit https://naikia.me/haxemo", type: ActivityType.Playing },
  { name: "moderating chat", type: ActivityType.Playing },
  { name: "for rule breakers", type: ActivityType.Watching },
  { name: "/help for commands", type: ActivityType.Listening },
]

let currentStatusIndex = 0

// Rotate status every 30 seconds
function rotateStatus() {
  if (!client.user) return
  const status = statusMessages[currentStatusIndex]
  client.user.setActivity(status.name, { type: status.type })
  currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length
}

// Command usage statistics
client.commandStats = new Collection()

// Prefix command handlers
const prefixCommands = {
  warn: {
    description: "Warn a user",
    usage: ">warn (@user or ID) (reason)",
    permission: "Moderate Members",
    example: ">warn @user Breaking server rules",
  },
  kick: {
    description: "Kick a user from the server",
    usage: ">kick (@user or ID) (reason)",
    permission: "Kick Members",
    example: ">kick @user Spamming in chat",
  },
  ban: {
    description: "Ban a user from the server",
    usage: ">ban (@user or ID) (reason)",
    permission: "Ban Members",
    example: ">ban @user Harassment and toxicity",
  },
  timeout: {
    description: "Timeout a user",
    usage: ">timeout (@user or ID) (duration in minutes) (reason)",
    permission: "Moderate Members",
    example: ">timeout @user 60 Inappropriate behavior",
  },
  clear: {
    description: "Clear messages in channel",
    usage: ">clear (amount) [user]",
    permission: "Manage Messages",
    example: ">clear 50 or >clear 25 @user",
  },
  slowmode: {
    description: "Set channel slowmode",
    usage: ">slowmode (seconds)",
    permission: "Manage Channels",
    example: ">slowmode 30 or >slowmode 0",
  },
  lockdown: {
    description: "Lock or unlock channel",
    usage: ">lockdown (lock/unlock) (reason)",
    permission: "Manage Channels",
    example: ">lockdown lock Emergency situation",
  },
  pardon: {
    description: "Remove a moderation log entry",
    usage: ">pardon (Command ID) (reason)",
    permission: "Moderate Members",
    example: ">pardon ABC123-XYZ789 False positive",
  },
}

client.once("ready", async () => {
  try {
    console.log(`\n🤖 ${client.user.tag} is starting up...`)

    // Load commands
    await loadCommands()

    console.log(`\n✅ ${client.user.tag} is online!`)
    console.log(`📊 Loaded ${client.commands.size} commands`)
    console.log(`🌐 Connected to ${client.guilds.cache.size} servers`)
    console.log(`👥 Serving ${client.users.cache.size} users`)
    console.log(
      `🔗 Bot invite: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`,
    )

    // Connect to MongoDB
    try {
      await connect(config.mongoUri)
      console.log("✅ Connected to MongoDB")
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message)
      console.error("   Make sure your MONGODB_URI is correct and the database is accessible")
    }

    // Start status rotation
    rotateStatus()
    setInterval(rotateStatus, 30000)

    console.log("\n🚀 Bot is fully operational!")
  } catch (error) {
    console.error("❌ Error during startup:", error)
  }
})

// Handle prefix commands
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return
  if (!message.content.startsWith(">")) return

  const args = message.content.slice(1).trim().split(/ +/)
  const commandName = args.shift().toLowerCase()

  if (!prefixCommands[commandName]) return

  try {
    const command = prefixCommands[commandName]

    const embed = new EmbedBuilder()
      .setTitle(`🔧 ${commandName.charAt(0).toUpperCase() + commandName.slice(1)} Command Help`)
      .setDescription(command.description)
      .setColor(0x5865f2)
      .addFields(
        { name: "Usage", value: `\`${command.usage}\``, inline: false },
        { name: "Required Permission", value: command.permission, inline: true },
        { name: "Example", value: `\`${command.example}\``, inline: false },
        {
          name: "Slash Command Alternative",
          value: `Use \`/${commandName}\` for the full interactive command`,
          inline: false,
        },
      )
      .setFooter({
        text: "Haxemo by Noan/Naikia • Made with love",
        iconURL: "https://noans.space/images/PFPLatex.png",
      })
      .setTimestamp()

    await message.reply({ embeds: [embed] })
  } catch (error) {
    console.error(`Error handling prefix command ${commandName}:`, error)
    try {
      await message.reply("❌ An error occurred while showing command help.")
    } catch (replyError) {
      console.error("Failed to send error message for prefix command:", replyError)
    }
  }
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (!command) return

  try {
    // Track command usage
    if (!client.commandStats.has(interaction.commandName)) {
      client.commandStats.set(interaction.commandName, 1)
    } else {
      client.commandStats.set(interaction.commandName, client.commandStats.get(interaction.commandName) + 1)
    }

    console.log(`📝 ${interaction.user.tag} used /${interaction.commandName} in ${interaction.guild?.name || "DM"}`)

    // IMMEDIATELY defer reply for commands that might take time
    const timeoutCommands = ["mod-logs", "dev", "trivia", "clear", "pardon", "warn", "kick", "ban", "timeout"]
    if (timeoutCommands.includes(interaction.commandName)) {
      await interaction.deferReply({
        ephemeral: ["dev", "pardon", "mod-logs"].includes(interaction.commandName),
      })
    }

    await command.execute(interaction)
  } catch (error) {
    console.error(`❌ Error executing /${interaction.commandName}:`, error)

    const errorMessage = "❌ There was an error executing this command!"

    try {
      if (interaction.deferred) {
        if (!interaction.replied) {
          await interaction.editReply({ content: errorMessage })
        }
      } else if (!interaction.replied) {
        await interaction.reply({ content: errorMessage, ephemeral: true })
      }
    } catch (replyError) {
      console.error("❌ Failed to send error message:", replyError)
    }
  }
})

// Enhanced error handling
client.on("error", (error) => {
  console.error("Discord client error:", error)
})

client.on("warn", (warning) => {
  console.warn("Discord client warning:", warning)
})

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error)
})

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error)
  process.exit(1)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...")
  client.destroy()
  process.exit(0)
})

// Start the bot
console.log("🔄 Starting Haxemo Discord Bot...")
client.login(config.token).catch((error) => {
  console.error("❌ Failed to login:", error.message)
  console.error("   Please check your DISCORD_TOKEN in the .env file")
  process.exit(1)
})

export { client, config }
