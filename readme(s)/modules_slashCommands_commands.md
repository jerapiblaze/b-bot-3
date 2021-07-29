filename structure: `${group}_${name}.js`
```js
// example.js
const discordRegData = {
    name: `command-display-name`,
    description: `command description`,
    options: [
        {
            name: `option-name`,
            description: `option description`,
            required: true,
            type: 3
        },
        {
            name: `other-option-name`,
            descriptiion: `option description`,
            required: false,
            type: 3,
            choices: [
                {
                    name: `choice-display-name`,
                    value: `value_of_the_choice`
                }
            ]
        }
    ]
}

const config = {
    discordRegData, // dont-do-any-thing-with-this-line
    forceRegister: false,
    requiredPermissions:[],
    allowDM: false,
    ownerOnly: false,
    disabled: false
}

const exec = (interaction) => {
    // do something with the input interaction
}

module.exports = {
    // there's nothing to do here
    config,
    exec
}
```