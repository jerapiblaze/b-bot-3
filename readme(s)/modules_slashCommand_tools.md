filename structure: `${name}.js`
```js
// example.js
const metadata = {
    name: `name`,
    description: `description`,
    version: `version`,
    author: `author`,
}

const exec = (inputs) => {
    // do something with inputs
}

module.exports = {
    metadata,
    exec
}
```