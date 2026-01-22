const readWriteFile = require('../../utility/read_write_file');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_image');

async function parseBlockIcon(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
     let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
     const mainCanvasObject = require(mainCanvasJsonFile);

     let getDefaultObject = await commonDefault.getDefaultObject(jsonObjects['type']);
     let frame = await commonUtilsAndroid.componentFrame(jsonObjects, getDefaultObject, parentWidth, parentHeight, true, true);

     let paddingProps = await commonUtilsAndroid.extractPadding(jsonObjects, getDefaultObject);
     let marginProps = await commonUtilsAndroid.extractMargin(jsonObjects, getDefaultObject);
     // Extract border properties
     let borderProperties = await commonUtilsAndroid.extractBorderProperties(jsonObjects);

     // console.log("parent type in image :", parentType)

     if (parentType == "QStack") {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `Box(\n` +
               ' '.repeat(startingColum + 1) + `modifier = Modifier.fillMaxSize()\n` +
               ' '.repeat(startingColum + 1) + `.padding(start = ${parseFloat(jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(jsonObjects['positionedBottom'] ?? 0)}.dp)\n` +
               ' '.repeat(startingColum + 1) + `) { \n`
          );
     }

     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + 'QIcon( \n' +
          ' '.repeat(this.startingColum + 1) + `${frame} \n` +
          await commonUtilsAndroid.getFormattedAnimationsData(jsonObjects["id"], jsonObjects?.["AnimationsData"], startingColum) +
          // Padding
          Object.entries(paddingProps).map(([key, value]) =>
               ' '.repeat(this.startingColum + 1) + `${key} = ${value}, \n`
          ).join("") +
          // Margin
          Object.entries(marginProps).map(([key, value]) =>
               ' '.repeat(this.startingColum + 1) + `${key} = ${value}, \n`
          ).join("") +
          // Border
          Object.entries(borderProperties).map(([key, value]) =>
               ' '.repeat(startingColum + 1) + `${key} = "${value}", \n`
          ).join('') +
          ' '.repeat(startingColum + 1) + `bgUrl = "${jsonObjects['iconLink'] ?? ""}", \n` +
          ' '.repeat(startingColum + 1) + `bgColor = "${jsonObjects?.['bgColor'] ?? '#00000000'}", \n` +
          ' '.repeat(startingColum + 1) + `imageFit = ${await commonUtilsAndroid.getImageFit(jsonObjects, getDefaultObject)}, \n` +
          ' '.repeat(startingColum + 1) + `taggedKey = "${jsonObjects['taggedKey'] ?? ""}", \n` +
          await commonUtilsAndroid.handleOnClickNavigation(jsonObjects, startingColum) +
          ' '.repeat(startingColum) + ')\n'
     )

     if (parentType == "QStack") {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `}\n`
          );
     }
}

module.exports = {
     parseBlockIcon
}