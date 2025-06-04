# Haxemo Discord Bot

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14+-blue.svg)](https://discord.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Compatible-green.svg)](https://mongodb.com/)
[![Support Server](https://img.shields.io/badge/Discord-Support%20Server-7289da.svg?logo=discord&logoColor=white)](https://discord.gg/72rafaY2rq)
[![Website](https://img.shields.io/badge/Website-Noans's_Space-orange.svg)](https://noans.space)

A comprehensive Discord moderation bot with rotating status messages, MongoDB integration, developer commands, and advanced logging features.

## ✨ Features

- 🔄 **Rotating Status Messages** - Including custom website link
- 🛡️ **Advanced Moderation** - Warn, kick, ban, timeout users with Command ID tracking
- 📋 **Comprehensive Logging** - Track all actions with unique Command IDs
- 🔍 **User Lookup** - Search by ID or username with detailed information
- 👨‍💻 **Developer Menu** - Restricted commands for bot owner
- 💾 **MongoDB Integration** - Persistent data storage with audit trails
- 🎮 **Fun Commands** - Entertainment and interactive features
- ⚡ **Quick Help System** - Prefix commands for instant help
- 🆔 **Command ID System** - Unique tracking for all moderation actions
- ✅ **Pardon System** - Remove incorrect moderation entries with user notifications
- 📢 **Mod Log Channel** - Centralized logging to designated channel
- 🚨 **Error Notifications** - Developer alerts for system issues

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - [MongoDB Atlas](https://mongodb.com/atlas) (recommended) or local installation
- **Discord Bot Token** - [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

#### 🖥️ Basic Setup (All Platforms)

\`\`\`bash
# Clone the repository
git clone https://github.com/naikia/haxemo.git
cd haxemo

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration (see Configuration section)

# Deploy commands
npm run deploy

# Start the bot
npm start
\`\`\`

#### 🐧 Linux Production Setup (systemd service)

**1. Setup the bot:**
\`\`\`bash
# Clone to your preferred location
git clone https://github.com/naikia/haxemo.git /path/to/your/bot
cd /path/to/your/bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with your configuration
\`\`\`

**2. Configure the service:**
\`\`\`bash
# Copy the service file
sudo cp haxemo.service /etc/systemd/system/

# Edit the service file with your paths and username
sudo nano /etc/systemd/system/haxemo.service
\`\`\`

**Update these lines in the service file:**
\`\`\`ini
User=your-username                    # Replace with your username
WorkingDirectory=/path/to/your/bot    # Replace with your bot's path
\`\`\`

**3. Start the service:**
\`\`\`bash
# Reload systemd and enable the service
sudo systemctl daemon-reload
sudo systemctl enable haxemo

# Deploy commands first
cd /path/to/your/bot
npm run deploy

# Start the service
sudo systemctl start haxemo

# Check status
sudo systemctl status haxemo
\`\`\`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

\`\`\`env
# Discord Bot Configuration (Required)
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
DEV_DISCORD_ID=your_discord_id_here

# Database Configuration (Required)
MONGODB_URI=mongodb://localhost:27017/discord-bot
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# Mod Log Channel (Optional)
MOD_LOG_CHANNEL_ID=your_mod_log_channel_id_here

# Optional API Keys
WEATHER_API_KEY=your_openweathermap_api_key_here
\`\`\`

### Getting Your Configuration Values

#### Discord Bot Token & Client ID
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select existing one
3. Go to "Bot" section
4. Copy the **Token** (keep this secret!)
5. Go to "General Information" and copy **Application ID** (this is your CLIENT_ID)

#### Your Discord ID
1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click your username and select "Copy ID"

#### MongoDB URI
- **MongoDB Atlas (Recommended)**: Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
- **Local MongoDB**: Use `mongodb://localhost:27017/discord-bot`

#### Mod Log Channel ID (Optional)
1. Right-click your mod log channel in Discord
2. Select "Copy ID"
3. Add to `.env` file

## 🔧 Linux Service Management

### Service Commands
\`\`\`bash
# Start the bot
sudo systemctl start haxemo

# Stop the bot
sudo systemctl stop haxemo

# Restart the bot
sudo systemctl restart haxemo

# Enable auto-start on boot
sudo systemctl enable haxemo

# Disable auto-start
sudo systemctl disable haxemo

# Check status
sudo systemctl status haxemo

# View logs
sudo journalctl -u haxemo -f

# View recent logs
sudo journalctl -u haxemo --since "1 hour ago"
\`\`\`

### Configuration Updates
\`\`\`bash
# Edit configuration
nano /path/to/your/bot/.env

# Restart after changes
sudo systemctl restart haxemo

# Deploy new commands
cd /path/to/your/bot
npm run deploy
sudo systemctl restart haxemo
\`\`\`

### Updates
\`\`\`bash
# Stop the service
sudo systemctl stop haxemo

# Update code
cd /path/to/your/bot
git pull

# Install new dependencies
npm install

# Deploy commands if needed
npm run deploy

# Start the service
sudo systemctl start haxemo
\`\`\`

## 🤖 Bot Setup

### 1. Invite Bot to Server
Use this URL (replace `YOUR_CLIENT_ID`):
\`\`\`
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
\`\`\`

### 2. Required Permissions
- View Channels
- Send Messages
- Use Slash Commands
- Embed Links
- Add Reactions
- Read Message History
- Kick Members
- Ban Members
- Moderate Members
- Manage Messages
- Manage Channels

### 3. Deploy Commands
\`\`\`bash
npm run deploy
\`\`\`

## 📋 Commands

### 🛡️ Moderation Commands
- `/warn <user> [reason]` - Warn a user
- `/kick <user> [reason]` - Kick a user from the server
- `/ban <user> [reason] [delete-days]` - Ban a user
- `/timeout <user> <duration> [reason]` - Timeout a user
- `/clear <amount> [user]` - Delete multiple messages
- `/slowmode <seconds>` - Set channel slowmode
- `/lockdown <action> [reason]` - Lock/unlock channels
- `/mod-logs <user> [command-id]` - View moderation logs
- `/pardon <command-id> <reason>` - Remove moderation log entry (sends DM to user)

### 📋 Information Commands
- `/help` - Show all available commands
- `/about` - Learn about Haxemo
- `/userinfo [user]` - Get user information
- `/serverinfo` - Get server information
- `/avatar [user]` - Get user's avatar

### 🎮 Fun Commands
- `/8ball <question>` - Ask the magic 8-ball
- `/joke` - Get a random joke
- `/coinflip` - Flip a coin
- `/dice [sides] [count]` - Roll dice
- `/poll <question> <options>` - Create a poll
- `/rps <choice>` - Rock Paper Scissors
- `/quote` - Get inspirational quotes
- `/trivia [category]` - Play trivia games

### 🔧 Utility Commands
- `/remind <time> <message>` - Set reminders
- `/math <expression>` - Calculate expressions

### ⚡ Quick Prefix Commands
Type `>command` for instant help:
- `>warn`, `>kick`, `>ban`, `>timeout`
- `>clear`, `>slowmode`, `>lockdown`, `>pardon`

### 👨‍💻 Developer Commands
- `/dev uptime` - Check bot uptime
- `/dev ping` - Check bot latency
- `/dev modlog` - Test mod log channel
- And more...

## 🆔 Command ID System

Every moderation action generates a unique Command ID for tracking:

### Features
- **Unique Tracking**: Every action gets a unique ID (e.g., `LN2K4X-A7B9C2`)
- **Easy Reference**: Use Command IDs to reference specific actions
- **Audit Trail**: Complete tracking of all moderation actions
- **Pardon System**: Remove incorrect actions using Command IDs
- **User Notifications**: Users are automatically notified when actions are pardoned

### Usage Examples
\`\`\`bash
# View specific action
/mod-logs user:@user command-id:LN2K4X-A7B9C2

# Pardon an action (user gets DM notification)
/pardon LN2K4X-A7B9C2 False positive

# Reference in discussions
"Please review Command ID LN2K4X-A7B9C2"
\`\`\`

## 🔍 Troubleshooting

### Common Issues

#### Bot Not Responding
\`\`\`bash
# Check if service is running (Linux)
sudo systemctl status haxemo

# Check logs for errors
sudo journalctl -u haxemo --since "10 minutes ago"

# Restart the service
sudo systemctl restart haxemo

# For non-service setup, check if process is running
ps aux | grep node
\`\`\`

#### Commands Not Working
\`\`\`bash
# Redeploy commands
cd /path/to/your/bot
npm run deploy

# Check bot permissions in Discord server
# Restart bot after deploying commands
\`\`\`

#### Database Connection Issues
\`\`\`bash
# Check MongoDB connection in logs
sudo journalctl -u haxemo | grep -i mongo

# Test connection manually
cd /path/to/your/bot
node -e "
import('dotenv/config');
import('mongoose').then(({connect}) => {
  connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected'))
    .catch(err => console.log('❌ Error:', err));
});
"
\`\`\`

#### Service File Issues
\`\`\`bash
# Check service file syntax
sudo systemctl status haxemo

# Reload after editing service file
sudo systemctl daemon-reload

# Check service file location
ls -la /etc/systemd/system/haxemo.service
\`\`\`

### Log Locations
- **Service Logs**: `sudo journalctl -u haxemo`
- **Application Logs**: Console output in service logs
- **Error Logs**: Check systemd journal for errors

## 🔒 Security

### Best Practices
- Keep your bot token secret and never commit it to version control
- Use MongoDB Atlas with authentication for production
- Run the bot as a non-privileged user
- Regularly update dependencies: `npm audit fix`
- Monitor logs for suspicious activity
- Use environment variables for all sensitive configuration

### File Permissions
\`\`\`bash
# Secure configuration file
chmod 600 /path/to/your/bot/.env

# Ensure proper ownership
chown -R your-username:your-username /path/to/your/bot
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Development Setup
\`\`\`bash
# Clone your fork
git clone https://github.com/yourusername/haxemo.git
cd haxemo

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your test bot configuration

# Run in development mode
npm run dev
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub**: [github.com/naikia/haxemo](https://github.com/naikia/haxemo)
- **Support Server**: [Discord](https://discord.gg/coming-soon) *(Coming Soon)*
- **Developer**: [Noan/Naikia](https://noans.space)

## 📊 Statistics

- **Servers**: Dynamic count shown in `/about` command
- **Commands**: 25+ slash commands + prefix help system
- **Uptime**: Check with `/dev uptime` command
- **Version**: V0.0.1

## 🙏 Acknowledgments

- Built with [Discord.js](https://discord.js.org/)
- Database powered by [MongoDB](https://mongodb.com/)
- Hosted on Linux with systemd
- Created with ❤️ by [Noan/Naikia](https://noans.space)

---

*For support and updates, join our Discord server (coming soon) or visit our website!*
