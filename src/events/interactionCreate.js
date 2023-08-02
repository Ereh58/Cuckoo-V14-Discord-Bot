import { ticket_request, ticket_response, ticket_control, ticket_add_user } from "../utils/commands/ticket/control.js"
import { wheel_control } from "../utils/model/wheel.js"
import { role_modals } from "../utils/commands/level/control.js"
import { get_premium } from "../utils/commands/premium/get.js"
import { help_control } from "../utils/commands/help/control.js"
import { button_control } from "../../src/utils/commands/public/control.js"
import { man_modal, girl_modal } from "../../src/utils/commands/public/modal.js"
import { select_menu, button } from "../utils/commands/reactionRole.js"
import commandInteractionHandler from "../utils/handlers/commandInteractionHandler.js"
import i18next from "i18next"

/**
 * @param {import("discord.js").Client} client
 */
export default async (client) => {

    client.on("interactionCreate", async (interaction) => {

        // Change language to user's locale
        i18next.changeLanguage(interaction.locale)

        if (interaction.isChatInputCommand()) return commandInteractionHandler(interaction)

        // Reaction Role
        select_menu(interaction)
        button(interaction)

        // Help Control
        help_control(interaction)

        // Premium
        get_premium(interaction)
        
        // Ticket system
        ticket_request(interaction)
        ticket_control(interaction)
        if (interaction.customId == "ticket_opens") ticket_response(interaction)
        if (interaction.customId == "ticket_add_users") ticket_add_user(interaction)
        if (interaction.customId == "level_role_select") role_modals(interaction)

        // Wheel
        if (interaction.customId == "wheel") wheel_control(interaction)

        // Public Register
        button_control(interaction)

        if (!interaction.customId.startsWith("/+/")) return
        if (interaction.customId == `/+/man?${interaction.customId.split("?")[1]}`) man_modal(interaction)
        if (interaction.customId == `/+/girl?${interaction.customId.split("?")[1]}`) girl_modal(interaction)

    })

}