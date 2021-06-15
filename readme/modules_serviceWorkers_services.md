filename structure: `${group}_${name}.js`
```js
// example.js
const config = {
    eventName: `SOME_EVENT_NAME`
    eventArgs: `some_args`
    disabled: false
}

const exec = (client, data) => {
    // do something with emited event data
}

module.exports = {
    config,
    exec
}
```