var object;

async function parseDefaultHeaderBar(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultHeaderBar,
    getDefaultValue,
    getDefaultObject
}