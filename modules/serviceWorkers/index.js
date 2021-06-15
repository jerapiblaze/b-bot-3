const services = globalTools.index(`${__myModules}/serviceWorkers/services`, '*')

var client = null
const setClient = async (input_client) => {
    client = input_client
}

const exec = () => {
    for (var service of Object.values(services)){
        if (!service) continue
        if (service.disabled) continue
        client.on(service.config.eventName, service.exec)
    }
}

module.exports = {
    setClient,
    exec
}