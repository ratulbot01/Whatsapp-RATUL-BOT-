const fs = require("fs")

module.exports = {

    name: "menu",

    async execute(sock, msg, args, config) {

        const from = msg.key.remoteJid

        const image = fs.readFileSync(config.MENU_IMAGE)

        const menuText = `
╔═══〔 ${config.BOT_NAME} 〕═══╗

👑 Owner : ${config.OWNER_NAME}
📱 Number : ${config.OWNER_NUMBER}
⚡ Version : ${config.BOT_VERSION}

╭── COMMANDS ──╮
│ .menu
│ .ping
│ .tagall
│ .kickall
│ .welcome
│ .goodbye
│ .antilink
│ .song
│ .play
╰─────────────╯
`

        await sock.sendMessage(from, {
            image: image,
            caption: menuText
        })
    }
}
