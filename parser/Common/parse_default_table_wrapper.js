var object;

async function parseDefaultTableWrapper(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultTableWrapper,
    getDefaultValue,
    getDefaultObject
}