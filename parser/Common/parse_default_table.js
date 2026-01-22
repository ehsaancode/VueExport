var object;

async function parseDefaultTable(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultTable,
    getDefaultValue,
    getDefaultObject
}