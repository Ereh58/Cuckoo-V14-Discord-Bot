import { cooldownCheck } from "../cooldown.js"
import { errorEmbed } from "../client/Embed.js"
import { t } from "i18next"
import chalk from "chalk"

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */
export default async (interaction) => {

    const { commandName } = interaction
    const command = interaction.client.commands.get(commandName)

    if (!command) return console.log(chalk.red("There is no such command"))

    if (interaction.user.id !== "1107600662721736724")
    if (interaction.guild) {    

        if (command.permission) {
            if (command.permission && !interaction.member.permissions.has(command.permission)) {
                const perm = command.permission
                return interaction.reply(errorEmbed(t("user_permissions", { ns: "common", perm })))
            }
        }

        if (command.required_bot_permissions) {

            const { me } = interaction.guild.members
            if (command.required_bot_permissions && command.required_bot_permissions.some(perm => !me.permissionsIn(interaction.channel).has(perm))) {
                const permissions = command.required_bot_permissions.filter(perm => !me.permissionsIn(interaction.channel).has(perm)).map(perm => t(perm, { ns: "permissions"})).join(", ")
                return interaction.reply(errorEmbed(t("missing_permissions", { ns: "common", permissions })))
            }

        }
    }

    const cooldown = cooldownCheck(command, interaction.user.id)
    if (cooldown) {
        return interaction.reply(errorEmbed(t("cooldown", { ns: "common", cooldown })))
    }

    try {
        command.execute(interaction)
    } catch (e) {
        console.error(e)
        
        interaction.reply(errorEmbed(t("unexpected_error", { ns: "common" })))

    }

}