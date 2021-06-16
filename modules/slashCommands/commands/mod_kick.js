const metadata = {
    name: "kick",
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
            description: 'reason to kick',
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
const { fetchMember } = globalTools
const exec = async (interaction) => {
    const options = interaction.commandOptions
    let member = await fetchMember(interaction.client, interaction.guild_id, options.member)
    
    var reason = 'Bad member'
    var err = ''
    if (!member.manageable) {
        return `I cannot kick ${member}. His/her permissons is higher than mine.`
    }
    if (options.reason) {
        reason = options.reason
    }

    await member.send(new MessageEmbed()
        .setTitle(`🏹 You have just been kicked !!!`)
        .setDescription(`
            Server: **${interaction.originalMessage.guild}**
            Reason: **${reason}**`)
        .setFooter(`You can join again with an invite link.`)
        .setColor('0xffaa00'))
        .catch(e => null)
    await member.kick(reason).catch(e => err = e.toString())

    if (err.length > 0) {
        return `Unexpected error: ${err}`
    }
    return `Kicked ${member}: ${reason}`
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}