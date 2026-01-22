var object;

async function parseDefaultMarquee(jsonObject) {
    object = jsonObject;
    //console.log('parseDefaultFullWidth: ', jsonObject );
}

async function getDefaultValue(key) {
    // console.log('Get Default Marquee Value: ', key+ ' : '+ object[key]);
    return object[key];
}

async function getDefaultObject() {
    // console.log('Get Default Marquee Object: ', object);
    return object;
}

module.exports = {
    parseDefaultMarquee,
    getDefaultValue,
    getDefaultObject
}