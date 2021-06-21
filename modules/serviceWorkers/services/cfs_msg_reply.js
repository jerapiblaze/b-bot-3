const { MessageEmbed } = require("discord.js")

const metadata = {
    name: 'cfs_msg_reply',
    description: 'reply',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `message`,
    disabled: false
}

const { fetchMember, fetchMessage } = globalTools

const isSnowflake = (n) => {
    if (isNaN(n)) {
        return false
    }
    if (n.toString().length === 18) {
        return true
    }
    return false
}

const exec = async (message) => {
    if ((message.channel.type === 'dm') || (!message.guild)) return

    if (!message.content.startsWith('/')) return

    const serverPageSettings = cfsPageSettings[message.guild.id]
    if (!serverPageSettings) return

    const rawName = message.channel.name.split('-')
    const pageSettings = serverPageSettings[rawName[0]]
    if (!pageSettings) return
    if (!(rawName[1] === 'replies')) return

    const commandArgs = message.content.split('/')
    commandArgs.shift()

    if (!isSnowflake(commandArgs[0])) {
        message.lineReplyNoMention('invalid cfsID')
        return
    }

    const hallChannel = message.client.channels.cache.find(c => {
        if (c.name === `${rawName[0]}-hall`) {
            if (c.guild.id === message.guild.id) {
                return true
            }
        }
        return false
    })
    if (!hallChannel) return

    const cfsMessage = await fetchMessage(message.client, hallChannel.id, commandArgs[0])
    if ((!cfsMessage) || (cfsMessage.deleted)) {
        message.lineReplyNoMention('broken cfsID: cfs may not exist or be deleted')
        return
    }
    if (!(!cfsMessage.reactions.cache.find(r => r.emoji.name.toString() === '🆗'))) {
        message.channel.send('Not supported !').then(m => m.delete({ timeout: 10000 }))
        message.delete()
        return
    }

    // pre-processing
    var embed = cfsMessage.embeds[0]
    var embedFields = embed.fields

    // remove reply
    if (commandArgs[1] === '--rm') {
        const member = await fetchMember(message.client, message.guild.id, message.author.id)
        const allowedRole = member.roles.cache.find(r => r.name === 'cfs-moderator')
        if (!allowedRole) return

        if (!isSnowflake(commandArgs[2]) && (!(commandArgs[2] === '*'))) return

        if (commandArgs[2] === '*') {
            var deletedReplyCount = 0
            for (let i = 0; i < embedFields.length; i++) {
                if (embedFields[i].name.startsWith('ReplyID: ')) {
                    embedFields.splice(i, 1)
                    deletedReplyCount++
                }
            }
            embed.fields = embedFields
            await cfsMessage.edit(embed)
            message.lineReplyNoMention(`Deleted **${deletedReplyCount}** replies.\n${cfsMessage.url}`)
            return
        }

        for (let i = 0; i < embedFields.length; i++) {
            if (embedFields[i].name === `ReplyID: ${commandArgs[2]}`) {
                embedFields.splice(i, 1)
            }
        }
        embed.fields = embedFields
        await cfsMessage.edit(embed)
        message.lineReplyNoMention(`Deleted **ReplyID: ${commandArgs[2]}**\n${cfsMessage.url}`)
        return
    }

    // add reply
    commandArgs.splice(0, 1)
    const replyContent = commandArgs.join('/')

    if (replyContent.length > 300) {
        message.lineReplyNoMention(`Too long ! (200 characters or less)`)
        return
    }

    var replyCount = 0
    for (let e of embedFields){
        if (e.name.startsWith('ReplyID: ')){
            replyCount++
        }
    }
    if (replyCount >= 5){
        message.lineReplyNoMention(`Maximum number of replies (5) reached !!!`)
        return
    }

    const userAlias = pageSettings.modAliases[message.author.id] ? `${pageSettings.modAliases[message.author.id]} (admin/mod)` : `${message.author.tag} (member)`
    const replyField = { name: `ReplyID: ${message.id}`, value: `>>> ${userAlias}\n${replyContent}` }

    let i = embedFields.findIndex(f => f.name === 'Tags')

    if (i === -1) {
        embedFields.push(replyField)
    } else {
        embedFields.splice(i, 0, replyField)
    }

    embed.fields = embedFields

    cfsMessage.edit(embed).then(m => {
        message.lineReplyNoMention(new MessageEmbed()
            .setURL(m.url)
            .setTitle(`Reply to cfsID: ${m.id}`)
            .setDescription(replyContent)
            .setAuthor(message.author.tag, message.author.avatarURL())
        )
    })
    return
}

module.exports = {
    metadata,
    config,
    exec
}