
var buttonList = [];

//var height, width, text, color, bgColor, fontSize, fontWeight, fontStyle, textAlign, overflow, paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight;

async function parseDefaultButton(jsonObject) {
    //console.log('parseDefaultText: ', jsonObject);
    buttonList = jsonObject['webdesign_Designs'] ?? [];

   // objectButtonValue('QButton', 'button_text', 'height');
}

async function objectButtonValue(type, key) { //design,
    for (const index in buttonList) {
        let buttonObj = buttonList[index];
        if (buttonObj['design'] == type) {
            return buttonObj[key];
        }
   }
}

async function getDefaultObject(type) {
    for (const index in buttonList) {
        let buttonObj = buttonList[index];
        if (buttonObj['design'] == type) {
            return buttonObj;
        }
   }
   return {}; // ✅ Ensure it always returns an object instead of undefined
}

module.exports = {
    parseDefaultButton,
    objectButtonValue,
    getDefaultObject
}