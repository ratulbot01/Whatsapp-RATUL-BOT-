module.exports = {

    name: "tagall",

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        await sock.sendMessage(from, {
            text: "📢 Tag All Feature Working"
        })
    }
}
