var object;

async function parseDefaultVideo(jsonObject) {
    object = jsonObject;
}

async function getDefaultValue(key) {
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
    parseDefaultVideo,
    getDefaultValue,
    getDefaultObject
}