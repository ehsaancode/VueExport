var object;

async function parseDefaultBottomMenu(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
     parseDefaultBottomMenu,
     getDefaultValue,
     getDefaultObject
}