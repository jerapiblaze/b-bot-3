const metadata = {
    name: "http",
    description: "show http cat",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'code',
            description: 'http code',
            required: false,
            type: 4
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

const codes = [
    100, 101, 103, 200, 201, 202, 203, 204,
    205, 206, 300, 301, 302, 303, 304, 307,
    308, 400, 401, 402, 403, 404, 405, 406,
    407, 408, 409, 410, 411, 412, 413, 414,
    415, 416, 417, 418, 422, 425, 426, 428,
    429, 431, 451, 500, 501, 502, 503, 504,
    505, 506, 507, 508, 510, 511
]

const exec = (interaction) => {
    const options = interaction.commandOptions

    var code = 404

    if (!options.code) {
        code = codes[random(0, codes.length)]
    } else {
        code = options.code
    }
    
    if (codes.indexOf(code) === -1){
        code = 404
    }
    
    const image = new MessageEmbed()
        .setAuthor(`Http Cats`, null, `https://http.cat`)
        .setImage(`https://http.cat/${code}`)

    return image
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}