var object;

async function parseDefaultCheckBox(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultCheckBox,
    getDefaultValue,
    getDefaultObject
}