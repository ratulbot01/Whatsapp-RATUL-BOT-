const fs = require("fs")

module.exports = {
    name: "owner",

    async execute(sock, msg, args, config) {

        const from = msg.key.remoteJid

        await sock.sendMessage(from, {
            image: fs.readFileSync(config.OWNER_IMAGE),
            caption: `Owner: ${config.OWNER_NAME}`
        })
    }
}
