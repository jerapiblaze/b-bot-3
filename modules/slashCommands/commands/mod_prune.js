const metadata = {
    name: "prune",
    description:"prune members",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'days',
            description:'Number of days of inactivity required to kick',
            required:false,
            type: 4
        },
        {
            name:'roles',
            description:'Roles to bypass the "...and no roles" constraint when pruning',
            required:false,
            type: 3
        },
        {
            name:'reason',
            description:'Reason for this prune',
            required:false,
            type: 3
        },
        {
            name:'simulate',
            description:'Get number of users that will be kicked, without actually kicking them',
            required:false,
            type: 5
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:['MANAGE_GUILD'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const exec = async (interaction) => {
    const options = interaction.commandOptions
    var opts = {
        days: options.days ? options.days : 7,
        dry: options.simulate ? options.simulate : false,
        roles: options.roles ? options.roles.match(new RegExp('([0-9].{1,17})', 'g')) : [],
        reason: options.reason ? options.reason : 'Time to clean up'
    }
    var err = ''
    let pruneCount = await interaction.originalMessage.guild.members.prune(opts).catch(e => {
        err = e
    })
    if (err.length > 0){
        return `Unexpected error: ${err}`
    }
    return `Prune: **${pruneCount}** members will be *kicked*`
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}