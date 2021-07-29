filename structure: `${group}_${name}.js`
```js
// example.js
const config = {
    eventName: `SOME_EVENT_NAME`
    disabled: false
}

const exec = (event_args) => {
    // do something with emited event data
}

module.exports = {
    config,
    exec
}
```