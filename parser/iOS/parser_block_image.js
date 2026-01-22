const readWriteFile = require('../../utility/read_write_file');
const commonDefault = require('../Common/parse_default_image');
const commonUtilsIos = require('./common_utilits_ios');
const commonUtils = require('../../utility/common_utils');
const parserAnimations = require('./parser_animations');

async function parseBlockImage(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     let defaultObj = await commonDefault.getDefaultObject(jsonObjects["type"]);
     let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
     let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
     let shadow = await commonUtilsIos.componentShadow(jsonObjects);
     let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
     await readWriteFile.writeToFile(fileName, 
          ' '.repeat(startingColum) + "VStack { \n");
     let imgUrl = jsonObjects['url'] ?? "";

     if(await commonUtils.isSVGImage(imgUrl)) {
          let width = 0;
          let height = 0;
          if (parantType == "QHeaderBar" || parantType == "QBottomMenu") {
               let widthHeight = await commonUtils.getComponentWidthHeight(jsonObjects, defaultObj, parentWidth, parentHeight, false, true, true);
               width = widthHeight.width > 0 ? widthHeight.width : (widthHeight.height > 0 ? widthHeight.height : 40);
               height = widthHeight.height > 0 ? widthHeight.height : width;
          }
          await readWriteFile.writeToFile(fileName, 
               ' '.repeat(startingColum + 2) + `SVGImage(url: URL(string: \"${imgUrl}\")!, width: ${width}, height: ${height})\n` +
               ' '.repeat(startingColum + 3) + `.aspectRatio(contentMode: .fit)\n` +
               ' '.repeat(startingColum) + "} \n"
          );
     } else {
          await readWriteFile.writeToFile(fileName, 
               ' '.repeat(startingColum + 2) + `QAsyncImage(url: URL(string: \"${imgUrl}\")!, placeholder: { Text(\"Loading ...\") },\n` +
               ' '.repeat(startingColum + 2) + `image: {\n` +
               ' '.repeat(startingColum + 3) + `Image(uiImage: $0)\n` +
               ' '.repeat(startingColum + 3) + `.resizable()\n` +
               ' '.repeat(startingColum + 2) + `})\n` + 
               ' '.repeat(startingColum + 2) + `.aspectRatio(contentMode: .fit)\n` +
               ' '.repeat(startingColum + 2) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + "} \n"
          );
     }
     
     /*await readWriteFile.writeToFile(fileName, 
          ' '.repeat(startingColum + 2) + `CustomAsyncImageView(\n` +
          ' '.repeat(startingColum + 2) + `urlString: \"${imgUrl}\"\n` +
          ' '.repeat(startingColum + 3) + `)\n` +
          ' '.repeat(startingColum + 2) + `.frame(${frame})\n` +
          ' '.repeat(startingColum) + "} \n"
          );*/

     if (parantType === "QStack") {
          let positioned = await commonUtilsIos.componentStackPositioned(jsonObjects, startingColum);
          console.log(`positioned: ${positioned}`);
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `${positioned}\n`
          );
     } else {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(padding.paddingLeft)) ? padding.paddingLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(padding.paddingRight)) ? padding.paddingRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(padding.paddingTop)) ? padding.paddingTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(padding.paddingBottom)) ? padding.paddingBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + `${cornerRadius}` +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `${shadow}`
          );
     }

     let jsonOnClick = jsonObjects["onClick"];
     if(jsonOnClick != undefined) {
          let action = jsonOnClick["action"];
          if(action != undefined && action == "Navigate to") {
               let destination = jsonOnClick["destination"];
               if(destination != undefined) {
                    let actionFilePath = await commonUtilsIos.actionFilePath()
                    await readWriteFile.writeToFile(actionFilePath, "" +
                         `, ${destination}`
                    );
                    
                    await readWriteFile.writeToFile(fileName,
                         ' '.repeat(startingColum) + `.onTapGesture { \n` +
                         ' '.repeat(startingColum + 1) + `onTapAction?(.${destination}) \n` +
                         ' '.repeat(startingColum) + `} \n`
                    );
               }
          }
     }

     let componentId = jsonObjects["id"];
     let animationObj = jsonObjects["AnimationsData"] ?? [];
     await parserAnimations.parseAnimation(startingColum, fileName, animationObj, componentId);
}

module.exports = {
     parseBlockImage
}