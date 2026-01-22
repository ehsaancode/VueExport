var object;

async function parseDefaultForm(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object != undefined ? object[key] : "";
}

async function getDefaultObject() {
    return object ?? "";
}

module.exports = {
     parseDefaultForm,
     getDefaultValue,
     getDefaultObject
}