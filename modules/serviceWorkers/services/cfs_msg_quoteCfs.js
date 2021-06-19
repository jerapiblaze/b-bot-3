const metadata = {
    name: 'cfs_msg_quoteCfs',
    description: 'reply',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `message`,
    disabled: false
}

const { fetchMessage } = globalTools

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
    if (!message.content.startsWith('/cfs')) return

    const commandArgs = message.content.split(' ')
    commandArgs.shift()

    const serverPageSettings = cfsPageSettings[message.guild.id]
    if (!serverPageSettings) return

    const pageSettings = serverPageSettings[commandArgs[0]]
    if (!pageSettings) {
        message.lineReplyNoMention('404: no cfs page found')
        return
    }

    if (!isSnowflake(commandArgs[1])) {
        message.lineReplyNoMention('invalid cfsID')
        return
    }

    const hallChannel = message.client.channels.cache.find(c => {
        if (c.name === `${commandArgs[0]}-hall`) {
            if (c.guild.id === message.guild.id) {
                return true
            }
        }
        return false
    })
    if (!hallChannel) return

    const cfsMessage = await fetchMessage(message.client, hallChannel.id, commandArgs[1])
    if ((!cfsMessage) || (cfsMessage.deleted)) {
        message.lineReplyNoMention('broken cfsID: cfs may not exist or be deleted')
        return
    }

    message.lineReplyNoMention(cfsMessage.url, cfsMessage.embeds[0])
    return
}

module.exports = {
    metadata,
    config,
    exec
}