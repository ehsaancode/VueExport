const readWriteFile = require('../../utility/read_write_file');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_image');

async function parseBlockImage(startingColum, fileName, jsonObjects, parentType) {
     // let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
     // const mainCanvasObject = require(mainCanvasJsonFile);

     // let  getDefaultObject = await commonDefault.getDefaultObject(jsonObjects['type']);
     // let frame = await commonUtilsAndroid.componentFrame(jsonObjects, getDefaultObject, parentWidth, parentHeight, true, true);

     // let paddingProps = await commonUtilsAndroid.extractPadding(jsonObjects, getDefaultObject);
     // let marginProps = await commonUtilsAndroid.extractMargin(jsonObjects, getDefaultObject);
     // let borderProperties = await commonUtilsAndroid.extractBorderProperties(jsonObjects);

     const widgetStyle = await jsonObjects?.widgetDefaultData?.style ?? {};
     let calculateHeightWidth = await commonUtilsAndroid.componentDimension(widgetStyle);
     let calculatePadding = await commonUtilsAndroid.componentPadding(widgetStyle);
     let calculateMargin = await commonUtilsAndroid.componentMargin(widgetStyle);
     let bgColorProperties = await commonUtilsAndroid.componentBackgroundColor(widgetStyle);
     let borderProperties = await commonUtilsAndroid.componentBorder(widgetStyle);

     if (parentType == "QStack") {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `Box(\n` +
               ' '.repeat(startingColum + 1) + `modifier = Modifier.fillMaxSize()\n` +
               ' '.repeat(startingColum + 1) + `.padding(start = ${parseFloat(jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(jsonObjects['positionedBottom'] ?? 0)}.dp)\n` +
               ' '.repeat(startingColum + 1) + `) { \n`
          );
     }

     let output = '';
     //height & width properties
     output += calculateHeightWidth['height'] !== ''
          ? ' '.repeat(startingColum + 4) + `height = ${calculateHeightWidth['height']},\n` : '';
     output += calculateHeightWidth['width'] !== ''
          ? ' '.repeat(startingColum + 4) + `width = ${calculateHeightWidth['width']},\n` : '';

     //padding properties
     output += calculatePadding['top'] !== ''
          ? ' '.repeat(startingColum + 4) + `paddingTop = "${calculatePadding['top']}",\n` : '';
     output += calculatePadding['bottom'] !== ''
          ? ' '.repeat(startingColum + 4) + `paddingBottom = "${calculatePadding['bottom']}",\n` : '';
     output += calculatePadding['right'] !== ''
          ? ' '.repeat(startingColum + 4) + `paddingEnd = "${calculatePadding['right']}",\n` : '';
     output += calculatePadding['left'] !== ''
          ? ' '.repeat(startingColum + 4) + `paddingStart = "${calculatePadding['left']}",\n` : '';

     //margin properties
     output += calculateMargin['top'] !== ''
          ? ' '.repeat(startingColum + 4) + `marginTop = "${calculateMargin['top']}",\n` : '';
     output += calculateMargin['bottom'] !== ''
          ? ' '.repeat(startingColum + 4) + `marginBottom = "${calculateMargin['bottom']}",\n` : '';
     output += calculateMargin['left'] !== ''
          ? ' '.repeat(startingColum + 4) + `marginStart = "${calculateMargin['left']}",\n` : '';
     output += calculateMargin['right'] !== ''
          ? ' '.repeat(startingColum + 4) + `marginEnd = "${calculateMargin['right']}",\n` : '';

     //bg color properties
     output += bgColorProperties['bgType'] !== ''
          ? ' '.repeat(startingColum + 4) + `bgType = "${bgColorProperties['bgType']}",\n` : '';
     output += bgColorProperties['bgType'] === 'solid' && bgColorProperties['bgColor'] !== ''
          ? ' '.repeat(startingColum + 4) + `bgColor = "${bgColorProperties['bgColor']}",\n` : '';
     output += bgColorProperties['bgType'] === 'linear' && bgColorProperties['linearGradientAngle'] !== ''
          ? ' '.repeat(startingColum + 4) + `linearGradientAngle = "${bgColorProperties['linearGradientAngle']}",\n` : '';
     output += bgColorProperties['bgType'] === 'radial' && bgColorProperties['radialGradientShape'] !== ''
          ? ' '.repeat(startingColum + 4) + `radialGradientShape = "${bgColorProperties['radialGradientShape']}",\n` : '';
     output += bgColorProperties['bgType'] === 'radial' || bgColorProperties['bgType'] === 'linear' && bgColorProperties['gradientColorList'] !== 'listOf()'
          ? ' '.repeat(startingColum + 4) + `gradientColorList = ${bgColorProperties['gradientColorList']},\n` : '';
     output += bgColorProperties['bgType'] === 'media' && bgColorProperties['bgUrl'] !== ''
          ? ' '.repeat(startingColum + 4) + `bgUrl = "${bgColorProperties['bgUrl']}",\n` : '';
     output += bgColorProperties['bgType'] === 'media' && bgColorProperties['imageFit'] !== ''
          ? ' '.repeat(startingColum + 4) + `imageFit = ${bgColorProperties['imageFit']},\n` : '';

     //border properties
     output += borderProperties['borderTC'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderTC = "${borderProperties['borderTC']}",\n` : '';
     output += borderProperties['borderBC'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderBC = "${borderProperties['borderBC']}",\n` : '';
     output += borderProperties['borderLC'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderLC = "${borderProperties['borderLC']}",\n` : '';
     output += borderProperties['borderRC'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderRC = "${borderProperties['borderRC']}",\n` : '';

     output += borderProperties['borderTW'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderTW = "${borderProperties['borderTW']}",\n` : '';
     output += borderProperties['borderBW'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderBW = "${borderProperties['borderBW']}",\n` : '';
     output += borderProperties['borderLW'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderLW = "${borderProperties['borderLW']}",\n` : '';
     output += borderProperties['borderRW'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderRW = "${borderProperties['borderRW']}",\n` : '';

     output += borderProperties['borderTLR'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderTLR = "${borderProperties['borderTLR']}",\n` : '';
     output += borderProperties['borderTRR'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderTRR = "${borderProperties['borderTRR']}",\n` : '';
     output += borderProperties['borderBLR'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderBLR = "${borderProperties['borderBLR']}",\n` : '';
     output += borderProperties['borderBRR'] !== ''
          ? ' '.repeat(startingColum + 4) + `borderBRR = "${borderProperties['borderBRR']}",\n` : '';

     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + '{ parentWidth, parentHeight ->\n' +
          ' '.repeat(startingColum + 2) + 'QImageNetwork( \n' +
          output +

          /*' '.repeat(this.startingColum + 1) + `${frame} \n` +
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
               ' '.repeat(startingColum + 1) +`${key} = "${value}", \n`
          ).join('') +
          ' '.repeat(startingColum + 1) + `bgUrl = "${jsonObjects['url'] ?? ""}", \n` +
          ' '.repeat(startingColum + 1) + `bgColor = "${jsonObjects?.['bgColor'] ?? '#00000000'}", \n` +
          ' '.repeat(startingColum + 1) + `imageFit = ${await commonUtilsAndroid.getImageFit(jsonObjects, getDefaultObject)}, \n` +
          await commonUtilsAndroid.handleOnClickNavigation(jsonObjects, startingColum) +*/
          ' '.repeat(startingColum + 2) + ')\n' +
          ' '.repeat(startingColum) + '},\n'
     )

     if (parentType == "QStack") {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `}\n`
          );
     }
}

module.exports = {
     parseBlockImage
}