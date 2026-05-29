module.exports = {

    name: "antilink",

    async execute(sock, msg) {

        const from = msg.key.remoteJid

        await sock.sendMessage(from, {
            text: "🚫 Anti Link Enabled"
        })
    }
}
