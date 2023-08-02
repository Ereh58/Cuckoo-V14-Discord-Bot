import { tActive, eActive, pActive } from "../utils/commands/welcome/add.js"
import { auto_role } from "../utils/commands/auto/role.js"
import { greet_control } from "../utils/commands/greet/control.js"
import { member_control } from "../utils/commands/public/control.js"

export default async (client) => {

    client.on("guildMemberAdd", async (member) => {
        tActive(member)
        eActive(member)
        pActive(member)
        auto_role(member)
        greet_control(member)
        member_control(member)
    })
}