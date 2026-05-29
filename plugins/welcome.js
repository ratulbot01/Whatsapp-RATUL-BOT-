module.exports = {

    name: "welcome",

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        await sock.sendMessage(from, {
            text: "👋 Welcome System Enabled"
        })
    }
}
