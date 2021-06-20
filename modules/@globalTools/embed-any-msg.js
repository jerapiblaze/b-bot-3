const metadata = {
    name: `convertMsg2Embed`,
    description: `convert any message to embed`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const avgColor = require('fast-average-color-node').getAverageColor
const { MessageEmbed } = require('discord.js')
const isImage = require('is-image');

const exec = async (message) => {
    var quotedEmbed = new MessageEmbed()
    if (message.attachments.array().length > 0) {
        if (isImage(message.attachments.first().url)) {
            quotedEmbed.setImage(message.attachments.first().url)
        } else {
            quotedEmbed.attachFiles(message.attachments.array())
        }
    }
    var flag = ''
    if (message.edits.length > 1){
        flag = '| edited'
    }
    quotedEmbed.description = message.content
    quotedEmbed.author = {
        name: message.author.tag,
        iconURL: message.author.avatarURL(),
        url: message.url
    }
    quotedEmbed.footer = {
        text: `#${message.channel.name} | ${message.attachments.array().length} attachments ${flag}`
    }

    let usrColor = await avgColor(message.author.avatarURL({ format: 'png', size: 4096 }))
    quotedEmbed.color = `0x${usrColor.hex.slice(1, 7)}`

    return quotedEmbed
}

module.exports = {
    metadata,
    exec
}