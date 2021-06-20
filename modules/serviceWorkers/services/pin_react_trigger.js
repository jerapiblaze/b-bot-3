const metadata = {
    name: 'globalPinMsg',
    description: 'retry forward cfs from raw channel to hall channel',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `messageReactionAdd`,
    disabled: false
}

const {fetchMessage, fetchMember} = globalTools
const {convertMsg2Embed} = globalTools
const exec = async (reaction, user) => {
    if ((reaction.message.channel.type === 'dm') || (!reaction.message.guild)) return
    if (!(reaction.emoji.name.toString() === '📌')) return
    const member = await fetchMember(reaction.client, reaction.message.guild.id, user.id)
    const allowedRole = member.hasPermission('MANAGE_MESSAGES')
    if (!allowedRole) return

    const message = await fetchMessage(reaction.client, reaction.message.channel.id, reaction.message.id)

    const target = message.client.channels.cache.find(c => {
        if (c.name === `server-pinned`){
            if (c.guild.id === message.guild.id){
                return true
            }
        }
        return false
    })
    if (!target) return

    if (target.id === message.channel.id) return

    if (!serverPinnedMsgs[reaction.message.guild.id]){
        serverPinnedMsgs[reaction.message.guild.id] = {}
    } else {
        if (!(!serverPinnedMsgs[reaction.message.guild.id][`${reaction.message.channel.id}_${reaction.message.id}`])){
            return
        }
    }
    
    const convertedEmbed = await convertMsg2Embed(message)
    
    target.send(convertedEmbed).then(m => {
        serverPinnedMsgs[reaction.message.guild.id][`${reaction.message.channel.id}_${reaction.message.id}`] = `${target.id}_${m.id}`
        globalTools.pageData.writePinned(reaction.message.guild.id)
    })
}

module.exports = {
    metadata,
    config,
    exec
}