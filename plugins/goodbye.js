module.exports = {

    name: "goodbye",

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        await sock.sendMessage(from, {
            text: "😢 Goodbye System Enabled"
        })
    }
}
