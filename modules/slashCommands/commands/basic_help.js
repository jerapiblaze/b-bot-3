const metadata = {
    name: `help`,
    description: `display help`,
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'entry',
            description:'choose a help entry',
            required:false,
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
const fs = require('fs')

const helpFilesDir = `${__assetsDir}/helpfiles`
var helpFiles = fs.readdirSync(helpFilesDir).filter(f => f.endsWith('.help.md'))
var helpEntries = new Map()

for (var f of helpFiles){
    const filePath = `${helpFilesDir}/${f}`
    const entryName = f.split('.')[0]
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    helpEntries.set(entryName, fileContent)
}

const exec = (interaction) => {
    const options = interaction.commandOptions
    var entry = 'about'
    if (options.entry){
        entry = options.entry
    }
    if (!helpEntries.has(entry)){
        return 'No help entry found.'
    }
    const embed = new MessageEmbed()
        .setTitle(`Help: ${entry}`)
        .setDescription(helpEntries.get(entry))
    if (entry === 'about'){
        var availableEntries = ''
        for (var k of Array.from(helpEntries.keys())){
            availableEntries += `${k}\n`
        }
        embed.addFields([{name:'Available Help entries', value:availableEntries}])
    }
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}