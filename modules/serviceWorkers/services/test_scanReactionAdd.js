const metadata = {
    name: 'scanMessage',
    description: 'log message text content to console',
    version: `1.0.0`,
    author: `jerapiblaze`
}
const config = {
    eventName: `messageReactionAdd`,
    disabled: true
}

const exec = (reaction, user) => {
    console.log(`[reactionAdd_scanner](${reaction.message.channel.id}_${reaction.message.id}) $ ${user.id} ${reaction.emoji.name.toString()}`)
}

module.exports = {
    metadata,
    config,
    exec
}