var object;

async function parseDefaultSpan(jsonObject) {
    //console.log('parseDefaultSpan: ', jsonObject);
    object = jsonObject;

    // await getSpanDefaultValue('text');
}

async function getDefaultValue(key) {
    // console.log('getSpanDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
    parseDefaultSpan,
    getDefaultValue,
    getDefaultObject
}