const metadata = {
    name: 'scanMessage',
    description: 'log message text content to console',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `message`,
    disabled: true
}

const {convertMsg2Embed} = globalTools
const {APIMessage} = require('discord.js')

const createAPImessage = async (channel, content) => {
    const { data, files } = await APIMessage.create(
        channel,
        content
    )
        .resolveData()
        .resolveFiles()
    return { ...data, files }
}
const exec = async (message) => {
    if (message.author.bot) return
    if ((message.channel.type === 'dm') || (!message.guild)) return
    
    const target = message.client.channels.cache.find(c => {
        if (c.name === `pinned`){
            if (c.guild.id === message.guild.id){
                return true
            }
        }
        return false
    })
    if (!target) return

    if (target.id === message.channel.id) return

    const convertedEmbed = await convertMsg2Embed(message)
    
    target.send(convertedEmbed)
}

module.exports = {
    metadata,
    config,
    exec
}