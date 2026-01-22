var textTypeList = [];

async function parseDefaultText(jsonObjects) {
    textTypeList.push(jsonObjects);
}

async function getDefaultValue(type, key) {
    try {
        for (const index in textTypeList) {
            var jsonObj = textTypeList[index];
            if (jsonObj['type'] == type) {
                return jsonObj[key];
            }
        }
    } catch (err) {
        console.error(err);
        return {};
    }
}

async function getDefaultObject(type) {
    try {
        for (const index in textTypeList) {
            var jsonObj = textTypeList[index];
            if (jsonObj['type'] == type) {
                return jsonObj;
            }
        }
    } catch (err) {
        console.error(err);
        return {};
    }
}

module.exports = {
    parseDefaultText,
    getDefaultValue,
    getDefaultObject
}