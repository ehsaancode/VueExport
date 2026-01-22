var object;

async function parseDefaultInputSearch(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultInputSearch,
    getDefaultValue,
    getDefaultObject
}