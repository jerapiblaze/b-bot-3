const metadata = {
    name: "randomlist",
    description:"get random interger values",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'list',
            description:'your list, seperated by ";"',
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

const { MessageEmbed } = require("discord.js")
const exec = (interaction) => {
    const options = interaction.commandOptions
    const list = options.list.split(";")
    const result = list[random(0, list.length)].trim()

    const embed = new MessageEmbed()
        .setDescription(`\`\`\`ini\nYour random item is [  ${result}  ]\n\`\`\``)
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}