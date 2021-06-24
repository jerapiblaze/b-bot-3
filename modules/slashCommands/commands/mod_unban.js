const metadata = {
    name: "unban",
    description: "unban a member",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'member',
            description: 'enter user id',
            required: true,
            type: 3
        },
        {
            name: 'reason',
            description: 'reason',
            required: false,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:['BAN_MEMBERS'],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require("discord.js")

const exec = async (interaction) => {
    const options = interaction.commandOptions
    let guild = interaction.originalMessage.guild

    var reason = `Time to unban`
    var err = ''

    if (options.reason) {
        reason = options.reason
    }

    await guild.members.unban(options.member, reason).then(usr => {
        usr.send(new MessageEmbed()
            .setTitle('🎉 Your ban have just been revoked')
            .setDescription(`
                Server: **${interaction.originalMessage.guild}**
                Reason: **${reason}**
            `)
            .setFooter(`Now you can join again with an invite link.`)
            .setColor('0x09ff00')).catch(e => null)
    }).catch(e => {
        err = e
    })

    if (err.length > 0) {
        return err
    }
    return `Un-banned <@${options.member}>: ${reason}`
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}