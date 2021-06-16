const metadata = {
    name: "randomint",
    description:"get random interger values",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'start',
            description:'minimun value',
            required:true,
            type: 4
        },
        {
            name:'end',
            description:'maximun value',
            required:true,
            type: 4
        },
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
    const result = random(options.start, options.end)
    const embed = new MessageEmbed()
        .setDescription(`\`\`\`ini\nYour random number is [  ${result}  ]\n\`\`\``)
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}