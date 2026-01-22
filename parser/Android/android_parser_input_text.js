const readWriteFile = require('../../utility/read_write_file');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');

async function parseInputText(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
    //todo()
    //let getDefaultObject = await commonDefault.getDefaultObject(jsonObjects['type']);
    let frame = await commonUtilsAndroid.componentFrame(jsonObjects, {}, parentWidth, parentHeight, true, true);

    let paddingProps = await commonUtilsAndroid.extractPadding(jsonObjects, {});
    let marginProps = await commonUtilsAndroid.extractMargin(jsonObjects, {});
    // Extract border properties
    let borderProperties = await commonUtilsAndroid.extractBorderProperties(jsonObjects);

    if (parentType == "QStack") {
        await readWriteFile.writeToFile(fileName,
            ' '.repeat(startingColum) + `Box(\n` +
            ' '.repeat(startingColum + 1) + `modifier = Modifier.fillMaxSize()\n` +
            ' '.repeat(startingColum + 1) + `.padding(start = ${parseFloat(jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(jsonObjects['positionedBottom'] ?? 0)}.dp)\n` +
            ' '.repeat(startingColum + 1) + `) { \n`
        );
    }

    await readWriteFile.writeToFile(fileName,
        ' '.repeat(startingColum) + 'QInputText( \n' +
        ' '.repeat(startingColum + 1) + `${frame} \n` +
        ' '.repeat(startingColum + 1) + `backgroundColor = "${jsonObjects?.["bgColor"] ?? "#00FFFFFF"}",\n` +
        ' '.repeat(startingColum + 1) + `textColor = \"${jsonObjects?.['color'] ?? "#FF000000"}\", \n` +
        ' '.repeat(startingColum + 1) + `fontFamily = \"${jsonObjects?.['fontFamily'] || "Arial"}\", \n` +
        ' '.repeat(startingColum + 1) + `placeholder = "${jsonObjects['text']}", \n` +
        ' '.repeat(startingColum + 1) + `value = textFieldStates["${jsonObjects['text']}"] ?: "", \n` +
        ' '.repeat(startingColum + 1) + `onValueChange = {\n ${' '.repeat(startingColum + 1)}textFieldStates["${jsonObjects['text']}"] = it \n ${' '.repeat(startingColum)}}, \n` +
        //Padding
        Object.entries(paddingProps).map(([key, value]) =>
            ' '.repeat(startingColum + 1) + `${key} = ${value}, \n`
        ).join("") +
        //Margin
        Object.entries(marginProps).map(([key, value]) =>
            ' '.repeat(startingColum + 1) + `${key} = ${value}, \n`
        ).join("") +
        //Border
        Object.entries(borderProperties).map(([key, value]) =>
            ' '.repeat(startingColum + 1) + `${key} = "${value}", \n`
        ).join('') +
        ' '.repeat(startingColum) + ')\n'
    )

    if (parentType == "QStack") {
        await readWriteFile.writeToFile(fileName,
            ' '.repeat(startingColum) + `}\n`
        );
    }
}

module.exports = {
    parseInputText
}