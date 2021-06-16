const metadata = {
    name: "downdetect",
    description:"is this site down or just me",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'site',
            description:'site to check',
            required:true,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: true,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require('discord.js')
const ping = require('ping')

const exec = async (interaction) => {
    const options = interaction.commandOptions
    const res = await ping.promise.probe(options.site)

    if (!res.host){
        return `Unknown host.`
    }

    const downStatus = res.alive ? 'up and running' : 'dead'
    const downColor = res.alive ? '0x1cfc03' : '0xfc0303'
    
    const embed = new MessageEmbed()
        .setColor(`${downColor}`)
        .setDescription(`
        Host: **${res.host}** [${res.numeric_host}]
        Status: **${downStatus}**
        Ping: **${res.time}**ms
        `)

    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}