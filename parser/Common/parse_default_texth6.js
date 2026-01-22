// const defaultContent = require('./parse_default_content');

var textTypeList = [];

//var height, width, text, color, bgColor, fontSize, fontWeight, fontStyle, textAlign, overflow, paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight;


async function parseDefaultText(jsonObjects) {
    textTypeList.push(jsonObjects);
}

async function getDefaultValue(type, key) {
   
        try {
        for (const index in textTypeList) {
            var jsonObj = textTypeList[index];
           
            if (jsonObj['type'] == type) {
                if(jsonObj['type'] == "QTextH6"){
               
                }
                return jsonObj[key];
            }
        }
    } catch (err) {
        console.error(err);
        return '';
    }
}

async function getDefaultObject(type) {
    try {
        for (const index in textTypeList) {
            var jsonObj = textTypeList[index];
            if (jsonObj['type'] == type) {
                return jsonObj ?? "";
            }
        }
    } catch (err) {
        console.error(err);
        return '';
    }
}

module.exports = {
    parseDefaultText,
    getDefaultValue,
    getDefaultObject
}