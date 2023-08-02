import { successEmbed } from "../../utils/client/Embed.js"
import { t } from "i18next"
import Guild from "../../utils/database/schema/guild.js"

export const data = {
    name: t("advertising_block.name"),
    description: t("advertising_block.description"),
    cooldown: 20,
    permission: ["Administrator"],
    required_bot_permissions: ["ManageMessages"],
    /**
    * 
    * @param {import("discord.js").ChatInputCommandInteraction} interaction 
    */
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true })

        const sub_command = interaction.options.getSubcommand()

        if (sub_command == "block") {

            const options = interaction.options.getString("status")

            if (options == "enable") await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "advertising_block.isActive": true } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("advertising_block.open_embed_message"))))

            if (options == "disable") await Guild.updateOne({ guild_id: interaction.guild.id }, { $set: { "advertising_block.isActive": false } }, { upsert: true }).then(() => interaction.editReply(successEmbed(t("advertising_block.close_embed_message"))))

        }
    }
}

export const slash_data = {
    name: data.name,
    description: data.description,
    name_localizations: {
        tr: t("advertising_block.name", { lng: "tr" })
    },
    description_localizations: {
        tr: t("advertising_block.description", { lng: "tr" })
    },
    options: [
        {
            name: "block",
            description: data.description,
            type: 1,
            name_localizations: {
                tr: t("advertising_block.block_name", { lng: "tr" })
            },
            description_localizations: {
                tr: t("advertising_block.description", { lng: "tr" })
            },
            options: [
                {
                    name: "status",
                    description: "Please choose what status",
                    type: 3,
                    required: true,
                    name_localizations: {
                        tr: t("advertising_block.status.name", { lng: "tr" })
                    },
                    description_localizations: {
                        tr: t("advertising_block.status.description", { lng: "tr" })
                    },
                    choices: [
                        { name: "Enable", value: "enable" },
                        { name: "Disable", value: "disable" }
                    ]
                },
            ]
        }
    ]
}