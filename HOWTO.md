# Haxemo Bot Setup Guide

This guide will walk you through the complete setup process for the Haxemo Discord bot, including:
- Creating a Discord application and bot
- Setting up a MongoDB database
- Configuring environment variables
- Inviting the bot to your server
- Running the bot

## Table of Contents
- [Creating a Discord Application](#creating-a-discord-application)
- [Setting Up MongoDB](#setting-up-mongodb)
  - [Option 1: MongoDB Atlas (Cloud - Recommended)](#option-1-mongodb-atlas-cloud---recommended)
  - [Option 2: Local MongoDB Installation](#option-2-local-mongodb-installation)
- [Bot Configuration](#bot-configuration)
- [Inviting the Bot to Your Server](#inviting-the-bot-to-your-server)
- [Running the Bot](#running-the-bot)
  - [Regular Method](#regular-method)
  - [Linux Service Method](#linux-service-method)
- [Setting Up a Mod Log Channel](#setting-up-a-mod-log-channel)
- [Troubleshooting](#troubleshooting)

## Creating a Discord Application

1. **Go to the Discord Developer Portal**
   - Visit [https://discord.com/developers/applications](https://discord.com/developers/applications)
   - Log in with your Discord account if prompted

2. **Create a New Application**
   - Click the "New Application" button in the top right
   - Enter "Haxemo" (or your preferred name) as the application name
   - Accept the terms and click "Create"

3. **Configure Application Settings**
   - In the "General Information" tab:
     - Add a description (optional)
     - Upload an app icon (optional)
     - **Important**: Copy the "Application ID" - you'll need this later as your CLIENT_ID

4. **Create a Bot User**
   - Click on the "Bot" tab in the left sidebar
   - Click "Add Bot" and confirm with "Yes, do it!"
   - Under the bot's username, you'll see options to customize your bot:
     - Upload a bot avatar (optional)
     - Toggle "Public Bot" (keep enabled if you want others to invite your bot)
     - **Important**: Enable "Message Content Intent" under "Privileged Gateway Intents"
     - Also enable "Server Members Intent" and "Presence Intent"

5. **Get Your Bot Token**
   - In the "Bot" tab, click "Reset Token" and confirm
   - **Important**: Copy the token - this is your DISCORD_TOKEN
   - ⚠️ **NEVER share this token publicly** - it gives full access to your bot

6. **Set OAuth2 URL Generator**
   - Click on "OAuth2" in the left sidebar
   - Select "URL Generator"
   - Under "Scopes", check "bot" and "applications.commands"
   - Under "Bot Permissions", select:
     - Read Messages/View Channels
     - Send Messages
     - Embed Links
     - Attach Files
     - Read Message History
     - Add Reactions
     - Use Slash Commands
     - Kick Members
     - Ban Members
     - Moderate Members
     - Manage Messages
     - Manage Channels
   - **Save the generated URL** - you'll use this to invite your bot to servers

## Setting Up MongoDB

You have two options for MongoDB: cloud-hosted (Atlas) or local installation.

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create a MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a New Cluster**
   - After logging in, click "Build a Database"
   - Select the free tier option (M0)
   - Choose your preferred cloud provider and region
   - Click "Create Cluster" (this may take a few minutes)

3. **Set Up Database Access**
   - In the left sidebar, click "Database Access" under "Security"
   - Click "Add New Database User"
   - Create a username and password (use a strong password)
   - Set "Database User Privileges" to "Atlas admin"
   - Click "Add User"

4. **Configure Network Access**
   - In the left sidebar, click "Network Access" under "Security"
   - Click "Add IP Address"
   - To allow access from anywhere, click "Allow Access from Anywhere" (for development)
   - For production, add only your server's IP address
   - Click "Confirm"

5. **Get Your Connection String**
   - In the left sidebar, click "Database" under "Deployments"
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with `haxemo` (or your preferred database name)
   - This is your MONGODB_URI

### Option 2: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Follow the official instructions for your operating system:
     - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
     - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
     - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   - Windows: MongoDB should run as a service automatically
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Verify Installation**
   - Open a terminal/command prompt
   - Run `mongosh` to connect to your MongoDB instance
   - You should see the MongoDB shell prompt

4. **Create a Database**
   - In the MongoDB shell, run:
     \`\`\`
     use haxemo
     \`\`\`
   - Your connection string will be: `mongodb://localhost:27017/haxemo`

## Bot Configuration

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/naikia/haxemo.git
   cd haxemo
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create Environment File**
   - Copy the example environment file:
     \`\`\`bash
     cp .env.example .env
     \`\`\`
   - Edit the `.env` file with your information:
     \`\`\`bash
     nano .env
     \`\`\`
   - Add the following values:
     \`\`\`
     # Discord Bot Configuration
     DISCORD_TOKEN=your_bot_token_from_step_5
     CLIENT_ID=your_application_id_from_step_3
     DEV_DISCORD_ID=your_discord_user_id

     # Database Configuration
     MONGODB_URI=your_mongodb_connection_string_from_earlier

     # Optional: Mod Log Channel
     MOD_LOG_CHANNEL_ID=
     \`\`\`

4. **Get Your Discord User ID**
   - Enable Developer Mode in Discord:
     - Open Discord
     - Go to User Settings (gear icon) → Advanced
     - Enable "Developer Mode"
   - Right-click on your username in any chat
   - Select "Copy ID"
   - Paste this as your DEV_DISCORD_ID in the .env file

## Inviting the Bot to Your Server

1. **Use the OAuth2 URL**
   - Copy the URL you generated in step 6 of "Creating a Discord Application"
   - Paste it into your web browser
   - Select the server you want to add the bot to
   - Click "Authorize"
   - Complete the CAPTCHA if prompted

2. **Verify Bot Joined**
   - Check your Discord server
   - The bot should appear in the member list
   - It will initially be offline until you start the bot

## Running the Bot

### Regular Method

1. **Deploy Commands**
   \`\`\`bash
   npm run deploy
   \`\`\`
   This registers all slash commands with Discord.

2. **Start the Bot**
   \`\`\`bash
   npm start
   \`\`\`
   The bot should now be online in your Discord server.

3. **Test the Bot**
   - Try using the `/help` command in your server
   - The bot should respond with a list of available commands

### Linux Service Method

1. **Edit the Service File**
   - Open the service file:
     \`\`\`bash
     nano haxemo.service
     \`\`\`
   - Update these lines:
     \`\`\`ini
     User=your-username                    # Replace with your username
     WorkingDirectory=/path/to/your/bot    # Replace with your bot's path
     \`\`\`

2. **Install the Service**
   \`\`\`bash
   sudo cp haxemo.service /etc/systemd/system/
   sudo systemctl daemon-reload
   \`\`\`

3. **Deploy Commands**
   \`\`\`bash
   npm run deploy
   \`\`\`

4. **Start the Service**
   \`\`\`bash
   sudo systemctl enable haxemo
   sudo systemctl start haxemo
   \`\`\`

5. **Check Status**
   \`\`\`bash
   sudo systemctl status haxemo
   \`\`\`

## Setting Up a Mod Log Channel

1. **Create a Channel**
   - In your Discord server, create a new text channel
   - Name it something like "mod-logs"
   - Set appropriate permissions (typically only visible to moderators)

2. **Get the Channel ID**
   - Right-click on the channel
   - Select "Copy ID"

3. **Configure the Bot**
   - Edit your `.env` file:
     \`\`\`bash
     nano .env
     \`\`\`
   - Add or update the MOD_LOG_CHANNEL_ID:
     \`\`\`
     MOD_LOG_CHANNEL_ID=your_channel_id
     \`\`\`

4. **Restart the Bot**
   - If running normally: Press Ctrl+C and run `npm start` again
   - If using systemd: `sudo systemctl restart haxemo`

5. **Test the Logging**
   - Use a moderation command like `/warn`
   - Check if the action appears in your mod log channel

## Troubleshooting

### Bot Not Coming Online
- Check if your token is correct in the `.env` file
- Ensure Node.js version is 18 or higher: `node -v`
- Check for errors in the console output

### Commands Not Working
- Make sure you've run `npm run deploy`
- Check if the bot has the necessary permissions in your server
- Verify that you've enabled the required intents in the Discord Developer Portal

### Database Connection Issues
- Check if your MongoDB connection string is correct
- For Atlas: Verify that you've allowed access from your IP address
- For local MongoDB: Ensure the MongoDB service is running

### Service Not Starting
- Check the service logs: `sudo journalctl -u haxemo -f`
- Verify that the paths in the service file are correct
- Make sure the user specified in the service file has access to the bot directory

### Getting More Help
- Join our support server (coming soon)
- Check the GitHub repository for issues and updates
- Refer to the Discord.js documentation for general Discord bot questions

---

If you encounter any issues not covered here, please join our support server or open an issue on GitHub.
