import { time } from "discord.js"

/**
    * @name DiscordTimestamp
    * @param {Date} date
    * @param {String} type 
    * @param {Number} second
    */
export default (date = new Date(), type = "R", second = 0) => {

    return time(new Date(new Date(date).getTime() + 1000 * second), type)
}