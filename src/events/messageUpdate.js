import { advertising_block_update } from "../utils/commands/advertisingBlock/block.js"

export default async (client) => {

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        advertising_block_update(newMessage)
    })
}