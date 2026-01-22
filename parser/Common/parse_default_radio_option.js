var object;

async function parseDefaultRadioOption(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object != undefined ? object[key] : "";
}

async function getDefaultObject() {
    return object ?? "";
}

module.exports = {
     parseDefaultRadioOption,
     getDefaultValue,
     getDefaultObject
}