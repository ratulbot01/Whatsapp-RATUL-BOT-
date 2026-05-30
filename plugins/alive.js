module.exports = {
name: "alive",

async execute(sock, msg, args, config) {

    const from = msg.key.remoteJid

    const aliveText = `

╭━━━〔 🤖 BOT STATUS 〕━━━╮

✅ Bot Online
⚡ Status : Active

🤖 Bot Name : ${config.BOT_NAME}
👑 Owner : ${config.OWNER_NAME}
📱 Owner Number : ${config.OWNER_NUMBER}
🚀 Version : ${config.BOT_VERSION}
🔰 Prefix : ${config.PREFIX}

╰━━━━━━━━━━━━━━━━━━╯

💚 Bot is working perfectly.
`

    await sock.sendMessage(from, {
        text: aliveText
    })
}

}
