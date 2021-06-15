const metadata = {
    name: 'scanMessage',
    description: 'log message text content to console',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `message`,
    disabled: false
}

const exec = (message) => {
    console.log(`[message_scanner](${message.channel.id}_${message.id}) $ ${message.content}`)
}

module.exports = {
    metadata,
    config,
    exec
}