module.exports = {
    name: "tagall",
    alias: ["hidetag", "all"],

    async execute(sock, msg, args, config) {

        const from = msg.key.remoteJid

        // Group check
        if (!from.endsWith("@g.us")) {
            return sock.sendMessage(from, {
                text: "❌ This command only works in groups!"
            })
        }

        // Get group metadata
        const metadata = await sock.groupMetadata(from)

        const participants = metadata.participants

        // Message
        let teks = `🌸 *${config.BOT_NAME} TAG ALL*\n\n`

        for (let mem of participants) {

            teks += `➤ @${mem.id.split("@")[0]}\n`
        }

        // Mentions
        const mentions = participants.map(a => a.id)

        // Send message
        await sock.sendMessage(from, {
            text: teks,
            mentions
        }, {
            quoted: msg
        })
    }
}
