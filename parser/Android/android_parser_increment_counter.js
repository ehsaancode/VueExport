const readWriteFile = require('../../utility/read_write_file');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_increment_counter');

async function parseIncrementCounter(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
    
    let getDefaultObject = commonDefault.getDefaultObject();
    let frame = await commonUtilsAndroid.componentFrame(jsonObjects, getDefaultObject, parentWidth, parentHeight, true, true);

    if(parentType == "QStack"){
        await readWriteFile.writeToFile(fileName, 
            ' '.repeat(startingColum) + `Box(\n`+
            ' '.repeat(startingColum+1) + `modifier = Modifier.fillMaxSize()\n`+
            ' '.repeat(startingColum+1) + `.padding(start = ${parseFloat(jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(jsonObjects['positionedBottom'] ?? 0)}.dp)\n`+
            ' '.repeat(startingColum+1) + `) { \n`
        );
    }

    await readWriteFile.writeToFile(fileName,
        ' '.repeat(startingColum) + 'QIncrementCounter( \n' +
        ' '.repeat(startingColum + 1) + `${frame} \n` +
        ' '.repeat(startingColum + 1) + `startValue = "${jsonObjects?.['startValue'] ?? "0"}", \n` +
        ' '.repeat(startingColum + 1) + `endValue = "${jsonObjects?.['endValue'] ?? "0"}", \n` +
        ' '.repeat(startingColum + 1) + `counterSpeed = "${jsonObjects?.['counterSpeed'] ?? "slow"}", \n` +
        //(await commonUtilsAndroid.getPropertyValue(jsonObjects, "fontWeight", getDefaultObject) !== null ?
        // ' '.repeat(startingColum + 1) + `fontWeight = FontWeight.W${await commonUtilsAndroid.getPropertyValue(jsonObjects, "fontWeight", getDefaultObject)}, \n` : ' '.repeat(startingColum + 1) +`fontWeight = FontWeight.W400, \n`)+
        ' '.repeat(startingColum + 1) + `fontWeight = FontWeight.W${jsonObjects?.['fontWeight'] ?? /*await commonDefault.getDefaultValue('fontWeight') ??*/ '600'},\n`+
        ' '.repeat(startingColum + 1) + `fontSize = "${jsonObjects?.['fontSize'] ?? /*await commonDefault.getDefaultValue('fontSize') ??*/ '20px'}",\n`+
        ' '.repeat(startingColum + 1) + `color = "${jsonObjects?.['color'] ?? /*await commonDefault.getDefaultValue('color') ?? */'#FFFFFFFF'}",\n`+
        ' '.repeat(startingColum + 1) + `bgColor = "${jsonObjects?.['bgColor'] ?? /*await commonDefault.getDefaultValue('bgColor') ?? */'#00000000'}",\n`+
        // (await commonUtilsAndroid.getPropertyValue(jsonObjects, "fontSize", getDefaultObject) !== null ?
        // ' '.repeat(startingColum + 1) + `fontSize = "${await commonUtilsAndroid.getPropertyValue(jsonObjects, "fontSize", getDefaultObject)}", \n` : ' '.repeat(startingColum + 1) +`fontSize = "20px", \n`)+
        // (await commonUtilsAndroid.getPropertyValue(jsonObjects, "color", getDefaultObject) !== null ?
        // ' '.repeat(startingColum + 1) + `color = "${await commonUtilsAndroid.getPropertyValue(jsonObjects, "color", getDefaultObject)}", \n` : ' '.repeat(startingColum + 1) +`color = "#FFFFFFFF", \n`)+
        // (await commonUtilsAndroid.getPropertyValue(jsonObjects, "bgColor", getDefaultObject) !== null ?
        // ' '.repeat(startingColum + 1) + `bgColor = "${await commonUtilsAndroid.getPropertyValue(jsonObjects, "bgColor", getDefaultObject)}", \n` : ' '.repeat(startingColum + 1) +`bgColor = "#FF000000", \n`)+                       
        ' '.repeat(startingColum) + ')\n'
    )

    if(parentType == "QStack"){
        await readWriteFile.writeToFile(fileName, 
            ' '.repeat(startingColum) + `}\n`
        );
    }
}

module.exports = {
    parseIncrementCounter
}