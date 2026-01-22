const commonDefault = require('../Common/parse_default_div');
const commonUtils = require('../../utility/common_utils');
const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtilsAndroid = require('./utils');


class AndroidParserSection {

     constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
          this.startingColum = startingColum;
          this.fileName = fileName;
          this.jsonObjects = jsonObjects;
          this.parentWidth = parentWidth;
          this.parentHeight = parentHeight;
          this.parentType = parentType;
     }

     async parseSection() {
          const widgetStyle = await this?.jsonObjects?.widgetDefaultData?.style ?? {}
          let calculateHeightWidth = await commonUtilsAndroid.componentDimension(widgetStyle);
          let calculatePadding = await commonUtilsAndroid.componentPadding(widgetStyle);
          let calculateMargin = await commonUtilsAndroid.componentMargin(widgetStyle);
          let bgColorProperties = await commonUtilsAndroid.componentBackgroundColor(widgetStyle);
          let borderProperties = await commonUtilsAndroid.componentBorder(widgetStyle);
          // console.log(`Result border properties - ${JSON.stringify(borderProperties)}`)

          if (this.parentType == "QStack") {
               await readWriteFile.writeToFile(this.fileName,
                    ' '.repeat(this.startingColum) + `Box(\n` +
                    ' '.repeat(this.startingColum + 1) + `modifier = Modifier.fillMaxSize()\n` +
                    ' '.repeat(this.startingColum + 1) + `.padding(start = ${parseFloat(this.jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(this.jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(this.jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(this.jsonObjects['positionedBottom'] ?? 0)}.dp)\n` +
                    ' '.repeat(this.startingColum + 1) + `) { \n`
               );
          }

          let output = '';
          //height & width properties
          output += calculateHeightWidth['height'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `height = "${calculateHeightWidth['height']}",\n` : '';
          output += calculateHeightWidth['width'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `width = "${calculateHeightWidth['width']}",\n` : '';

          //padding properties
          output += calculatePadding['top'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `paddingTop = "${calculatePadding['top']}",\n` : '';
          output += calculatePadding['bottom'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `paddingBottom = "${calculatePadding['bottom']}",\n` : '';
          output += calculatePadding['right'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `paddingEnd = "${calculatePadding['right']}",\n` : '';
          output += calculatePadding['left'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `paddingStart = "${calculatePadding['left']}",\n` : '';

          //margin properties
          output += calculateMargin['top'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `marginTop = "${calculateMargin['top']}",\n` : '';
          output += calculateMargin['bottom'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `marginBottom = "${calculateMargin['bottom']}",\n` : '';
          output += calculateMargin['left'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `marginStart = "${calculateMargin['left']}",\n` : '';
          output += calculateMargin['right'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `marginEnd = "${calculateMargin['right']}",\n` : '';

          //bg color properties
          output += bgColorProperties['bgType'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `bgType = "${bgColorProperties['bgType']}",\n` : '';
          output += bgColorProperties['bgType'] === 'solid' && bgColorProperties['bgColor'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `bgColor = "${bgColorProperties['bgColor']}",\n` : '';
          output += bgColorProperties['bgType'] === 'linear' && bgColorProperties['linearGradientAngle'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `linearGradientAngle = "${bgColorProperties['linearGradientAngle']}",\n` : '';
          output += bgColorProperties['bgType'] === 'radial' && bgColorProperties['radialGradientShape'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `radialGradientShape = "${bgColorProperties['radialGradientShape']}",\n` : '';
          output += bgColorProperties['bgType'] === 'radial' && bgColorProperties['bgType'] === 'linear' && bgColorProperties['gradientColorList'] !== 'listOf()'
               ? ' '.repeat(this.startingColum + 4) + `gradientColorList = ${bgColorProperties['gradientColorList']},\n` : '';
          output += bgColorProperties['bgType'] === 'media' && bgColorProperties['bgUrl'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `bgUrl = "${bgColorProperties['bgUrl']}",\n` : '';
          output += bgColorProperties['bgType'] === 'media' && bgColorProperties['imageFit'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `imageFit = ${bgColorProperties['imageFit']},\n` : '';

          //border properties   
          output += borderProperties['borderTC'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderTC = "${borderProperties['borderTC']}",\n` : '';
          output += borderProperties['borderBC'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderBC = "${borderProperties['borderBC']}",\n` : '';
          output += borderProperties['borderLC'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderLC = "${borderProperties['borderLC']}",\n` : '';
          output += borderProperties['borderRC'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderRC = "${borderProperties['borderRC']}",\n` : '';

          output += borderProperties['borderTW'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderTW = "${borderProperties['borderTW']}",\n` : '';
          output += borderProperties['borderBW'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderBW = "${borderProperties['borderBW']}",\n` : '';
          output += borderProperties['borderLW'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderLW = "${borderProperties['borderLW']}",\n` : '';
          output += borderProperties['borderRW'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderRW = "${borderProperties['borderRW']}",\n` : '';

          output += borderProperties['borderTLR'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderTLR = "${borderProperties['borderTLR']}",\n` : '';
          output += borderProperties['borderTRR'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderTRR = "${borderProperties['borderTRR']}",\n` : '';
          output += borderProperties['borderBLR'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderBLR = "${borderProperties['borderBLR']}",\n` : '';
          output += borderProperties['borderBRR'] !== ''
               ? ' '.repeat(this.startingColum + 4) + `borderBRR = "${borderProperties['borderBRR']}",\n` : '';

          await readWriteFile.writeToFile(this.fileName,
               ' '.repeat(this.startingColum) + '{\n' +
               ' '.repeat(this.startingColum + 2) + 'Section( \n' +
               output +
               ' '.repeat(this.startingColum + 2) + `children = listOf ( \n`
          ).then(async (content) => {
               if (content == "success") {
                    if (this.jsonObjects["children"] != null && this.jsonObjects["children"].length > 0) {
                         await this.parsePage(this.startingColum + 3, this.fileName, this.jsonObjects["children"]);
                    }
                    await this.endFile(this.fileName, this.startingColum, this.parentType);
               }
          });
     }

     async parsePage(startingColum, fileName, jsonObjects) {
          for (const index in jsonObjects) {
               var jsonObj = jsonObjects[index];
               await createPageDesign.pageDesign(startingColum, fileName, jsonObj, 0, 0, "Section");
          }
     }

     async endFile(pageName, startingColum, parentType) {
          await readWriteFile.writeToFile(pageName, "\n" +
               ' '.repeat(startingColum + 4) + ')\n' +
               ' '.repeat(startingColum + 2) + ')\n' +
               ' '.repeat(startingColum) + '},\n'
          );

          if (parentType == "QStack") {
               await readWriteFile.writeToFile(pageName,
                    ' '.repeat(startingColum) + `}\n`
               );
          }
     }
}



module.exports = {
     AndroidParserSection
}