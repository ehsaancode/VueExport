var object;

async function parseDefaultAccordion(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultAccordion,
    getDefaultValue,
    getDefaultObject
}