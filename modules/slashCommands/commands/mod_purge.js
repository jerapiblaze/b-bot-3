const metadata = {
    name: "purge",
    description: "builk delete message in this channel",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'amount',
            description: 'how mamny messages do you want to purge in this channel',
            required: true,
            type: 4
        },
        {
            name: 'skip_pinned',
            description: 'skip delete messages or not, works only with nuke:True',
            required: false,
            type: 5
        },
        {
            name: 'nuke',
            description: 'force delete every message evenwhen it is more than 14 days old',
            required: false,
            type: 5
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions: ['MANAGE_MESSAGES'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require("discord.js");
const exec = async (interaction) => {
    const client = interaction.client
    const options = interaction.commandOptions
    if ((options.amount <= 0) || (options.amount >= 100)) {
        return 'Oops, I can not handle more than 100 messages or negative amount.'
    }

    let guild = await client.guilds.fetch(interaction.guild_id, true, true)
    let channel = guild.channels.cache.get(interaction.channel_id)
    let messages = await channel.messages.fetch({ limit: options.amount + 1 })
    var firstMsg = messages.firstKey()
    messages.delete(firstMsg)
    let oriMsg = interaction.originalMessage

    var target = null
    if (options.skip_pinned) {
        target = messages.filter(m => !m.pinned)
    } else {
        target = messages
    }

    if (!options.nuke) {
        await channel.bulkDelete(target, true)
        oriMsg.delete({timeout:5000})
        return `Trying to delete ${options.amount} messages. Any message older than 14 days will not be deleted.`
    }

    for (var m of target.array()) {
        if (!m.deleted) {
            await m.delete()
        }
        sleep(1000)
    }
    
    oriMsg.delete({timeout: 5000})
    return new MessageEmbed()
        .setImage(__URLs.nukeKimChongyunMeme)
        .setTitle(`Nuke channel`)
        .setDescription(`Deleted ${options.amount} messages`)
        .setFooter(`Kim Chongyun is very proud of you.`)
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}