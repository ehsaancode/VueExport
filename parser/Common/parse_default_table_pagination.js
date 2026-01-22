var object;

async function parseDefaultTablePagination(jsonObject) {
    object = jsonObject;

    // await getSwitchDefaultValue('barRadius')
}

async function getDefaultValue(key) {
    // console.log('getSwitchDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
     parseDefaultTablePagination,
     getDefaultValue,
     getDefaultObject
}