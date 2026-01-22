var object;

async function parseDefaultTablePaginationInfo(jsonObject) {
    object = jsonObject;

    // await getSwitchDefaultValue('barRadius')
}

async function getDefaultValue(key) {
    // console.log('getSwitchDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    return object;
}

module.exports = {
     parseDefaultTablePaginationInfo,
     getDefaultValue,
     getDefaultObject
}