const metadata = {
    name: `fetchChannel`,
    description: `fetch channel`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const exec = async (client, channel_id) => {
    var channel = client.channels.cache.get(channel_id)
    if ((!channel) || (channel.partial)){
        channel = await client.channels.fetch(channel_id)
    }
    return channel
}

module.exports = {
    metadata,
    exec
}