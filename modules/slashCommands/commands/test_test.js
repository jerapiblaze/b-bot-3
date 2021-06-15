const metadata = {
    name: `test`,
    description: `evaluate an expression`,
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: `expression`,
            description: `expression to evaluate`,
            required: true,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: false,
    ownerOnly: true,
    disabled: false
}

const exec = async (interaction) => {
    var result = ''
    try {
        result = await eval(interaction.commandOptions.expression)
    } catch (error) {
        result = error.toString()
    }
    if (!result){
        result = 'no output'
    }
    return result
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}