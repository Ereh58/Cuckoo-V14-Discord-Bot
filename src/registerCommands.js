import { Client, GatewayIntentBits } from "discord.js"
import { readdirSync } from "fs"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import chalk from "chalk"
import "dotenv/config"

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

await i18next
.use(Backend)
.init({
    fallbackLng: "en-US",
    preload: readdirSync("./locales"),
    ns: readdirSync("./locales/en-US").map(file => file.replace(".json", "")),
    defaultNS: "commands",
    backend: {
        loadPath: "./locales/{{lng}}/{{ns}}.json"
    }
})

const commands = []

for (const category of readdirSync("./commands")) {

    for (const file of readdirSync(`./commands/${category}`)) {

        const command = await import(`./commands/${category}/${file}`)
        commands.push(command.slash_data)

    }

}

client.once("ready", () => {

    client.application.commands.set(commands)
    .then(() => {
        console.log(chalk.green(`Commands are registered for ${client.user.username}`))
        process.exit()
    })
    .catch(e => {
        console.error(e)
        process.exit(1)
    })

})

client.login(process.env.TOKEN)