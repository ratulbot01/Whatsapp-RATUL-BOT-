module.exports = {
    name: "help",

    async execute(sock, msg, args, config) {

        const from = msg.key.remoteJid

        const helpText = `
╔══════════════╗
      🤖 ${config.BOT_NAME}
╚══════════════╝

👑 Owner: ${config.OWNER_NAME}
⚡ Version: ${config.BOT_VERSION}

📜 COMMAND LIST◇✅️

➤ .menu
➤ .ping
➤ .tagall
➤ .kickall
➤ .welcome
➤ .goodbye
➤ .antilink
➤ .song
➤ .play

━━━━━━━━━━━━━━━
Developed By ${config.OWNER_NAME}
━━━━━━━━━━━━━━━
`

        await sock.sendMessage(from, {
            text: helpText
        })
    }
  }
