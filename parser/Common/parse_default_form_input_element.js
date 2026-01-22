var object;

async function parseDefaultFormInputElement(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object != undefined ? object[key] : "";
}

async function getDefaultObject() {
    return object ?? "";
}

module.exports = {
     parseDefaultFormInputElement,
     getDefaultValue,
     getDefaultObject
}