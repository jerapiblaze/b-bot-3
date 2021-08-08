'use-strict'
console.log('> Process launched <')
console.log('> Logs are saved in ./data/logs')

// initialize global variables
global.__rootDir = __dirname
global.__tempDir = `${__rootDir}/data/temp`
global.__myModules = `${__rootDir}/modules`
global.__dataDir = `${__rootDir}/data/@data`
global.__assetsDir = `${__rootDir}/data/@assets`

global.__botConfig = require(`${__rootDir}/botconfig.json`)
global.__URLs = require(`${__assetsDir}/urls.json`)

global.sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
global.random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}
global.globalTools = require(`${__myModules}/@globalTools/index.js`).exec()

Object.freeze(global.__rootDir)
Object.freeze(global.__tempDir)
Object.freeze(global.__myModules)
Object.freeze(global.__dataDir)
Object.freeze(global.__assetsDir)
Object.freeze(global.__botConfig)
Object.freeze(global.__URLs)

// initialize environment variables
if (__botConfig.devmode.useDotEnv) {
    require('dotenv').config()
}

// initialize logging
const winston = require('winston')
const { combine, timestamp, json, colorize, printf } = winston.format;

global.logger = winston.createLogger({
    level: __botConfig.devmode.logging.level,
    format: combine(
        timestamp(),
        json()
    ),
    defaultMeta: { service: 'B-bot-beta' },
    transports: [
        new winston.transports.File({ filename: `${__rootDir}/data/logs/err.log`, level: 'error' })
    ],
});

if (__botConfig.devmode.logging.useConsole) {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            printf((info) => {
                return `${info.level} \t ${info.message} \t(${info.module})`;
            })
        ),
    }));
}

const childLogger = logger.child({ module: 'main' })
childLogger.info(`Hello. I am B-bot`)

// initialize discord client
const Discord = require('discord.js')
const { features } = require('process')
require('discord-reply');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'] })

// initialize backup feature
if (__botConfig.devmode.backup.enabled) {
    const Backuper = require('./modules/@backupWorker/index')

    const backupLogger = logger.child({ module: 'backup' })
    backupLogger.info(`Auto-backup enabled (interval: ${globalTools.timeTools.ms2human(__botConfig.devmode.backup.interval, { min: 3 })})`)

    const backupWorker = new Backuper({
        discordToken: __botConfig.devmode.backup.useSeperatedClient ? process.env.DISCORD_BACKUPBOT_TOKEN : process.env.DISCORD_BOT_TOKEN,
        workDir: `./data/@backup`,
        backupDir: `./data`,
        exclude: ['.temp', '@backup', '@assets'],
        discordChannelID: __botConfig.devmode.backup.to.channelID,
        keepClientAlive: __botConfig.devmode.backup.keepBackupClientAlive,
        name: `bbot_backup`,
        comment: `b-bot data backup file`,
        unSecure: __botConfig.devmode.backup.useSeperatedClient
    })

    backupWorker.on(`warn`, (e) => {
        backupLogger.warn(e)
    })

    global.backupTask = async () => {
        backupLogger.debug(`backup in progress`)
        await backupWorker.backupNow().catch(e => {
            backupLogger.error(e)
        })
        backupLogger.debug(`backup completed`)
    }

    global.restoreTask = async (msgid) => {
        backupLogger.debug(`restore in progress`)
        await backupWorker.restoreNow(msgid).catch(e => {
            backupLogger.error(e)
        })
        /* globalTools.pageData.updateSettings()
        globalTools.pageData.updateCounters()
        globalTools.pageData.updateGameData()
        globalTools.pageData.updatePinned()
        globalTools.pageData.updateIgnoreDic() */
        globalTools.pageData.updateAll()
        backupLogger.debug(`restore completed`)
    }

    global.disableRestore = (on) => {
        backupLogger.warn(`${on ? 'disable' : 'enable'} restore`)
        backupWorker.restoreDisabled = on
    }

    global.disableBackup = (on) => {
        backupLogger.warn(`${on ? 'disable' : 'enable'} backup`)
        backupWorker.backupDisabled = on
    }

    global.destroyBackup = () => {
        backupLogger.warn(`destroying backup instance`)
        backupWorker.destroy()
    }

    Object.freeze(global.backupTask)
    Object.freeze(global.restoreTask)
    Object.freeze(global.disableRestore)
    Object.freeze(global.disableBackup)

    setInterval(backupTask, __botConfig.devmode.backup.interval)
}

// log errors
client.on('rateLimit', (info) => {
    const { timeout } = info
    childLogger.warn(`RATE_LIMIT REACHED: cooldown ${timeout}ms`)
})
client.on('disconnect', () => {
    childLogger.error('Disconnected');
})
client.on('shardError', (error, shardID) => {
    childLogger.error(`_shard_${shardID}: ${error}`);
})
client.on('shardDisconnect', (CloseEvent, id) => {
    childLogger.error(`_shard_${id} disconnected: ${CloseEvent}`)
})
client.on('error', (error) => {
    childLogger.error(`Client error: ${error}`)
})
client.on('warn', (info) => {
    childLogger.warn(info)
})

const exitProtocol = async (event, err) => {
    childLogger.info(`I'm gonna sleep now.\t${event}\t\terror:${err}`)
    if (!(!err)) {
        childLogger.error(err)
    }
    childLogger.silly(`Destroying client`)
    client.destroy()
    if (__botConfig.devmode.backup.backupAtShutdown) {
        await backupTask()
    }
    destroyBackup()
    childLogger.debug('Client terminated')
    childLogger.debug('terminate signal sent')
    process.exit(err ? 1 : 0)
}

process.on('beforeExit', () => exitProtocol('beforeExit', null))
process.on('exit', () => exitProtocol('exit', null))
process.on('uncaughtException', (err) => exitProtocol('uncaughtException', err))
process.on('SIGINT', () => exitProtocol('SIGINT', null))
process.on('SIGQUIT', () => exitProtocol('SIGQUIT', null))
process.on('SIGTERM', () => exitProtocol('SIGTERM', null))

// initialze modules
const slashCommands = require(`${__myModules}/slashCommands/index.js`)
slashCommands.setClient(client)
const serviceWorkers = require(`${__myModules}/serviceWorkers/index.js`)
serviceWorkers.setClient(client)

// login
childLogger.debug('Connecting to Discord')
client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    childLogger.error(err)
})

// go go go
client.on('ready', async () => {
    childLogger.debug('Connected to Discord !')
    if (__botConfig.devmode.backup.restoreAtStartup) {
        await restoreTask()
    }
    if (__botConfig.devmode.globalPublish) {
        await slashCommands.registerCommands()
    }
    for (var g of __botConfig.devmode.testGuildID) {
        await slashCommands.registerCommands(g)
    }

    serviceWorkers.exec()
    slashCommands.exec()
    client.user.setPresence(__botConfig.presence)
    childLogger.info('Ready to go.')
})