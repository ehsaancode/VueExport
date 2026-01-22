var object;

async function parseDefaultMainCanvas(jsonObject) {
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
    parseDefaultMainCanvas,
    getDefaultValue,
    getDefaultObject
}