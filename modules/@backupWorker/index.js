const childLogger = logger.child({ module: 'backupWorker' })

childLogger.debug('Backup enabled.')

const dataFolder = `${__dataDir}`
const logsFolder = `${__rootDir}/data/logs`
const dataZipFile = `${__rootDir}/data/@backup/@data_backup.zip`
const logsZipFile = `${__rootDir}/data/@backup/logs_backup.zip`
const backupFolder = `${__rootDir}/data/@backup`
const zipFile = `${__rootDir}/data/.temp/bot_backup.zip`

const { zip } = require('zip-a-folder')
const { fetchChannel } = globalTools

const { Client, MessageAttachment } = require('discord.js')

const client = new Client()

client.login(process.env.DISCORD_BOT_TOKEN).catch(e => {
    childLogger.error(e)
})

const exec = async () => {
    childLogger.debug('Backing up...')
    try {
        await zip(dataFolder, dataZipFile)
        await zip(logsFolder, logsZipFile)
        await zip(backupFolder, zipFile)

        const target = await fetchChannel(client, __botConfig.devmode.backup.to.channelID)

        const backupFile = new MessageAttachment(zipFile, `bot_backup.zip`)

        target.send(`${Date()}`, backupFile)
    } catch (e) {
        childLogger.error(e)
    }
    childLogger.debug(`Backup complete`)
}

client.on('ready', async () => {
    childLogger.info(`Backup active. Interval: ${__botConfig.devmode.backup.interval}ms`)
    setInterval(exec, __botConfig.devmode.backup.interval)
})