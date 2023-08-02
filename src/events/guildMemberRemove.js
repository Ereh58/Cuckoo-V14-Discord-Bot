import { tActive, eActive, pActive } from "../utils/commands/welcome/bye.js"

export default async (client) => {

    client.on("guildMemberRemove", async (member) => {
        tActive(member)
        eActive(member)
        pActive(member)
    })
}