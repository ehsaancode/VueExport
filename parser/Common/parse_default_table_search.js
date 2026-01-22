var object;

async function parseDefaultTableSearch(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultTableSearch,
    getDefaultValue,
    getDefaultObject
}