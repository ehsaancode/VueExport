var object;

async function parseDefaultStack(jsonObject) {
    //console.log('parseDefaultStack: ', jsonObject);
    object = jsonObject;

    // await getStackDefaultValue('text');
}

async function getDefaultValue(key) {
    // console.log('getStackDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
    parseDefaultStack,
    getDefaultValue,
    getDefaultObject
}