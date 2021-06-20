const metadata = {
    name: 'unlinkGlobalPinMsg',
    description: 'unlink pinned msg',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `messageDelete`,
    disabled: false
}

const {fetchMessage} = globalTools
const exec = async (message) => {
    if ((message.channel.type === 'dm') || (!message.guild)) return
     
    if (!serverPinnedMsgs[message.guild.id]) return

    if (!serverPinnedMsgs[message.guild.id][`${message.channel.id}_${message.id}`]) return

    const link = serverPinnedMsgs[message.guild.id][`${message.channel.id}_${message.id}`].split('_')

    const pinnedMessage = await fetchMessage(message.client, link[0], link[1])
    
    pinnedMessage.edit(`***⚠ original message was deleted ⚠***`, pinnedMessage.embeds[0])

    serverPinnedMsgs[message.guild.id][`${message.channel.id}_${message.id}`] = undefined
    globalTools.pageData.writePinned(message.guild.id)
}

module.exports = {
    metadata,
    config,
    exec
}