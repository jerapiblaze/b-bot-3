const metadata = {
    name: "google",
    description:"generate a google search link",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'query',
            description:'your search query',
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
const queryString = require('query-string')
const normalizeUrl = require('normalize-url');

const exec = (interaction) => {
    const options = interaction.commandOptions

    const url = normalizeUrl(queryString.stringifyUrl({
        url: `google.com/search`,
        query: {
            q: options.query
        }
    }))
    const embed = new MessageEmbed()
            .setTitle(`Google search`)
            .setDescription(`**Search**: ${options.query}`)
            .setURL(url)
            .setAuthor('google.com', __URLs.googleSearchIcon, 'https://google.com')
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}