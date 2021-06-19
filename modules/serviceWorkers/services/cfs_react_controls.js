const { MessageEmbed } = require("discord.js")

const metadata = {
    name: 'cfs_clearTag_Reject_Recycle',
    description: 'clear tags, reject, recycle',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `messageReactionAdd`,
    disabled: false
}

const { fetchMember, fetchMessage } = globalTools
const FB = require('fb')

const exec = async (reaction, user) => {
    if ((reaction.message.channel.type === 'dm') || (!reaction.message.guild)) return
    const member = await fetchMember(reaction.client, reaction.message.guild.id, user.id)
    const allowedRole = member.roles.cache.find(r => r.name === 'cfs-moderator')
    if (!allowedRole) return

    const serverPageSettings = cfsPageSettings[reaction.message.guild.id]
    if (!serverPageSettings) return

    const rawName = reaction.message.channel.name.split('-')
    const pageSettings = serverPageSettings[rawName[0]]
    if (!pageSettings) return
    if (!(rawName[1] === 'hall')) return

    const message = await fetchMessage(reaction.client, reaction.message.channel.id, reaction.message.id)

    if (!(message.author.id === reaction.client.user.id)) return

    if (!(!message.reactions.cache.find(r => r.emoji.name.toString() === '🆗'))) return

    if (reaction.emoji.name.toString() === '🧹') {
        reaction.remove()
        var embed = message.embeds[0]
        var embedFields = embed.fields
        for (var i = 0; i < embedFields.length; i++) {
            if (embedFields[i].name === 'Tags') {
                embedFields.splice(i, 1)
                break
            }
        }
        embed.fields = embedFields

        message.edit(embed)
        return
    }

    if (reaction.emoji.name.toString() === '⛔') {
        await message.reactions.removeAll()
        message.react('🔁')
        return
    }

    if (reaction.emoji.name.toString() === '🔁') {
        await message.reactions.removeAll()
        message.react('✅')
        message.react('⛔')
        return
    }

    if (reaction.emoji.name.toString() === '✅') {
        message.react('⏳')

        // pre-load counter
        if (!cfsPageCounters[reaction.message.guild.id]){
            cfsPageCounters[reaction.message.guild.id] = {}
        }
        if (!cfsPageCounters[reaction.message.guild.id][rawName[0]]){
            cfsPageCounters[reaction.message.guild.id][rawName[0]] = 0
        }

        // post compose
        var postContent = ''
        postContent += pageSettings.prefix.pageHastag ? `#${rawName[0]}\n` : ''

        const fields = message.embeds[0].fields

        const tagField = fields.find(f => f.name === 'Tags')
        var postCensor = false
        if (tagField) {
            tagsNames = tagField.value.split(',')
            for (let t of tagsNames) {
                const tag = pageSettings.tags.find(o => o.name === t.trim())
                if (!tag) continue
                if (pageSettings.prefix.showTagNote) {
                    postContent += `${tag.icon} ${tag.note}\n`
                }
                if (tag.censor) {
                    postCensor = true
                }
            }
        }

        if (postCensor) {
            for (var i = 0; i <= 13; i++) {
                postContent += `${pageSettings.prefix.censor}\n`
            }
        }
        var replies = []
        for (let f of fields) {
            if (f.name === 'Tags') continue
            if (f.name.startsWith('ReplyID: ')) {
                replies.push(f.value)
                continue
            }
            postContent += f.name.endsWith('(cont.)') ? f.value : `\n${f.value}`
        }

        postContent += '\n\n'
        for (let r of replies) {
            postContent += `${r}\n`
        }

        postContent += '\n'
        postContent += tagField ? `\n[tags] ${tagField.value}\n\n` : ``

        postContent += `====\n`

        postContent += pageSettings.surfix.showDate ? `[time] ${message.embeds[0].footer.text}\n` : ''

        switch (pageSettings.surfix.cfsIndexType) {
            case 'both': {

            }
            case 'id': {
                postContent += `[cfsID] ${message.id}\n`
                if (!(pageSettings.surfix.cfsIndexType === 'both')) break
            };
            case 'counter': {
                cfsPageCounters[reaction.message.guild.id][rawName[0]]++
                postContent += `[cfsCount] #${cfsPageCounters[reaction.message.guild.id][rawName[0]]}\n`
                globalTools.pageData.writeCounter(reaction.message.guild.id)
                if (!(pageSettings.surfix.cfsIndexType === 'both')) break
            }
        }

        postContent += `[note] ${pageSettings.surfix.note}`

        const embed = new MessageEmbed(message.embeds[0])
            .setDescription(`Approved: ${member}\n${Date()}`)
            .setColor(0x34FE50)

        if (pageSettings.fbConfigs.enabled) {
            FB.setAccessToken(pageSettings.fbConfigs.pageToken)
            var r = {}
            try {
                r = await FB.api(
                    `/${pageSettings.fbConfigs.pageID}/feed`,
                    `post`,
                    {
                        message: postContent
                    }
                )
            } catch (e){
                r.error = e
            }
            if ((!r) || (r.error)) {
                await message.reactions.removeAll()
                message.react('❌')
                message.react('🔁')
                return
            }
            embed.setURL(`https://www.facebook.com/${r.id.slice(pageSettings.fbConfigs.pageID.length + 1)}`)
        }

        await message.reactions.removeAll()
        message.edit(embed)
        message.react('🆗')
        return
    }

    const addedTag = pageSettings.tags.find(t => t.icon === reaction.emoji.name.toString())
    if (!addedTag) return
    var embed = message.embeds[0]
    var embedFields = embed.fields
    var tagFiledIndex = embedFields.findIndex(e => e.name === 'Tags')
    if (tagFiledIndex === -1) {
        embedFields.push({ name: 'Tags', value: `${addedTag.name}` })
    } else {
        embedFields[tagFiledIndex].value += `,${addedTag.name}`
    }
    embed.fields = embedFields
    await message.edit(embed)
    reaction.remove()
    return
}

module.exports = {
    metadata,
    config,
    exec
}