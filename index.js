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

// =========================
// LOAD ALL PLUGINS
// =========================

const plugins = {}

function loadPlugins(dir = "./plugins") {

    const files = fs.readdirSync(dir)

    for (const file of files) {

        const fullPath = path.join(dir, file)

        if (fs.statSync(fullPath).isDirectory()) {

            loadPlugins(fullPath)

        } else if (file.endsWith(".js")) {

            delete require.cache[require.resolve(fullPath)]

            const plugin = require(fullPath)

            plugins[plugin.name] = plugin

            console.log(`✅ Plugin Loaded: ${plugin.name}`)
        }
    }
}

loadPlugins()

// =========================
// START BOT
// =========================

async function startBot() {

    const { state, saveCreds } =
        await useMultiFileAuthState("auth_info_baileys")

    const { version } =
        await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        auth: state,
        printQRInTerminal: false,
        browser: [config.BOT_NAME, "Chrome", "1.0.0"]
    })

    // =========================
    // PAIR CODE SYSTEM
    // =========================

    if (!state.creds.registered) {

        setTimeout(async () => {

            const code =
                await sock.requestPairingCode(config.PAIR_NUMBER)

            console.log("================================")
            console.log(`PAIR CODE : ${code}`)
            console.log("================================")

        }, 3000)
    }

    // =========================
    // SAVE SESSION
    // =========================

    sock.ev.on("creds.update", saveCreds)

    // =========================
    // CONNECTION UPDATE
    // =========================

    sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

        if (connection === "open") {

            console.log("✅ BOT CONNECTED SUCCESSFULLY")
        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut

            console.log("❌ Connection Closed")

            if (shouldReconnect) {

                console.log("♻️ Reconnecting...")
                startBot()
            }
        }
    })

    // =========================
    // MESSAGE EVENT
    // =========================

    sock.ev.on("messages.upsert", async ({ messages }) => {

        try {

            const msg = messages[0]

            if (!msg.message) return

            if (msg.key.fromMe) return

            const from = msg.key.remoteJid

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                msg.message.videoMessage?.caption ||
                ""

            if (!text.startsWith(config.PREFIX)) return

            const args =
                text.slice(config.PREFIX.length).trim().split(/ +/)

            const command =
                args.shift().toLowerCase()

            // =========================
            // EXECUTE PLUGIN
            // =========================

            if (plugins[command]) {

                plugins[command].execute(
                    sock,
                    msg,
                    args,
                    config
                )

            } else {

                await sock.sendMessage(from, {
                    text: `❌ Command Not Found`
                })
            }

        } catch (err) {

            console.log(err)
        }
    })

    // =========================
    // EXPRESS SERVER
    // =========================

    const app = express()

    app.get("/", (req, res) => {

        res.send("✅ BOT RUNNING")
    })

    app.listen(process.env.PORT || 3000, () => {

        console.log("🌐 SERVER STARTED")
    })
}

startBot()
