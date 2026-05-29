module.exports = {

    name: "play",

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid

        const query = args.join(" ")

        await sock.sendMessage(from, {
            text: `▶️ Playing: ${query}`
        })
    }
}
