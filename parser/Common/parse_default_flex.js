var object;

async function parseDefaultFlex(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultFlex,
    getDefaultValue,
    getDefaultObject
}