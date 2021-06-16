const metadata = {
    name: "random",
    description:"get random float values",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
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
    const result = Math.random()
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