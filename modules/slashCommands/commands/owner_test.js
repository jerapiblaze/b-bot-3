const metadata = {
    name: `test`,
    description: `evaluate an expression`,
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'code',
            description: 'js code here',
            required: true,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: true,
    ownerOnly: true,
    disabled: false
}

const { MessageEmbed } = require("discord.js")

function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

const exec = async (interaction) => {
    const options = interaction.commandOptions
    var time = Date.now()
    var output = await eval(options.code)
    if ((output) && (output.toString().length > 0)) {
        output = chunkString(output.toString(), 1000)
    } else {
        output = ['= no output =']
    }
    time = Date.now() - time
    const embed = new MessageEmbed()
        .setTitle('Dev\'s code sandbox')
        .setColor('0xff0000')
        .setDescription(`
        **DANGEROUS** COMMAND
        ONLY RUN **TRUSTED** CODE
        Hope you know **exactly** what you are doing
        `)
        .addField('Code', `\`\`\`js\n${options.code}\n\`\`\``)
        .addField('Execute time', `\`\`\`diff\n+ ${time}ms\n\`\`\``)

    if (!(typeof (output) === 'string')) {
        for (var o of output) {
            embed.addField(`Output`, `\`\`\`js\n${o}\n\`\`\``)
        }
    } else {
        embed.addField(`Output`, `\`\`\`js\n${output}\n\`\`\``)
    }
    return embed
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}