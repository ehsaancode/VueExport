var object;

async function parseDefaultIncrementCounter(jsonObject) {
    object = jsonObject;

    //await getDefaultValue('size')
}

async function getDefaultValue(key) {
    //console.log('getIncrementCounterDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('geIncrementCounterDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
    parseDefaultIncrementCounter,
    getDefaultValue,
    getDefaultObject
}