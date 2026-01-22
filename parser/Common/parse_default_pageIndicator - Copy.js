var object;

async function parseDefaultPageIndicator(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultPageIndicator,
    getDefaultValue,
    getDefaultObject
}