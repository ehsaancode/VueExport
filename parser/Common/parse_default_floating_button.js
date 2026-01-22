var object;

async function parseDefaultFloatingButton(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultFloatingButton,
    getDefaultValue,
    getDefaultObject
}