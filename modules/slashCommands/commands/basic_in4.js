const metadata = {
    name: "userinfo",
    description: "show user info",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'user',
            description: 'choose your target',
            required: true,
            type: 6
        },
        {
            name: 'senddm',
            description: 'silently send report to your inbox',
            require: false,
            type: 5
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

const { MessageEmbed } = require("discord.js")
const { isDate } = require('util').types
const avgColor = require('fast-average-color-node').getAverageColor
const { fetchMember } = globalTools

const exec = async (interaction) => {
    const client = interaction.client
    const options = interaction.commandOptions
    let usr = client.users.cache.get(options.user)

    if ((!usr) || (usr.partial)) {
        usr = await client.users.fetch(options.user, true, true)
    }

    let member = interaction.data.resolved.members[options.user]

    var roles = ''
    for (var r of member.roles) {
        roles += `<@&${r}> `
    }
    var joined = new Date(member.joined_at).toString()
    var created = new Date(usr.createdAt).toString()
    var premium = ''

    if (isDate(member.premium_since)) {
        premium = new Date(member.premium_since).toString()
    } else {
        premium = '<no nitro found>'
    }

    let usrColor = await avgColor(usr.displayAvatarURL({ format: 'png', size: 4096 }))
    var usrTheme = ''
    if (usrColor.isDark) {
        usrTheme += 'Dark '
    } else {
        usrTheme += 'Light '
    }

    var user_info = `
    **UID**: ${usr.id}
    **Bot**: ${usr.bot}
    **UserTag**: ${usr.tag}
    **Account created at**: ${created}
    `
    var avatar_info = `
    **Average colors**: | ${usrColor.rgba} | hexa(${usrColor.hexa}) |
    **Avatar scheme**: ${usrTheme}
    **Avatar download**: | [webp](${usr.displayAvatarURL({ dynamic: true, size: 4096 })}) | [gif](${usr.displayAvatarURL({ format: 'gif', dynamic: true, size: 4096 })}) | [png](${usr.displayAvatarURL({ format: 'png', size: 4096 })}) | [jpg](${usr.displayAvatarURL({ format: 'jpg', size: 4096 })}) |
    `
    var member_info = `
    **Nickname**: ${member.nick}
    **Roles**: ${roles}
    **Nitro since**: ${premium}
    **Joined at**: ${joined}
    `

    const embed = new MessageEmbed()
        .setTitle('🔥 User info report 🔥')
        .setDescription(`Here are what I found about <@${usr.id}>`)
        .setThumbnail(usr.displayAvatarURL({ dynamic: true, size: 4096 }))
        .addFields([
            { name: '= User info =', value: user_info },
            { name: '= Avatar info =', value: avatar_info },
            { name: '= Member info =', value: member_info }
        ])
        .setColor(`0x${usrColor.hex.slice(1, 7)}`)

    if (options.senddm) {
        var err = ''
        let target = interaction.originalMember
        await target.send(embed).catch(e => err = e.toString())
        if (err.length > 0){
            interaction.originalMessage.delete({ timeout: 5000 })
            return `Cannot send DM. Check your privacy setting and allow DMs. ${err}`
        }
        interaction.originalMessage.delete({ timeout: 5000 })
        return `DM sent. Check your inbox.`
    }
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}