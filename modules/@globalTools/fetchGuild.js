const metadata = {
    name: `fetchGuild`,
    description: `fetch guild`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const exec = async (client, guild_id) => {
    var guild = client.guilds.cache.get(guild_id)
    if ((!guild) || (guild.partial)){
        guild = await client.guilds.fetch(guild_id)
    }
    return guild
}

module.exports = {
    metadata,
    exec
}