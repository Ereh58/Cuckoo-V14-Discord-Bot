import { ShardingManager } from "discord.js"
import chalk from "chalk"
import "dotenv/config"

const manager = new ShardingManager("./app.js", { token: process.env.TOKEN })

manager.on("shardCreate", async (shard) => {
    if (!shard.ready) console.log(chalk.yellow(`Creating ${shard.id} shards...`))
})

manager.spawn()
.then(() => {
    console.log(chalk.green(`Shard created bot ready to use`))
})