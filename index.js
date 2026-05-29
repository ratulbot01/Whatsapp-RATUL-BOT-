const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const express = require("express")
const fs = require("fs")
const path = require("path")
const P = require("pino")

const config = require("./config")

async function startBot() {

    const { state, saveCreds } =
        await useMultiFileAuthState("auth_info_baileys")

    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        auth: state,
        printQRInTerminal: false,
        browser: [config.BOT_NAME, "Chrome", "1.0.0"]
    })

    // Pair Code
    if (!sock.authState.creds.registered) {

        setTimeout(async () => {

            const code =
                await sock.requestPairingCode(config.PAIR_NUMBER)

            console.log("========================")
            console.log("PAIR CODE:", code)
            console.log("========================")

        }, 3000)
    }

    // Save Session
    sock.ev.on("creds.update", saveCreds)

    // Connection Update
    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

        if (connection === "open") {
            console.log("✅ BOT CONNECTED")
        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                startBot()
            }
        }
    })

    // Message Event
    sock.ev.on("messages.upsert", async ({ messages }) => {

        const msg = messages[0]

        if (!msg.message) return

        const from = msg.key.remoteJid

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        if (!text.startsWith(config.PREFIX)) return

        const args = text.slice(config.PREFIX.length).trim().split(/ +/)

        const command = args.shift().toLowerCase()

        // Load Plugins
        const pluginFiles = fs.readdirSync("./plugins")

        for (const file of pluginFiles) {

            const plugin = require(`./plugins/${file}`)

            if (plugin.name === command) {

                plugin.execute(sock, msg, args, config)
            }
        }

    })

    // Express Server
    const app = express()

    app.get("/", (req, res) => {
        res.send("Bot Running ✅")
    })

    app.listen(process.env.PORT || 3000, () => {
        console.log("🌐 Server Started")
    })
}

startBot()
