const metadata = {
    name: "pwdtest",
    description:"test your password strength",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name:'password',
            description:'your password',
            required:true,
            type: 3
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: true,
    ownerOnly: false,
    disabled: false
}

const { MessageEmbed } = require('discord.js')
const getPasswordStrength = require('password-strength-calc')

const exec = (interaction) => {
    const options = interaction.commandOptions
    var hiddenPwd = ''
    for (var i = 1; i <= options.password.length; i++){
        hiddenPwd += '•'
    }
    const strength = getPasswordStrength(options.password)
    var strengthColor = '0xeeff00'
    var strengthText = 'normal'

    if (strength <= 25){
        strengthColor = '0xff0000'
        strengthText = 'weak'
    }
    if (strength >= 85){
        strengthColor = '0x00ff00'
        strengthText = 'good'
    }

    const embed = new MessageEmbed()
        .setTitle('Password strength test')
        .setDescription(`
        Password: **${hiddenPwd}**
        Author: <@${interaction.member.user.id}>
        Length: **${hiddenPwd.length}**
        Strength: **${strength}**/100 (*${strengthText}*)
        `)
        .setColor(strengthColor)

    interaction.originalMessage.channel.send(embed)
    interaction.originalMessage.delete({timeout:500})
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}