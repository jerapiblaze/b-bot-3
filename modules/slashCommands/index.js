const commands = globalTools.index(`${__myModules}/slashCommands/commands`, '*')
const fetchMessage = require('./tools/fetchMessage.js').exec
const fetchMember = require('./tools/fetchMember.js').exec
const { APIMessage } = require("discord.js")

var client = null
const setClient = async (input_client) => {
    client = input_client
}

const CommandsAPIendpoint = (guildID) => {
    const app = client.api.applications(client.user.id)
    if (guildID) {
        app.guilds(guildID)
    }
    return app.commands
}

const deleteCommand = async (guildID, commandID) => {
    const app = client.api.applications(client.user.id)
    if (guildID){
        app.guilds(guildID)
    }

    return await app.commands(commandID).delete()
}
const registerCommands = async (guildID) => {
    const commandsAPIendpoint = CommandsAPIendpoint(guildID)
    const registeredCommands = await commandsAPIendpoint.get()
    
    // delete unknown commands from discord and add unregistered commands to queue
    var registerQueue = Object.keys(commands)
    for (let command of registeredCommands) {
        var i = registerQueue.findIndex(c => {
            return c === commands.name
        })
        if (i === -1) {
            await deleteCommand(guildID, command.id)
        } else {
            if ((!commands[command.name].config.forceRegister) || commands[command.name].config.disabled) {
                registerQueue.splice(i, 1)
            }
        }
    }

    // register go go go
    for (let command of registerQueue) {
        await commandsAPIendpoint.post({
            data: commands[command].config.discordRegData
        })
    }
}

const perms_check = (member, command) => {
    if ((typeof (command.config.requiredPermissions) === 'object') && (command.config.requiredPermissions.length > 0)) {
        for (var p of command.config.requiredPermissions) {
            if (!member.hasPermission(p)) {
                return false
            }
        }
    } else {
        return true
    }
}
const options_parse = (options) => {
    var output = {}
    if (!(typeof (options) === 'object')) return output
    for (var o of options) {
        output[o.name] = o.value
    }
    return output
}
const createAPImessage = async (interaction, content) => {
    const { data, files } = await APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
        .resolveData()
        .resolveFiles()
    return { ...data, files }
}
const interactionReply = async (interaction, response) => {
    let data = {
        content: response
    }

    if (!(typeof (response) === 'string')) {
        data = await createAPImessage(interaction, response)
    }

    client.api.webhooks(interaction.application_id, interaction.token).messages('@original').patch({
        data
    })
}

const exec = () => {
    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 5
            }
        })
        const rawMsg = await client.api.webhooks(interaction.application_id, interaction.token).messages('@original').get()
        const originalMessage = await fetchMessage(client, interaction.channel_id, rawMsg.id)
        const originalMember = await fetchMember(client, interaction.guild_id, interaction.member.user.id)
        const command = commands[interaction.data.name.toLowerCase()]

        if (!perms_check(originalMember, command)) {
            interactionReply(interaction, `🤡 Not permitted.`)
            return
        }
        if (command.config.disabled) {
            interactionReply(interaction, `👎 Command disabled by owner`)
            return
        }
        if (!command.config.allowDM) {
            if (originalMessage.channel.type === 'dm') {
                interactionReply(interaction, `🚫 This command cannot be used in DirectMessage channel`)
                return
            }
        }
        if (command.config.ownerOnly) {
            if (!(__botConfig.devmode.ownerUID === originalMember.user.id)) {
                interactionReply(interaction, `🤡 You are not developer.`)
                return
            }
        }

        interaction.originalMessage = originalMessage
        interaction.originalMember = originalMember
        interaction.commandOptions = options_parse(interaction.data.options)

        const commandOutput = await command.exec(interaction)
        interactionReply(interaction, commandOutput)
    })
}

module.exports = {
    setClient,
    registerCommands,
    exec
}