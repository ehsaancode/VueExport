var object;

async function parseDefaultCheckBox(jsonObject) {
    object = jsonObject;

    //await getCheckBoxDefaultValue('size')
}

async function getDefaultValue(key) {
    //console.log('getCheckBoxDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    return object ?? "";
}

module.exports = {
    parseDefaultCheckBox,
    getDefaultValue,
    getDefaultObject
}