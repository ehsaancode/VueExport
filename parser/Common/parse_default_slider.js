var object;

async function parseDefaultSlider(jsonObject) {
    //console.log('parseDefaultSlider: ', jsonObject);
    object = jsonObject;

    //await getSliderDefaultValue('text');
}

async function getDefaultValue(key) {
    //console.log('getSliderDefaultValue: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('getWrapDefaultValue: '+ object["type"]);
    return object;
}

module.exports = {
    parseDefaultSlider,
    getDefaultValue,
    getDefaultObject
}
