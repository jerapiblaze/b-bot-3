const metadata = {
    name: `fetchMessage`,
    description: `fetch message`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const fetchChannel = require('./fetchChannel.js').exec
const fetchGuild = require('./fetchGuild.js').exec

const exec = async (client, channel_id, message_id) => {
    var channel = await fetchChannel(client, channel_id)
    var message = channel.messages.cache.get(message_id)
    if ((!message) || (message.partial)){
        message = await channel.messages.fetch(message_id)
    }
    if (message.guild.partial){
        message.guild = await fetchGuild(client, guild_id)
    }
    return message
}

module.exports = {
    metadata,
    exec
}