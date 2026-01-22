var object;

async function parseDefaultDiv(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultDiv,
    getDefaultValue,
    getDefaultObject
}