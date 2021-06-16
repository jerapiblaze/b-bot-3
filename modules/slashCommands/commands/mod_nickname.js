const metadata = {
    name: "nick",
    description:"change nickname",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'member',
            description:'choose your target',
            required:true,
            type: 6
        },
        {
            name:'nickname',
            description:'new nickname (type --reset to clear)',
            required:true,
            type: 3
        },
        {
            name:'reason',
            description:'reason',
            required:false,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:['MANAGE_NICKNAMES'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { fetchMember } = globalTools
const exec = async (interaction) => {
    const options = interaction.commandOptions
    let member = await fetchMember(interaction.client, interaction.guild_id, options.member)
    
    var reason = 'Bad nickname'

    var err = ''
    if (!member.manageable){
        return `I cannot change nickname of ${member}. His/her permissons is higher than mine.`
    }

    if (options.reason){
        reason = options.reason
    }

    if (options.nickname === '--reset'){
        options.nickname = ''
    }

    await member.edit({nick:options.nickname},reason).catch(e => {
        err = e.toString()
    })
    if (err.length > 0){
        return `Unexpected error: ${err}`
    }
    return `Nickname of ${member} changed`    
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}