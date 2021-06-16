const metadata = {
    name: "covidcount",
    description: "worldometer covid-19 counter",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'country',
            description: 'select a country',
            required: false,
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
const worldometer = require('worldometer-coronavirus-info')

const exec = async (interaction) => {
    const options = interaction.commandOptions
    const embed = new MessageEmbed()
        .setTitle('Covid-19 🦠 tracker')
        .setColor('#ffffff')
        .setFooter('Last updated: ' + interaction.originalMessage.createdAt)
        .setAuthor('worldometers.info', 'https://www.worldometers.info/favicon/android-icon-36x36.png', 'https://www.worldometers.info/coronavirus/')
    if (options.country){
        let corona = await worldometer.trackCountry(options.country)
        embed.setThumbnail(corona.country.flagImg)
        embed.setDescription(`
        **${corona.country.name}**
        Total cases     : **${corona.cases.total}**
        Total deaths    : **${corona.cases.deaths}**
        Total recovered : **${corona.cases.recovered}**
        `)
    } else {
        let corona = await worldometer.trackAll()
        embed.setThumbnail(__URLs.worldFlags)
        embed.setDescription(`
        **World**
        Total cases     : **${corona.totalCases}**
        Total deaths    : **${corona.totalDeaths}**
        Total recovered : **${corona.totalRecovered}**
        Total critical  : **${corona.condition.critical}**
        `)
    }
    
    return embed       
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}