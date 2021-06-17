const metadata = {
    name: `findObjArray`,
    description: `find an object in an array`,
    version: `1.0.0`,
    author: `jerapiblaze`,
}

const exec = (key, value, array) => {
    for (var e of array){
        if (e[key] === value){
            return e[key]
        }
    }
    return null
}

module.exports = {
    metadata,
    exec
}