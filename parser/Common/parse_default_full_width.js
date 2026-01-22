var object;

async function parseDefaultFullWidth(jsonObject) {
    object = jsonObject;
    //console.log('parseDefaultFullWidth: ', jsonObject );
    //getFullWidthDefaultValue('height') //check if this is working or not
}

async function getDefaultValue(key) {
    // console.log('getFullWidthDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
    parseDefaultFullWidth,
    getDefaultValue,
    getDefaultObject
}