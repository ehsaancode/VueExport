var object = {};

async function parseDefaultTextarea(jsonObject) {
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
     parseDefaultTextarea,
     getDefaultValue,
     getDefaultObject
}