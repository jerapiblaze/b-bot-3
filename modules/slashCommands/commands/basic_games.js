const metadata = {
    name: `games`,
    description: `game related commands`,
    version: `1.0.0`,
    author: `jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'cmd',
            description: 'command',
            required: true,
            type: 3,
            choices: [
                {
                    name: `call friends to play games`,
                    value: `play`
                },
                {
                    name: `mention me when someone want to play this game`,
                    value: `join`
                },
                {
                    name: `dont mention me whenever someone want to play this game`,
                    value: `leave`
                },
                {
                    name: `show info about games in this server`,
                    value: `info`
                }
            ]
        },
        {
            name: `code`,
            description: `game code (leave empty if choose all available games)`,
            required: false,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions: [],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed, Message } = require("discord.js")
const { writeGameData } = globalTools.pageData

const exec = async (interaction) => {
    const client = interaction.client
    const options = interaction.commandOptions

    if (!gameData[interaction.guild_id]) return `No game available in this server.`
    if ((!gameData[interaction.guild_id][options.code]) && !(!options.code)) return `404: game not found`

    switch (options.cmd) {
        case 'info': {
            var output = ''
            if (!options.code) {
                output += `\`\`\`ini\n`
                for (var c of Object.keys(gameData[interaction.guild_id])) {
                    var game = gameData[interaction.guild_id][c]
                    output += `[${c}] ${game.name}\n`
                }
                output += `\`\`\``
                const embed = new MessageEmbed()
                    .setTitle(`Avaiable games`)
                    .setDescription(output)

                return embed
            }
            var game = gameData[interaction.guild_id][options.code]
            const embed = new MessageEmbed()
                .setTitle(`About game: [${options.code}] ${game.name}`)
                .setDescription(game.description)
                .setThumbnail(game.icon)
            var players = ``
            for (let p of game.players) {
                players += `<@${p}>`
            }
            if (players.length > 0) {
                embed.addField(`Players (${game.players.length})`, players)
            }
            return embed
        }

        case 'play': {
            if (!options.code) return `You cannot play all the game at once.`
            var game = gameData[interaction.guild_id][options.code]
            if (!game) return `404: no game found`
            var i = game.players.findIndex(p => p === interaction.originalMember.id)
            if (i === -1){
                return `You are not joinned this game. Join it first.`
            }
            const embed = new MessageEmbed()
                .setTitle(game.name)
                .setDescription(game.description)
                .setThumbnail(game.icon)
                .setFooter(interaction.originalMessage.createdAt)
                .setAuthor(interaction.originalMember.user.tag, interaction.originalMember.user.avatarURL())

            var players = ``
            for (let p of game.players) {
                players += `<@${p}>`
            }

            interaction.originalMessage.channel.send(`It's time to playyyyyy **${game.name}**\n${players}`, embed)
            interaction.originalMessage.delete({timeout: 3000})
            return null
        }

        case 'join': {
            if (!options.code) {
                for (var c of Object.keys(gameData[interaction.guild_id])) {
                    var i = gameData[interaction.guild_id][c].players.findIndex(p => p === interaction.originalMember.id)
                    if (i === -1) {
                        gameData[interaction.guild_id][c].players.push(interaction.originalMember.id)
                    }
                }
                writeGameData(interaction.guild_id)
                return `You will be mentioned when anyone want to play **any game**`
            }

            if (!gameData[interaction.guild_id][options.code]) return `404: no game found`

            var i = gameData[interaction.guild_id][options.code].players.findIndex(p => p === interaction.originalMember.id)
            if (i === -1) {
                gameData[interaction.guild_id][options.code].players.push(interaction.originalMember.id)
            }
            writeGameData(interaction.guild_id)
            return `You will be mentioned when anyone want to play **${gameData[interaction.guild_id][options.code].name}**`
        }

        case 'leave': {
            if (!options.code) {
                for (var c of Object.keys(gameData[interaction.guild_id])) {
                    var i = gameData[interaction.guild_id][c].players.findIndex(p => p === interaction.originalMember.id)
                    if (!(i === -1)) {
                        gameData[interaction.guild_id][c].players.slice(i, 1)
                    }
                }
                writeGameData(interaction.guild_id)
                return `You wil **NOT** be mentioned when anyone want to play **any** game`
            }
            if (!gameData[interaction.guild_id][options.code]) return `404: no game found`

            var i = gameData[interaction.guild_id][options.code].players.findIndex(p => p === interaction.originalMember.id)
            
            if (!(i === -1)) {
                gameData[interaction.guild_id][options.code].players.splice(i, 1)
            }
            writeGameData(interaction.guild_id)
            return `You will **NOT** be mentioned when anyone want to play **${gameData[interaction.guild_id][options.code].name}**`
        }
    }
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}