const metadata = {
    name: `pageData`,
    description: `returns page settings`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const fs = require('fs')

const readJson = (end) => {
    const files = fs.readdirSync(__dataDir).filter(f => f.endsWith(end))
    var output = {}
    for (var f of files) {
        var content = {}
        try {
            content = JSON.parse(fs.readFileSync(`${__dataDir}/${f}`))
        } catch (e) {
            content.error = e
        }
        const name = f.split('_')[0]
        output[name] = content
    }
    return output
}

const writeJson = (name, data) => {
    fs.writeFileSync(`${__dataDir}/${name}`, JSON.stringify(data))
}

global.cfsPageSettings = {}
const updateSettings = (guild_id) => {
    const name = guild_id ? `${guild_id}_pageSettings.json` : '_pageSettings.json'
    const allSettings = readJson(name)
    for (var s of Object.keys(allSettings)) {
        global.cfsPageSettings[s] = allSettings[s]
    }
}

const writeSettings = (guild_id) => {
    if (guild_id) {
        writeJson(`${guild_id}_pageSettings.json`, cfsPageSettings[guild_id])
        return
    }
    for (var g of Object.keys(cfsPageSettings)) {
        writeJson(`${g}_pageSettings.json`, cfsPageSettings[g])
    }
}

global.cfsPageCounters = {}
const updateCounters = (guild_id) => {
    const name = guild_id ? `${guild_id}_pageCounters.json` : '_pageCounters.json'
    const allCounters = readJson(name)
    for (var s of Object.keys(allCounters)) {
        global.cfsPageCounters[s] = allCounters[s]
    }
}

const writeCounter = (guild_id) => {
    if (guild_id) {
        writeJson(`${guild_id}_pageCounters.json`, cfsPageCounters[guild_id])
        return
    }
    for (var g of Object.keys(cfsPageSettings)) {
        writeJson(`${g}_pageCounters.json`, cfsPageCounters[g])
    }
}

updateSettings()
updateCounters()

const exec = {
    updateSettings,
    writeSettings,
    updateCounters,
    writeCounter
}

module.exports = {
    metadata,
    exec
}