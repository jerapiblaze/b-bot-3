const metadata = {
    name: 'retry',
    description: 'retry forward cfs from raw channel to hall channel',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `messageReactionAdd`,
    disabled: false
}

const {fetchMessage, fetchMember} = globalTools
const exec = async (reaction, user) => {
    if (!(reaction.emoji.name.toString() === '🔁')) return
    const member = await fetchMember(reaction.client, reaction.message.guild.id, user.id)
    const allowedRole = member.roles.cache.find(r => r.name === 'cfs-moderator')
    if (!allowedRole) return

    const message = await fetchMessage(reaction.client, reaction.message.channel.id, reaction.message.id)

    message.reactions.removeAll()
    services.raw2hall.exec(message)
}

module.exports = {
    metadata,
    config,
    exec
}