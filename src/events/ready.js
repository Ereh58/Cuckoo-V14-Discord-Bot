import { database_control, premium_control, user_premium } from "../../src/utils/client/Control.js"
import { voice_panel } from "../../src/utils/commands/auto/voice.js"
import { prize_control } from "../utils/commands/prize/control.js"
import { twicth_alert } from "../utils/commands/twitch/control.js"
import { youtube_alert } from "../utils/commands/youtubeAlert.js"
/**
 * @param {import("discord.js").Client} client
 */
export default async (client) => {

    client.once("ready", async () => {

      database_control(client)
      premium_control(client)
      voice_panel(client) 
      prize_control(client)
      user_premium(client)
      twicth_alert(client)
      youtube_alert(client)

    })

}
