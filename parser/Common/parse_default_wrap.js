var object;

async function parseDefaultWrap(jsonObject) {
    //console.log('parseDefaultWrap: ', jsonObject);
    object = jsonObject;
}

async function getDefaultValue(key) {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}


module.exports = {
    parseDefaultWrap,
    getDefaultValue,
    getDefaultObject
}