const { MessageEmbed } = require("discord.js")

const metadata = {
    name: 'raw2hall',
    description: 'forward cfs from raw channel to hall channel',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `message`,
    disabled: false
}

const ignoreCheck = require('../tools/cfs_autoignore.js').exec
const exec = async (message) => {
    if ((message.channel.type === 'dm') || (!message.guild)) return
    const pageSettings = cfsPageSettings[message.guild.id]
    if (!pageSettings) return

    const rawName = message.channel.name.split('-')
    if (!pageSettings[rawName[0]]) return
    if (!(rawName[1] === 'raw')) return

    const target = message.client.channels.cache.find(c => {
        if (c.name === `${rawName[0]}-hall`){
            if (c.guild.id === message.guild.id){
                return true
            }
        }
        return false
    })
    if (!target) return

    const ignoreDiclist = Array.prototype.concat(`global_${pageSettings[rawName[0]].globalIgnoreDics}`, `${message.guild.id}_${rawName[0]}`)

    if (ignoreCheck(message, ignoreDiclist) && (!message.forceAllowCfs)) {
        message.react('⚠')
        return
    }

    target.send(message.embeds[0]).then(m => {
        m.react('✅')
        m.react('⛔')

        const embed = new MessageEmbed(m.embeds[0])
            .setAuthor(rawName[0])
            .setTitle(m.id)

        m.edit(embed)
        message.react('🆗')
    })
}

module.exports = {
    metadata,
    config,
    exec
}