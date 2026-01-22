var imageTypeList = [];

async function parseDefaultImage(jsonObject) {
    //console.log('parseDefaultImage: ', jsonObject);
    imageTypeList.push(jsonObject);
    //console.log('images type list: ', imageTypeList);
    
    // await getImageDefaultValue('QImageNetwork', 'borderColor');
}

async function getDefaultValue(type, key) {
    imageTypeList.forEach(element => {
        if (element['type'] == type) {
            //  console.log('getTextDefaultValue: ', element['type'], element[key]);
            return element[key];
        }
    });
}

async function getDefaultObject(type) {
    imageTypeList.forEach(element => {
        if (element['type'] == type) {
            //  console.log('getTextDefaultValue: ', element['type'], element[key]);
            return element;
        }
    });
    return {}; // ✅ Ensure it always returns an object instead of undefined
}


module.exports = {
    parseDefaultImage,
    getDefaultValue,
    getDefaultObject
}