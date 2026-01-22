const readWriteFile = require('../../utility/read_write_file');
const defaultText = require('../Common/parse_default_text');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_text');
const parserSlugPage = require('./android_parser_slug_page');

async function parseBlockText(startingColum, fileName, jsonObjects, parentType) {
     const widgetStyle = await jsonObjects?.widgetDefaultData?.style ?? {}
     let calculateHeightWidth = await commonUtilsAndroid.componentDimension(widgetStyle);
     let calculatePadding = await commonUtilsAndroid.componentPadding(widgetStyle);
     let calculateMargin = await commonUtilsAndroid.componentMargin(widgetStyle);
     let bgColorProperties = await commonUtilsAndroid.componentBackgroundColor(widgetStyle);
     let typographyProperties = await commonUtilsAndroid.componentTypography(widgetStyle);

     // let text = jsonObjects['text'];
     // let formattedText = await commonUtilsAndroid.formatText(text);

     // let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
     // const mainCanvasObject = require(mainCanvasJsonFile);

     // let getDefaultObject = await commonDefault.getDefaultObject(jsonObjects['type']);
     // let frame = await commonUtilsAndroid.componentFrame(jsonObjects, getDefaultObject, parentWidth, parentHeight, true, true);

     // let paddingProps = await commonUtilsAndroid.extractPadding(jsonObjects, getDefaultObject);
     // let marginProps = await commonUtilsAndroid.extractMargin(jsonObjects, getDefaultObject);

     // const onClickCode = await commonUtilsAndroid.handleOnClickNavigation(jsonObjects, startingColum, commonUtils, parserSlugPage);

     if (parentType == "QStack") {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `Box(\n` +
               ' '.repeat(startingColum + 1) + `modifier = Modifier.fillMaxSize()\n` +
               ' '.repeat(startingColum + 1) + `.padding(start = ${parseFloat(jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(jsonObjects['positionedBottom'] ?? 0)}.dp)\n` +
               ' '.repeat(startingColum + 1) + `) { \n`
          );
     }

     // console.log(`textAlign = ${typographyProperties['textAlign']}`);

     let output = '';
     //height & width properties
     output += calculateHeightWidth['height'] !== ''
          ? ' '.repeat(startingColum + 4) + `height = ${calculateHeightWidth['height']},\n` : '';
     output += calculateHeightWidth['width'] !== ''
          ? ' '.repeat(startingColum + 4) + `width = ${calculateHeightWidth['width']},\n` : '';

     //typography properties
     output += typographyProperties['text'] != ''
          ? ' '.repeat(startingColum + 4) + `text = "${typographyProperties['text']}",\n` : '';
     output += typographyProperties['fontFamily'] != ''
          ? ' '.repeat(startingColum + 4) + `fontFamily = "${typographyProperties['fontFamily']}",\n` : '';
     output += typographyProperties['fontWeight'] != ''
          ? ' '.repeat(startingColum + 4) + `fontWeight = FontWeight.W${typographyProperties['fontWeight']},\n` : '';
     output += typographyProperties['fontSize'] != ''
          ? ' '.repeat(startingColum + 4) + `fontSize = "${typographyProperties['fontSize']}",\n` : '';
     output += typographyProperties['textAlign'] != ''
          ? ' '.repeat(startingColum + 4) + `textAlign = ${typographyProperties['textAlign']},\n` : '';
     output += typographyProperties['fontStyle'] != ''
          ? ' '.repeat(startingColum + 4) + `fontStyle = ${typographyProperties['fontStyle']},\n` : '';
     output += typographyProperties['lineHeight'] != ''
          ? ' '.repeat(startingColum + 4) + `lineHeight = "${typographyProperties['lineHeight']}",\n` : '';
     output += typographyProperties['fontVariant'] != ''
          ? ' '.repeat(startingColum + 4) + `fontVariant = "${typographyProperties['fontVariant']}",\n` : '';
     output += typographyProperties['foregroundType'] === 'solid' && typographyProperties['solidColor'] != ''
          ? ' '.repeat(startingColum + 4) + `color = "${typographyProperties['solidColor']}",\n` : '';
     output += typographyProperties['foregroundType'] != ''
          ? ' '.repeat(startingColum + 4) + `foregroundType = "${typographyProperties['foregroundType']}",\n` : '';

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

     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + '{ parentWidth, parentHeight ->\n' +
          ' '.repeat(startingColum + 2) + 'QText( \n' +
          output +

          /*' '.repeat(startingColum + 1) + `${frame} \n` +
          // Padding
          Object.entries(paddingProps).map(([key, value]) =>
               ' '.repeat(startingColum + 1) + `${key} = ${value}, \n`
          ).join("") +
          // Margin
          Object.entries(marginProps).map(([key, value]) =>
               ' '.repeat(startingColum + 1) + `${key} = ${value}, \n`
          ).join("") +
          (jsonObjects?.["url"] != null && jsonObjects?.["url"] !== ""
               ? ' '.repeat(startingColum + 1) + `bgUrl = "${jsonObjects?.["url"]}",\n`
               : ' '.repeat(startingColum + 1) + `bgColor = "${jsonObjects?.["bgColor"] ?? "#00FFFFFF"}",\n`) +
          (jsonObjects?.["url"] != null && jsonObjects?.["url"] !== "" ?
               ' '.repeat(startingColum + 1) + `imageFit = ${await commonUtilsAndroid.getImageFit(this.jsonObjects, getDefaultObject)}, \n` : '') +
          await commonUtilsAndroid.getFormattedAnimationsData(jsonObjects["id"], jsonObjects?.["AnimationsData"], startingColum) +
          ' '.repeat(startingColum + 1) + `text = ${formattedText}, \n` +
          ' '.repeat(startingColum + 1) + `color = \"${jsonObjects['color'] || await commonDefault.getDefaultValue(jsonObjects['type'], 'color') || "#FF000000"}\", \n` +
          ' '.repeat(startingColum + 1) + `fontFamily = \"${jsonObjects?.['fontFamily'] || "Arial"}\", \n` +
          ' '.repeat(startingColum + 1) + `fontSize = "${jsonObjects['fontSize'] || await commonDefault.getDefaultValue(jsonObjects['type'], 'fontSize') || "16px"}", \n` +
          ' '.repeat(startingColum + 1) + `fontWeight = FontWeight.W${await commonUtilsAndroid.getFontWeight(jsonObjects, getDefaultObject)}, \n` +
          ' '.repeat(startingColum + 1) + `textAlign = ${await commonUtilsAndroid.getTextAlign(jsonObjects, getDefaultObject)}, \n` +
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
     parseBlockText
}