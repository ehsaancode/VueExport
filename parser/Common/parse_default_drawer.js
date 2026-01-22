var object;

async function parseDefaultDrawer(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultDrawer,
    getDefaultValue,
    getDefaultObject
}