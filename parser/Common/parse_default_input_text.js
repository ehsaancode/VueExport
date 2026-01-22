var object = {};

async function parseDefaultInputText(jsonObject) {
    //console.log('parseDefaultRow: ', jsonObject);
    object = jsonObject;
}

async function getDefaultValue(key) {
    // console.log('parseDefaultRow: ', key);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
     parseDefaultInputText,
     getDefaultValue,
     getDefaultObject
}