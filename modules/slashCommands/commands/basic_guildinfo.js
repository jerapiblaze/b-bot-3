const metadata = {
    name: "guildinfo",
    description: "show this guild info",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'detailed_invite_info',
            description: 'show detailed invite info or not',
            required: false,
            type: 5
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
const avgColor = require('fast-average-color-node').getAverageColor

const exec = async (interaction) => {
    let options = interaction.commandOptions
    let client = interaction.originalMessage.client
    let guild = interaction.originalMessage.guild
    
    const {
        name,
        nameAcronym,
        description,
        owner,
        createdAt,
        verified,

        partnered,
        premiumSubcriptionCount,
        premiummTier,

        memberCount,
        roles,

        preferredLocale,
        region,

        rulesChannel,
        systemChannel,
        publicUpdatesChannel,

        afkChannel,
        afkTimeout,
    } = guild

    var roles_info = `
    **Members count**: ${memberCount}
    **Roles**: ${roles.cache.size}`

    const more_info = `
    **Rules channel**: ${rulesChannel}
    **System channel**: ${systemChannel}
    **Community updates**: ${publicUpdatesChannel}
    **AFK channel**: ${afkChannel} (timeout: ${afkTimeout}s)
    **Discord's partner**: ${partnered}
    `

    const langPreference = `
    **Prefered locale**: ${preferredLocale}
    **Region**: ${region}
    `

    const nitroStatus = `
    **Nitro count**: ${premiumSubcriptionCount}
    **Server Boost level**: ${premiummTier}
    `

    let fetchedInvites = await guild.fetchInvites()
    fetchedInvites = fetchedInvites.array()

    let guildColor = await (await avgColor(guild.iconURL({ format: 'png', size: 4096 })))


    const embed = new MessageEmbed()
        .setTitle(`[${nameAcronym}] ${name}`)
        .setDescription(`
            **Description**: ${description}
            **Verified**: ${verified}
            **Owner**: ${owner}
            **Created at**: ${createdAt}
            **Invite links count**: ${fetchedInvites.length}
            `)
        .setThumbnail(guild.iconURL({ size: 4096 }))
        .setColor(`0x${guildColor.hex.slice(1, 7)}`)

    if ((options) &&(options.detailed_invite_info)) {
        for (var i of fetchedInvites) {
            var mfg = i.createdAt.toString().split(' ').splice(0, 6).join(' ')
            var exp = i.expiresAt
            if (exp) {
                exp = exp.toString().split(' ').splice(0, 6).join(' ')
            } else {
                exp = 'never'
            }
            var content = `${client.options.http.invite}/${i.code}
                > To: ${i.channel} Inviter: ${i.inviter} 
                > Used: **${i.uses}**/${i.maxUses} GiveTemporaryMembership: **${i.temporary}**
                > MFG: **${mfg}**
                > EXP: **${exp}**\n`
            embed.addFields([{ name: 'Invite detailed info', value: content }])
        }
    } else {
        embed.addFields([
            { name: `= Members =`, value: roles_info },
            { name: `= Language preferences =`, value: langPreference },
            { name: `= Nitro boosts=`, value: nitroStatus },
            { name: '= More info =', value: more_info }
        ])
    }

    const bannerURL = guild.bannerURL()
    if (bannerURL) {
        embed.setImage(bannerURL)
    }

    if (options.senddm) {
        var err = ''
        let target = interaction.originalMember.user
        await target.send(embed).catch(e => err = e.toString())
        if (err.length > 0){
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