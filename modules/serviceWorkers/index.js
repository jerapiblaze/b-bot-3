global.services = globalTools.index(`${__myModules}/serviceWorkers/services`, '*')
const childLogger = logger.child({ module: 'services' })

var client = null
const setClient = async (input_client) => {
    client = input_client
}

const exec = () => {
    for (var service of Object.values(services)) {
        if (!service) continue
        if (service.config.disabled) continue
        try {
            client.on(service.config.eventName, service.exec)
        } catch (e) {
            childLogger.error(e)
        }
    }
}

module.exports = {
    setClient,
    exec
}