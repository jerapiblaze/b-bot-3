filename structure: `${group}_${name}.js`
```js
// example.js
const metadata = {
    name: `name`,
    description: `description`,
    version: `version`,
    author: `author`,
}

const exec = (input) => {
    // do something with the input
}

module.exports = {
    metadata,
    exec
}
```