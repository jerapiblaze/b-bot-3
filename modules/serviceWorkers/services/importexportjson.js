const metadata = {
    name: 'importexportjsons',
    description: 'reply',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `message`,
    disabled: false
}

const { fetchMessage, fetchMember } = globalTools

const isSnowflake = (n) => {
    if (isNaN(n)) {
        return false
    }
    if (n.toString().length === 18) {
        return true
    }
    return false
}

const { MessageAttachment } = require('discord.js')
const fs = require('fs')
const bent = require('bent')
const getJSON = bent('json')

const jsonFileNames = ['pageSettings', 'pageCounters', 'games']

const exp = async (message, t) => {
    const file = new MessageAttachment(`${__dataDir}/${message.guild.id}_${t}.json`)
    try {
        await message.author.send('check your json 🔥', file)
        message.lineReplyNoMention('check your DMs box 🔥')
    } catch (e) {
        message.channel.send('cannot send DMs. check your settings.')
    }
    return
}
const exec = async (message) => {
    if (!message.content.startsWith('/json')) return

    if ((message.channel.type = 'text') && (!message.attachments)) {
        const member = await fetchMember(message.client, message.guild.id, message.author.id)
        const allowedRole = member.hasPermission('ADMINISTRATOR')
        if (!allowedRole) return

        const type = message.content.split(' ')[1]

        if (!type) {
            const files = fs.readdirSync(`${__dataDir}`).filter(f => {
                if (f.startsWith(message.guild.id)) {
                    if (f.endsWith('.json')) {
                        return true
                    }
                }
                return false
            })
            var jsonNames = ''
            for (let f of files) {
                jsonNames += `*${f.split('_')[1].split('.')[0]}* `
            }
            message.lineReplyNoMention(`Avalable jsons: ${jsonNames}`)
            return
        }

        exp(message, type)
    }

    if ((!message.guild) && !(!message.attachments)){
        const rawName = message.attachments.first().name.split('_')

        const guild_id = rawName[0]

        if (!isSnowflake(guild_id)){
            message.lineReplyNoMention('invalid guild id')
            return
        }

        const member = await fetchMember(message.client, guild_id, message.author.id)
        if (!member){
            message.lineReplyNoMention('404: guild not found')
            return
        }
        const allowedRole = member.hasPermission('ADMINISTRATOR')
        if (!allowedRole) {
            message.lineReplyNoMention('not permitted')
        }

        try {
            const type = jsonFileNames.find(j => j === rawName[1].split('.')[0])
            if (!type){
                throw 'invalid file name'
            }
            const ext = rawName[1].split('.')[1]
            if (!(ext === 'json')) throw 'invalid filename'
            const parsedContent = await getJSON(message.attachments.first().url)

            fs.writeFileSync(`${__dataDir}/${guild_id.trim()}_${type}.json`, JSON.stringify(parsedContent))

            globalTools.pageData.updateSettings(guild_id)
            globalTools.pageData.updateCounters(guild_id)

            message.lineReplyNoMention('🔥 file imported')
        } catch(e){
            message.lineReplyNoMention(`error: ${e}`)
        }
    }
}

module.exports = {
    metadata,
    config,
    exec
}