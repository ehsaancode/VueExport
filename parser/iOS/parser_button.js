const readWriteFile = require('../../utility/read_write_file');
const commonDefault = require('../Common/parse_default_button');
const commonUtilsIos = require('./common_utilits_ios');
const parserAnimations = require('./parser_animations');

async function parseBlockButton(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     let defaultObj = await commonDefault.getDefaultObject(jsonObjects["design"]);
     let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let width = await commonUtilsIos.componentWidth(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let height = await commonUtilsIos.componentHeight(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
     let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
     let shadow = await commonUtilsIos.componentShadow(jsonObjects);
     let text = jsonObjects['text'];
     let forgroundColor = jsonObjects['color'] ?? "";
     let backgroundColor = jsonObjects['bgColor'] ?? "";
     let borderColor = jsonObjects['borderColor'] ?? "";
     // let numericBorderWidth = parseInt(borderWidth.replace(/px$/, ""), 10);
     let borderRadius = jsonObjects['borderRadius'] ?? "0px";
     let numericBorderRadius = parseInt(borderRadius.replace(/px$/, ""), 10);
     let fontSize = jsonObjects['fontSize'] ?? "12px";
     let numericValue = parseInt(fontSize.replace(/px$/, ""), 10);
     let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
     
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + 'VStack { \n' +
          ' '.repeat(startingColum + 1) + 'QButton( \n' +
          ' '.repeat(startingColum + 2) + `buttonTitle: \"\"\"\n${text}\n\"\"\", \n` +
          ' '.repeat(startingColum + 2) + `forgroundColor: \"${forgroundColor}\", \n` +
          ' '.repeat(startingColum + 2) + `borderColor: \"${borderColor}\", \n` +
          ' '.repeat(startingColum + 2) + `backgroundColor: \"${backgroundColor}\", \n` +
          ' '.repeat(startingColum + 2) + `cornerRadius: \"${numericBorderRadius}\", \n` +
          ' '.repeat(startingColum + 2) + `fontSize: \"${numericValue}\", \n` +
          ' '.repeat(startingColum + 2) + `width: ${width}, \n` +
          ' '.repeat(startingColum + 2) + `height: ${height}) { \n` +
          ' '.repeat(startingColum + 4) + 'print("Submit form data : \\(formData)")\n' +
          ' '.repeat(startingColum + 2) + `} \n` +
          ' '.repeat(startingColum) + '}\n'
     );

     if (parantType === "QStack") {
          let positioned = await commonUtilsIos.componentStackPositioned(jsonObjects, startingColum);
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `${positioned}\n`
          );
     } else {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(padding.paddingLeft)) ? padding.paddingLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(padding.paddingRight)) ? padding.paddingRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(padding.paddingTop)) ? padding.paddingTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(padding.paddingBottom)) ? padding.paddingBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `${cornerRadius}` +
               ' '.repeat(startingColum) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `${shadow}`
               );
     }

     let componentId = jsonObjects["id"];
     let animationObj = jsonObjects["AnimationsData"] ?? [];
     await parserAnimations.parseAnimation(startingColum, fileName, animationObj, componentId);
}

module.exports = {
     parseBlockButton
}