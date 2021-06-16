const metadata = {
    name: "rickroll",
    description:"rickrolled",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'message',
            description:'rickroll with message',
            required:false,
            type: 3
        },
        {
            name:'style',
            description:'rick roll style',
            required:false,
            type: 3,
            choices:[
                { name: '8-bit', value: 'https://j2c.cc/rickrolled8bit'},
                { name: 'lo-fi', value: 'https://j2c.cc/rickrolledlofi'}
            ]
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

const exec = (interaction) => {
    options = interaction.commandOptions
    const msg = options.message ? options.message : `
    || You've been... **Rickrolled** ||
    > || *... never gonna give you up* ||
    > || *never gonna let you down...* ||`
    const link = options.style ? options.style : `https://j2c.cc/rickrolled`

    interaction.originalMessage.channel.send(`
${msg}
-------------
|| ${link} ||
    `).then(m => {
        interaction.originalMessage.delete()
    })
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}