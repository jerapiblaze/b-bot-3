const metadata = {
    name: "tinyurl",
    description:"shorten your url",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'url',
            description:'your longgggg url',
            required:true,
            type: 3
        },
        {
            name:'alias',
            description:'custom alias for your link (ex. https://tinyurl.com/{alias})',
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

const tinyurl = require('tinyurl')

const exec = async (interaction) => {
    const options = interaction.commandOptions
    var output = null
    var err = null
    if (options.alias){
        output = await tinyurl.shortenWithAlias({'url':options.url, 'alias':options.alias}).catch(e => {
            err = e
        })
    } else {
        output = await tinyurl.shorten(options.url).catch(e => {
            err = e
        })
    }

    if ((!output) || (err)){
        return `Unexpected error: ${err}`
    } else{
        interaction.originalMessage.channel.send(
            `|| ${output} ||`
        ).then(m => {
            interaction.originalMessage.delete()
        })
    }
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}