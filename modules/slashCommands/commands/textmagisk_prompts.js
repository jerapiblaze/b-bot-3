const metadata = {
    name: "prompts",
    description: "prompts tiếng việt",
    version: `1.0.0`,
    author:`jerapiblaze`
}

const discordRegData = {
    name: metadata.name,
    description: metadata.description,
    options: [
        {
            name: 'type',
            description: 'loại prompt',
            required: true,
            type:3,
            choices: [
                {
                    name: 'normal',
                    value: 'normal'
                },
                {
                    name: 'incorrect',
                    value: 'incorrect'
                },
                {
                    name: 'angst',
                    value: 'angst'
                },
                {
                    name: 'nsfw',
                    value: 'nsfw'
                },
                {
                    name: 'hardcore',
                    value: 'hardcore'
                }
            ]
        },
        {
            name: 'call',
            description: 'xưng hô',
            type:3,
            required:true,
            choices: [
                {
                    name: 'mày - tao',
                    value: 'maytao'
                },
                {
                    name: 'anh - em',
                    value: 'anhem'
                },
                {
                    name: 'chị - em',
                    value: 'chiem'
                },
                {
                    name: 'tôi - em',
                    value: 'toiem'
                },
                {
                    name: 'ta - em',
                    value: 'taem'
                },
                {
                    name: 'em - anh',
                    value: 'emanh'
                },
                {
                    name: 'em - chị',
                    value: 'emchi'
                },
                {
                    name: 'tớ - cậu',
                    value: 'tocau'
                },
                {
                    name: 'tôi - cậu',
                    value: 'toicau'
                },
                {
                    name: 'anh - bé',
                    value: 'anhbe'
                }
            ]
        },
        {
            name: 'a',
            description: 'tên char A',
            required: false,
            type: 3
        },
        {
            name: 'b',
            description: 'tên char B',
            required: false,
            type: 3
        },
        {
            name: 'c',
            description: 'tên char C',
            required: false,
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

const { MessageEmbed } = require("discord.js")
const prompts = require(`${__assetsDir}/prompts.js`)

const exec = (interaction) => {
    const options = interaction.commandOptions
    var promptsList = []
    if (options.type === 'hardcore') {
        promptsList = prompts['hardcore']
    } else {
        promptsList = prompts[options.type][options.call]
    }

    var selected = promptsList[random(0, promptsList.length)]
    if (options.a) {
        selected = selected.replaceAll('{A}', options.a.toUpperCase())
    }
    if (options.b) {
        selected = selected.replaceAll('{B}', options.b.toUpperCase())
    }
    if (options.c) {
        selected = selected.replaceAll('{C}', options.c.toUpperCase())
    }

    return new MessageEmbed()
        .setAuthor('Rất đỗi bê đê', null, 'https://www.facebook.com/pg/ratdoibede/posts/')
        .setTitle(`Prompts ${options.type} - Xưng hô: ${options.call}`)
        .setURL('https://prompt-tieng-viet.neocities.org/')
        .setDescription(selected)
        .setFooter(`
        Lưu ý
        - Một số prompt có nội dung gây khó chịu. Đọc phần đóng khung in đậm trước khi bạn đọc tiếp, hoặc bấm vào mục bên trên để chọn mục mình muốn đọc.
        - A là sub, B là dom, C là bạn của cả hai (ngoặc người yêu nếu chơi 3P).
        - Các prompt hoàn toàn giống nhau, chỉ khác mỗi phần xưng hô. Các nhân vật nói chuyện với nhau rất tục.
        - Đôi lúc bạn sẽ thấy không chơi được, thì khi đó bạn hãy đợi khoảng 3 phút và reload lại trang. Khi đó mình đang update prompts mới á.
        - Mình không biết code bằng JavaScript.
        `)
}

module.exports = {
    // there's nothing to do here
    config,
    metadata,
    exec
}