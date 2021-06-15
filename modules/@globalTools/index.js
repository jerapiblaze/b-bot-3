const metadata = {
    name: `index`,
    description: `index all available tools`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const fs = require('fs')
const exec = (dir, key) => {
    var workDir = `${__myModules}/@globalTools`
    var k = 'exec'
    if (dir) {
        workDir = dir
    }
    if (key) {
        k = key
    }
    const files = fs.readdirSync(workDir).filter(f => f.endsWith('.js'))
    var tools = {}
    for (var f of files) {
        const content = require(`${workDir}/${f}`)
        if (k === '*'){
            tools[content.metadata.name] = content
        } else {
            tools[content.metadata.name] = content[k]
        }
    }
    return tools
}

module.exports = {
    metadata,
    exec
}