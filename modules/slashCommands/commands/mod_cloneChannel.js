const metadata = {
    name: "clonechannel",
    description: "clone a text channel or a category",
    version: `1.0.0`,
    author: `jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'originalchannel',
            description: 'choose a original channel to clone',
            required: false,
            type: 7
        },
        {
            name: 'newname',
            description: 'new name for clonned channel',
            required: false,
            type: 3
        },
        {
            name: 'nsfw',
            description: 'mark new clonned channel as nsfw',
            required: false,
            type: 5
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions: ['MANAGE_CHANNELS'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const exec = async (interaction) => {
    const options = interaction.commandOptions
    const client = interaction.client

    let targetChannel = interaction.originalMessage.channel
    var name = options.newname
    var nsfw = options.nsfw
    if (options.originalchannel) {
        targetChannel = client.channels.cache.get(options.originalchannel)
        if ((!targetChannel) || (targetChannel.partial)) {
            targetChannel = await interaction.originalMessage.guild.channels.resolve(options.originalchannel)
        }
    }
    var err = ''
    let clonedChannel = await targetChannel.clone({ name, nsfw }).catch(e => err = e.toString())
    if (err.length > 0) {
        return err
    }
    return `Success: ${targetChannel} -> ${clonedChannel}`
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}