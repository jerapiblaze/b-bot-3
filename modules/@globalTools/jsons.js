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
    for (var g of Object.keys(cfsPageCounters)) {
        writeJson(`${g}_pageCounters.json`, cfsPageCounters[g])
    }
}

global.gameData = {}
const updateGameData = (guild_id) => {
    const name = guild_id ? `${guild_id}_games.json` : '_games.json'
    const allSvGames = readJson(name)
    for (var s of Object.keys(allSvGames)) {
        global.gameData[s] = allSvGames[s]
    }
}

const writeGameData = (guild_id) => {
    if (guild_id) {
        writeJson(`${guild_id}_games.json`, gameData[guild_id])
        return
    }
    for (var g of Object.keys(gameData)) {
        writeJson(`${g}_pageCounters.json`, gameData[g])
    }
}

global.serverPinnedMsgs = {}
const updatePinned = (guild_id) => {
    const name = guild_id ? `${guild_id}_svpinnedmsgs.json` : '_svpinnedmsgs.json'
    const allPinnedMsgs = readJson(name)
    for (var s of Object.keys(allPinnedMsgs)) {
        global.serverPinnedMsgs[s] = allPinnedMsgs[s]
    }
}

const writePinned = (guild_id) => {
    if (guild_id) {
        writeJson(`${guild_id}_svpinnedmsgs.json`, serverPinnedMsgs[guild_id])
        return
    }
    for (var g of Object.keys(serverPinnedMsgs)) {
        writeJson(`${g}_svpinnedmsgs.json`, serverPinnedMsgs[g])
    }
}

updateSettings()
updateCounters()
updateGameData()
updatePinned()

const exec = {
    updateSettings,
    writeSettings,
    updateCounters,
    writeCounter,
    updateGameData,
    writeGameData,
    updatePinned,
    writePinned
}

module.exports = {
    metadata,
    exec
}