const metadata = {
    name: "mute",
    description:"mute/unmute a member",
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
            name:'mute',
            description:'mute set true, unmute set false',
            required:true,
            type: 5
        },
        {
            name:'reason',
            description:'reason to mute',
            required:false,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:['MUTE_MEMBERS'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { fetchMember } = globalTools
const exec = async (interaction) => {
    const options = interaction.commandOptions
    let member = await fetchMember(interaction.client, interaction.guild_id, options.member)
    
    var reason = 'Bad member'
    var err = ''
    if (!member.manageable){
        return `I cannot mute ${member}. His/her permissons is higher than mine.`
    }
    if (options.reason){
        reason = options.reason
    }
    await member.edit({mute:options.mute},reason).catch(e => {
        err = e.toString()
    })
    if (err.length > 0){
        return `Unexpected error: ${err}`
    }
    
    if (options.mute){
        return `Server-muted ${member}: ${reason}`
    } else {
        return `Server-unmuted ${member}: ${reason}`
    }
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}