var object;

async function parseDefaultDropdown(jsonObject) {
    object = jsonObject;

    //await getDropdownDefaultValue('showDropdownSearch')
}

async function getDefaultValue(key) {
    //console.log('getDropdownDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: ', key+ ' : '+ object[key]);
    return object;
}

module.exports = {
    parseDefaultDropdown,
    getDefaultValue,
    getDefaultObject
}