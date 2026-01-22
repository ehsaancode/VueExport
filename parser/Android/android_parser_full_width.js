const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_full_width');

class AndroidParserFullWidth {
     constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
          this.startingColum = startingColum;
          this.fileName = fileName;
          this.jsonObjects = jsonObjects;
          this.parentWidth = parentWidth; 
          this.parentHeight = parentHeight;
          this.parentType = parentType;
     }

     async parseFullWidth() {
          let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
          const mainCanvasObject = require(mainCanvasJsonFile);

          const mainAlignment = (() => {
               switch (this.jsonObjects['mainAlignment']) {
                    case 'align_left':
                       return 'Arrangement.Start';
                    case 'align_center':
                       return 'Arrangement.Center';
                    case 'align_right':
                       return 'Arrangement.End';
                    case 'space_between':
                       return 'Arrangement.SpaceBetween';
                    case 'space_around':
                       return 'Arrangement.SpaceAround';
                    case 'space_evenly':
                       return 'Arrangement.SpaceEvenly';
                   default:
                       return 'Arrangement.Start'; // Default value if no match
               }
           })();
       
           const crossAlignment = (() => {
               switch (this.jsonObjects['crossAlignment']) {
                   case 'align_left':
                       return 'Alignment.Top';
                   case 'align_center':
                       return 'Alignment.CenterVertically';
                   case 'align_right':
                       return 'Alignment.Bottom';
                   default:
                       return 'Alignment.CenterVertically'; // Default value if no match
               }
           })();

          let getDefaultObject = await commonDefault.getDefaultObject();
          let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);

          let paddingProps = await commonUtilsAndroid.extractPadding(this.jsonObjects, getDefaultObject);
          let marginProps = await commonUtilsAndroid.extractMargin(this.jsonObjects, getDefaultObject);
          let shadowProps = await commonUtilsAndroid.extractShadow(this.jsonObjects, getDefaultObject);

          // Extract border properties
          let borderProperties = await commonUtilsAndroid.extractBorderProperties(this.jsonObjects);

          if(this.parentType == "QStack"){
               await readWriteFile.writeToFile(fileName, 
                    ' '.repeat(this.startingColum) + `Box(\n`+
                    ' '.repeat(this.startingColum+1) + `modifier = Modifier.fillMaxSize()\n`+
                    ' '.repeat(this.startingColum+1) + `.padding(start = ${parseFloat(this.jsonObjects['positionedLeft'] ?? 0)}.dp, end = ${parseFloat(this.jsonObjects['positionedRight'] ?? 0)}.dp, top = ${parseFloat(this.jsonObjects['positionedTop'] ?? 0)}.dp, bottom = ${parseFloat(this.jsonObjects['positionedBottom'] ?? 0)}.dp)\n`+
                    ' '.repeat(this.startingColum+1) + `) { \n`
               );
          }

           await readWriteFile.writeToFile(
               this.fileName,
               ' '.repeat(this.startingColum) + 'QFullWidth(\n' +
               // ' '.repeat(this.startingColum + 1) + `height = convertedHeight(referenceHeight = ${commonUtils.nullCheckedFloatValue(mainCanvasObject["height"])+"f"}, height = ${commonUtils.nullCheckedFloatValue(this.jsonObjects["height"])+"f"}).toString(), \n` +
               // ' '.repeat(this.startingColum + 1) + `width = convertedWidth(referenceWidth = ${commonUtils.nullCheckedFloatValue(mainCanvasObject["width"])+"f"}, width = ${commonUtils.nullCheckedFloatValue(this.jsonObjects["width"])+"f"}).toString(), \n` +
               ' '.repeat(this.startingColum + 1) + `${frame} \n` +

               await commonUtilsAndroid.getFormattedAnimationsData(this.jsonObjects["id"], this.jsonObjects?.["AnimationsData"], this.startingColum) +

               // Background condition
               (this.jsonObjects["url"] != null && this.jsonObjects["url"] !== ""
                    ? ' '.repeat(this.startingColum + 1) + `bgUrl = "${this.jsonObjects["url"]}",\n`
                    : ' '.repeat(this.startingColum + 1) + `bgColor = "${this.jsonObjects["bgColor"] ?? "#00FFFFFF"}",\n`) +
               
               (this.jsonObjects["url"] != null && this.jsonObjects["url"] !== "" ? 
                    ' '.repeat(this.startingColum + 1) + `imageFit = ${await commonUtilsAndroid.getImageFit(this.jsonObjects, getDefaultObject)}, \n` : '')+
                                        
               // Padding
               Object.entries(paddingProps).map(([key, value]) => 
                    ' '.repeat(this.startingColum + 1) + `${key} = ${value}, \n`
               ).join("") +
               // Margin
               Object.entries(marginProps).map(([key, value]) => 
                    ' '.repeat(this.startingColum + 1) + `${key} = ${value}, \n`
               ).join("") +

               // Shadow
               Object.entries(shadowProps).map(([key, value]) => 
                    ' '.repeat(this.startingColum + 1) + `${key} = "${value}", \n`
               ).join("") +

               // Border
               Object.entries(borderProperties)
               .map(([key, value]) => ' '.repeat(this.startingColum + 1) +`${key} = "${value}", \n`)
               .join('') +

               ' '.repeat(this.startingColum + 1) + `mainAlignment = ${mainAlignment ?? defaultDivData.getDivDefaultValue('mainAlignment')}, \n` +
               ' '.repeat(this.startingColum + 1) + `crossAlignment = ${crossAlignment}, \n` +
               await commonUtilsAndroid.handleOnClickNavigation(this.jsonObjects, this.startingColum) +
               ' '.repeat(this.startingColum + 1) + `children = listOf { \n`
          ).then(async (content) => {
               if (content == "success") {
                    let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
                                             
                    //console.log("*********** success div ************");
                    if (this.jsonObjects["children"] != null && this.jsonObjects["children"].length > 0) {
                         await this.parsePage(this.startingColum + 3, this.fileName, this.jsonObjects["children"], widthHeight.width ?? this.parentWidth, widthHeight.height ?? this.parentHeight);
                    }
                    await this.endFile(this.fileName, this.startingColum, this.parentType);
               }
          });
     }

          async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) {    
               for (const index in jsonObjects) {
                    var jsonObj = jsonObjects[index];
                    await createPageDesign.pageDesign(startingColum, fileName, jsonObj, parentWidth, parentHeight, "QFullWidth");
               }
          }
     
          async endFile(pageName, startingColum, parentType) {
               await readWriteFile.writeToFile(pageName, "\n" +
                    ' '.repeat(startingColum + 1) + '}\n' +
                    ' '.repeat(startingColum) + ')\n'
               );

               if(parentType == "QStack"){
                    await readWriteFile.writeToFile(pageName, 
                         ' '.repeat(startingColum) + `}\n`
                    );
               }
          }
}

module.exports = {
     AndroidParserFullWidth
}