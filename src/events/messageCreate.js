import { advertising_block } from "../utils/commands/advertisingBlock/block.js"
import { message_delete } from "../utils/commands/prefix/bulkDelete.js"
import level_message from "../../src/utils/commands/level/control.js"

export default async (client) => {

    client.on("messageCreate", async (message) => {
        advertising_block(message)
        level_message(message)
        message_delete(message)
    })
}