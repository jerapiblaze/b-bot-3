const metadata = {
    name: `ping`,
    description: `perform a ping`,
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require("discord.js")
const avgColor = require('fast-average-color-node').getAverageColor
const { ms2human } = globalTools.timeTools

const exec = async (interaction) => {
    const client = interaction.client
    const options = interaction.commandOptions

    let usrColor = await (await avgColor(client.user.displayAvatarURL({ format: 'png', size: 4096 })))

    const time = new Date().toString().split(' ').splice(0, 6).join(' ')
    const embed = new MessageEmbed()
        .setTitle('🔥 PING PONG')
        .setDescription('A ping pong has just been done.')
        .setColor(`0x${usrColor.hex.slice(1, 7)}`)
        .addFields([
            { name: `${client.ws.ping} ms`, value: 'API Latency', inline: true },
            { name: `${client.ws.totalShards}`, value: 'Shards count', inline: true },
            { name: `Uptime`, value: `\`\`\`md\n# ${ms2human(client.uptime, { label: { days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds' }, min: 3, roundLast: true })} \`\`\`` },
            { name: `My time now`, value: `\`\`\`glsl\n# ${time} \`\`\`` },
            { name: `Host info`, value: `\`\`\`md\n$ NodeJS ${process.version} [${process.platform}](${process.arch})\n\`\`\``}
        ])
        .setThumbnail(client.user.displayAvatarURL())
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}