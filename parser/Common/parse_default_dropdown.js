var object;

async function parseDefaultDropdown(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object != undefined ? object[key] : "";
}

async function getDefaultObject() {
    return object ?? "";
}

module.exports = {
     parseDefaultDropdown,
     getDefaultValue,
     getDefaultObject
}