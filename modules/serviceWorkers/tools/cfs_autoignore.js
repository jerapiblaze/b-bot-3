const metadata = {
    name: `autoIgnore`,
    description: `convert any message to embed`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const exec = (message, dicsList) => {
    if (!ignoreDictionary) return {
        verify: false,
        word: null
    }
    if (!dicsList) return {
        verify: false,
        word: null
    }

    var dictionary = []
    
    // import dictionary
    for (let dic of dicsList){
        dic = dic.split('_')
        if (!ignoreDictionary[dic[0]]) continue
        if (!ignoreDictionary[dic[0]][dic[1]]) continue
        dictionary = Array.prototype.concat(dictionary, ignoreDictionary[dic[0]][dic[1]])
    }

    // checks here
    const parsedContent = JSON.stringify(message).replaceAll('_', ' ').replaceAll('-', ' ')

    for (let w of dictionary) {
        const word = w.toString().toLowerCase().trim()
        if (parsedContent.search(new RegExp(`(\\W(${word})\\W)|(_${word}_)`, 'g', 'm', 'u')) === -1) continue
        return {
            verify: true,
            word: word
        }
    }
    return {
        verify: false,
        word: null
    }
}

module.exports = {
    metadata,
    exec
}