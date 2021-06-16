const metadata = {
    name: "ban",
    description: "ban a member",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'member',
            description: 'choose your target',
            required: true,
            type: 6
        },
        {
            name: 'reason',
            description: 'reason to ban',
            required: false,
            type: 3
        },
        {
            name: 'delmsg',
            description: 'number of days to delete message from this user (0-7)',
            required: false,
            type: 4
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions: ['BAN_MEMBERS'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require("discord.js")
const { fetchMember } = globalTools

const exec = async (interaction) => {
    const options = interaction.commandOptions
    let member = await fetchMember(interaction.client, interaction.guild_id, options.member)
    
    var reason = 'Bad member'
    var err = ''
    if (!member.manageable) {
        return `I cannot ban ${member}. His/her permissons is higher than mine.`
    }
    if (options.reason) {
        reason = options.reason
    }
    if (options.delmsg) {
        if ((options.delmsg < 0) || (options.delmsg > 7)) {
            return `Invalid delmsg number: between 0 - 7 only`
        }
    }

    await member.send(new MessageEmbed()
        .setTitle(`⛔ You have just been banned !!!`)
        .setDescription(`
            Server: **${interaction.originalMessage.guild}**
            Reason: **${reason}**`)
        .setFooter(`You cannot join the server again until your ban is revoked.`)
        .setColor('0xff0000'))
        .catch(e => null)

    await member.ban({ reason, days: options.days }).catch(e => {
        err = e.toString()
    })

    if (err.length > 0) {
        return `Unexpected error: ${err}`
    }
    return `Banned ${member}: ${reason}`
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}