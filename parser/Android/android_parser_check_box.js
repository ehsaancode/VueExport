const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');

async function parseCheckBox(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
    let frame = await commonUtilsAndroid.componentFrame(jsonObjects, {}, parentWidth, parentHeight, true, true);
    let paddingProps = await commonUtilsAndroid.extractPadding(jsonObjects, {});
    let marginProps = await commonUtilsAndroid.extractMargin(jsonObjects, {});

    const optionsArray = jsonObjects["options"];  // Extract the array
    const optionsString = optionsArray.map(option => `"${option}"`).join(", "); 

    if(parentType == "QStack"){
        await readWriteFile.writeToFile(fileName, 
            ' '.repeat(startingColum) + `Box(\n`+
            ' '.repeat(startingColum+1) + `modifier = Modifier.fillMaxSize()\n`+
            ' '.repeat(startingColum+1) + `.padding(start = ${parseFloat(jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(jsonObjects['positionedBottom'] ?? 0)}.dp)\n`+
            ' '.repeat(startingColum+1) + `) { \n`
        );
    }

    await readWriteFile.writeToFile(fileName,
        ' '.repeat(startingColum) + 'QCheckBox( \n' +
        ' '.repeat(startingColum + 1) + `${frame} \n` +
        ' '.repeat(startingColum + 1) + `options = listOf(${optionsString}), \n` +
        ' '.repeat(startingColum + 1) + `selectedOptions = textFieldStates["${jsonObjects['text']}"]?.split(",") ?: emptyList(), \n` +
        ' '.repeat(startingColum + 1) + `onOptionSelected = { selectedList ->\n ${' '.repeat(startingColum + 1)}textFieldStates["${jsonObjects['text']}"] = selectedList.joinToString(",") \n ${' '.repeat(startingColum)}}, \n` +
        ' '.repeat(startingColum + 1) + `fontSize = "${jsonObjects?.['fontSize'] ?? '0px'}",\n`+
        ' '.repeat(startingColum + 1) + `size = "${jsonObjects?.['size'] ?? '0'}",\n`+
        ' '.repeat(startingColum + 1) + `checkedColor = "${jsonObjects?.['activeColor'] ?? '#FF000000'}",\n`+
        ' '.repeat(startingColum + 1) + `uncheckedColor = "${jsonObjects?.['inActiveColor'] ?? '#FFB0BEC5'}",\n`+
        //Padding
        Object.entries(paddingProps).map(([key, value]) => 
            ' '.repeat(startingColum + 1) + `${key} = ${value}, \n`
        ).join("") +
        //Margin
        Object.entries(marginProps).map(([key, value]) => 
            ' '.repeat(startingColum + 1) + `${key} = ${value}, \n`
        ).join("") +
        await commonUtilsAndroid.handleOnClickNavigation(jsonObjects, startingColum) +
        ' '.repeat(startingColum) + ')\n'
    )

    if(parentType == "QStack"){
        await readWriteFile.writeToFile(fileName, 
            ' '.repeat(startingColum) + `}\n`
        );
    }
}

module.exports = {
    parseCheckBox
}