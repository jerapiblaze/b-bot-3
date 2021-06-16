const metadata = {
    name: "textcrypt",
    description:"text crypto",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'encrypt',
            description:'true for encrypt mode - false for decrypt mode',
            required:true,
            type: 5
        },
        {
            name:'key',
            description:'key',
            required:true,
            type: 3
        },
        {
            name:'text',
            description:'text',
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

const encryptpwd = require('encrypt-with-password')
const exec = (interaction) => {
    const options = interaction.commandOptions
    var output = ''
    if (options.encrypt){
        output = encryptpwd.encrypt(options.text, options.key)
    } else {
        output = encryptpwd.decrypt(options.text, options.key)
    }
    return `Your ${options.encrypt ? 'encrypted' : 'decrypted'} text \`\`\`\n${output}\n\`\`\``
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}