const fetchGuild = require('./fetchGuild.js').exec

const metadata = {
    name: `fetchMember`,
    description: `fetch guild member`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const exec = async (client, guild_id, user_id) => {
    const guild = await fetchGuild(client, guild_id)
    var member = guild.members.cache.get(user_id)
    if ((!member) || (member.partial)){
        member = await guild.members.fetch(user_id)
    }
    return member
}

module.exports = {
    metadata,
    exec
}