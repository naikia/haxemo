# 🤖 Haxemo Commands Documentation

## Table of Contents
- [Moderation Commands](#-moderation-commands)
- [Information Commands](#-information-commands)
- [Fun Commands](#-fun-commands)
- [Utility Commands](#-utility-commands)
- [Developer Commands](#-developer-commands)
- [Quick Prefix Commands](#-quick-prefix-commands)
- [Permission Requirements](#-permission-requirements)

---

## 🛡️ Moderation Commands

### `/warn <user> [reason]`
**Description:** Issue a warning to a user  
**Required Permission:** `Moderate Members`  
**Usage:** `/warn @user Breaking server rules`  
**Features:**
- Logs warning to database with unique Command ID
- Sends DM notification to user with Command ID
- Records moderator and timestamp

### `/kick <user> [reason]`
**Description:** Kick a user from the server  
**Required Permission:** `Kick Members`  
**Usage:** `/kick @user Spamming in chat`  
**Features:**
- Removes user from server
- Logs action to database with Command ID
- Sends DM notification before kick

### `/ban <user> [reason] [delete-days]`
**Description:** Ban a user from the server  
**Required Permission:** `Ban Members`  
**Usage:** `/ban @user Harassment delete-days:7`  
**Features:**
- Permanently bans user
- Optional message deletion (0-7 days)
- Logs action to database with Command ID
- Sends DM notification before ban

### `/timeout <user> <duration> [reason]`
**Description:** Timeout a user (mute them temporarily)  
**Required Permission:** `Moderate Members`  
**Usage:** `/timeout @user 60 Inappropriate behavior`  
**Features:**
- Duration in minutes (1-40320)
- Prevents user from sending messages
- Logs action to database with Command ID
- Shows timeout end time

### `/clear <amount> [user]`
**Description:** Bulk delete messages  
**Required Permission:** `Manage Messages`  
**Usage:** `/clear 50` or `/clear 25 @user`  
**Features:**
- Delete 1-100 messages at once
- Optional: delete only from specific user
- Cannot delete messages older than 14 days
- Logs action with Command ID

### `/slowmode <seconds>`
**Description:** Set channel slowmode  
**Required Permission:** `Manage Channels`  
**Usage:** `/slowmode 30` or `/slowmode 0` (to disable)  
**Features:**
- Set delay between messages (0-21600 seconds)
- Applies to current channel only
- 0 seconds disables slowmode

### `/lockdown <action> [reason]`
**Description:** Lock or unlock a channel  
**Required Permission:** `Manage Channels`  
**Usage:** `/lockdown lock Emergency situation`  
**Features:**
- Lock: Prevents @everyone from sending messages
- Unlock: Restores normal permissions
- Logs moderator and reason

### `/mod-logs <user> [command-id]`
**Description:** View moderation history for a user or specific Command ID  
**Required Permission:** `Moderate Members`  
**Usage:** `/mod-logs @user` or `/mod-logs user:@user command-id:ABC123`  
**Features:**
- Shows last 10 moderation actions for user
- Look up specific actions by Command ID
- Works with usernames or user IDs
- Displays dates, moderators, and Command IDs

### `/pardon <command-id> <reason>`
**Description:** Remove a moderation log entry  
**Required Permission:** `Moderate Members`  
**Usage:** `/pardon ABC123-XYZ789 False positive`  
**Features:**
- Removes moderation log from database
- Creates pardon log entry for audit trail
- Notifies user via DM about pardon
- Requires Command ID and reason

---

## ⚡ Quick Prefix Commands

For quick access to command help, type `>command` (e.g., `>warn`, `>kick`):

### Available Prefix Commands:
- `>warn` - Quick help for warn command
- `>kick` - Quick help for kick command  
- `>ban` - Quick help for ban command
- `>timeout` - Quick help for timeout command
- `>clear` - Quick help for clear command
- `>slowmode` - Quick help for slowmode command
- `>lockdown` - Quick help for lockdown command
- `>pardon` - Quick help for pardon command

**Example Usage:**
\`\`\`
>warn
\`\`\`
This will show an embed with:
- Command description
- Usage syntax
- Required permissions
- Example usage
- Link to full slash command

---

## 📋 Information Commands

### `/help`
**Description:** Display all available commands  
**Required Permission:** None  
**Usage:** `/help`  
**Features:**
- Organized command categories
- Links to documentation
- Quick prefix command reference
- Ephemeral response (only you can see)

### `/about`
**Description:** Learn about Haxemo  
**Required Permission:** None  
**Usage:** `/about`  
**Features:**
- Bot information and statistics
- Developer credits
- Feature overview
- GitHub link

### `/userinfo [user]`
**Description:** Get detailed user information  
**Required Permission:** None  
**Usage:** `/userinfo` or `/userinfo @user`  
**Features:**
- Account creation date
- Server join date
- Roles and permissions
- Special developer recognition

### `/serverinfo`
**Description:** Get server information  
**Required Permission:** None  
**Usage:** `/serverinfo`  
**Features:**
- Server statistics
- Owner information
- Boost level and count
- Member and channel counts

### `/avatar [user]`
**Description:** Get user's avatar  
**Required Permission:** None  
**Usage:** `/avatar` or `/avatar @user`  
**Features:**
- High-resolution avatar display
- Download links (PNG, JPG, WEBP)
- Works for any server member

---

## 🎮 Fun Commands

### `/8ball <question>`
**Description:** Ask the magic 8-ball a question  
**Required Permission:** None  
**Usage:** `/8ball Will it rain tomorrow?`  
**Features:**
- 20 different responses
- Classic magic 8-ball experience
- Random answer generation

### `/joke`
**Description:** Get a random joke  
**Required Permission:** None  
**Usage:** `/joke`  
**Features:**
- Programming and general humor
- Setup and punchline format
- Family-friendly content

### `/coinflip`
**Description:** Flip a virtual coin  
**Required Permission:** None  
**Usage:** `/coinflip`  
**Features:**
- Random heads or tails result
- Visual emoji representation
- 50/50 probability

### `/dice [sides] [count]`
**Description:** Roll dice  
**Required Permission:** None  
**Usage:** `/dice` or `/dice sides:20 count:3`  
**Features:**
- Custom sides (2-100)
- Multiple dice (1-10)
- Shows individual results and total

### `/poll <question> <option1> <option2> [option3] [option4]`
**Description:** Create a poll  
**Required Permission:** None  
**Usage:** `/poll "Favorite color?" "Red" "Blue" "Green"`  
**Features:**
- Up to 4 options
- Automatic reaction voting
- Clear visual format

### `/rps <choice>`
**Description:** Play Rock Paper Scissors  
**Required Permission:** None  
**Usage:** `/rps rock`  
**Features:**
- Play against the bot
- Win/lose/tie detection
- Emoji representations

### `/quote`
**Description:** Get an inspirational quote  
**Required Permission:** None  
**Usage:** `/quote`  
**Features:**
- Motivational quotes
- Famous authors
- Random selection

### `/trivia [category]`
**Description:** Play trivia games  
**Required Permission:** None  
**Usage:** `/trivia science`  
**Features:**
- 5 categories available
- Interactive reaction-based answers
- 30-second time limit
- Immediate feedback

---

## 🔧 Utility Commands

### `/remind <time> <message>`
**Description:** Set a reminder  
**Required Permission:** None  
**Usage:** `/remind 30m Take a break`  
**Features:**
- Time formats: s, m, h, d (e.g., 5s, 10m, 2h, 1d)
- Maximum 7 days
- Mentions you when reminder triggers

### `/math <expression>`
**Description:** Calculate mathematical expressions  
**Required Permission:** None  
**Usage:** `/math 2+2*3`  
**Features:**
- Basic operations (+, -, *, /, ())
- Safe evaluation (no dangerous functions)
- Instant results

---

## 👨‍💻 Developer Commands

### `/dev <subcommand>`
**Description:** Developer-only commands  
**Required Permission:** Bot Developer Only  
**Available Subcommands:**
- `uptime` - Check bot uptime
- `ping` - Check bot latency
- `info` - Get detailed bot information
- `system` - View system information
- `db` - Test database connection
- `guilds` - List all servers
- `stats` - View command usage statistics

---

## 🔐 Permission Requirements

### Discord Permissions Needed:

| Command Category | Required Permissions |
|-----------------|---------------------|
| **Moderation** | `Moderate Members`, `Kick Members`, `Ban Members`, `Manage Messages`, `Manage Channels` |
| **Information** | None |
| **Fun** | `Add Reactions` (for polls and trivia) |
| **Utility** | None |
| **Developer** | Bot Developer ID Only |

### Bot Permissions Required:
- `View Channels`
- `Send Messages`
- `Use Slash Commands`
- `Embed Links`
- `Add Reactions`
- `Read Message History`
- `Kick Members`
- `Ban Members`
- `Moderate Members`
- `Manage Messages`
- `Manage Channels`

### User Permission Levels:

1. **Everyone** - Can use information, fun, and utility commands
2. **Moderators** - Can use moderation commands (requires specific permissions)
3. **Administrators** - Can use all commands except developer commands
4. **Developer** - Full access to all commands including developer menu

---

## 🆔 Command ID System

All moderation actions generate unique Command IDs for tracking:

### Features:
- **Unique Tracking:** Every action gets a unique ID (e.g., `LN2K4X-A7B9C2`)
- **Easy Reference:** Use Command IDs to reference specific actions
- **Audit Trail:** Complete tracking of all moderation actions
- **Pardon System:** Remove incorrect actions using Command IDs

### Usage Examples:
\`\`\`bash
# View specific action
/mod-logs user:@user command-id:LN2K4X-A7B9C2

# Pardon an action
/pardon LN2K4X-A7B9C2 False positive

# Reference in discussions
"Please review Command ID LN2K4X-A7B9C2"
\`\`\`

---

## 📝 Notes

- All moderation actions are logged to the database with unique Command IDs
- Users receive DM notifications with Command IDs for reference
- Prefix commands (`>command`) provide quick help without cluttering chat
- Commands that might take time automatically defer replies to prevent timeouts
- Pardon system maintains audit trail while removing incorrect actions
- All embeds include consistent Haxemo branding

## 🔗 Support

- **Website:** [https://naikia.me/haxemo](https://naikia.me/haxemo)
- **GitHub:** [https://github.com/naikia](https://github.com/naikia)
- **Developer:** Noan/Naikia

---

*Last updated: December 2024*
