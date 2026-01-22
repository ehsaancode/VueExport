var object;

async function parseDefaultMap(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultMap,
    getDefaultValue,
    getDefaultObject
}