const metadata = {
    name: 'updateGlobalPinMsg',
    description: 'retry forward cfs from raw channel to hall channel',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `messageUpdate`,
    disabled: false
}

const {fetchMessage, fetchMember} = globalTools
const {convertMsg2Embed} = globalTools
const exec = async (oldMessage, newMessage) => {
    const message = await fetchMessage(oldMessage.client, oldMessage.channel.id, oldMessage.id)
    if ((message.channel.type === 'dm') || (!message.guild)) return
    
    const svLinks = serverPinnedMsgs[message.guild.id]
    if (!svLinks) return

    const rawLink = svLinks[`${message.channel.id}_${message.id}`]
    if (!rawLink) return

    const link = rawLink.split('_')
    const pinnedMessage = await fetchMessage(message.client, link[0], link[1])

    const convertedEmbed = await convertMsg2Embed(message)
    
    pinnedMessage.edit(convertedEmbed)
}

module.exports = {
    metadata,
    config,
    exec
}