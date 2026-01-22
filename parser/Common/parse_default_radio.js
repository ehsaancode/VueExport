var object;

async function parseDefaultRadio(jsonObject) {
    object = jsonObject;

    //await getRadioDefaultValue('size')
}

async function getDefaultValue(key) {
    //console.log('getRadioDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
    parseDefaultRadio,
    getDefaultValue,
    getDefaultObject
}