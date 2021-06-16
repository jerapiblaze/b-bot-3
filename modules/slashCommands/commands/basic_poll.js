const metadata = {
    name: "poll",
    description:"create a poll",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'question',
            description:'what is your poll about?',
            required:true,
            type: 3
        },
        {
            name:'options',
            description:'options (syntax: <emoji> - options;)',
            required:false,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require("discord.js")
const avgColor = require('fast-average-color-node').getAverageColor

const exec = async (interaction) => {
    const options = interaction.commandOptions
    var emojis = ['👍', '👎']
    
    let usrColor = await avgColor(interaction.originalMember.user.displayAvatarURL({format:'png', size: 4096}))

    const embed = new MessageEmbed()
        .setTitle('Poll')
        .setFooter(interaction.originalMessage.createdAt)
        .setDescription(options.question)
        .setColor(`0x${usrColor.hex.slice(1,7)}`)

    if (options.options){
        var availableOptions = options.options.split(';')
        emojis = []
        var parsedOptions = ''
        for (var o of availableOptions){
            emojis.push(o.trim().split('-')[0].trim())
            parsedOptions += o + '\n'
        }
        embed.addFields([{name:'Options', value:parsedOptions}])
    }
    for (var e of emojis){
        interaction.originalMessage.react(e)
    }
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}