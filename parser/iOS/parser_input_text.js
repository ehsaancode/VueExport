const readWriteFile = require('../../utility/read_write_file');
const commonDefault = require('../Common/parse_default_input_text');
const commonUtilsIos = require('./common_utilits_ios');
const commonUtils = require('../../utility/common_utils');
const parserAnimations = require('./parser_animations');

async function parseInputText(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     // console.log(`form input Text parantType: ${parantType} | fileName: ${fileName}`);
     let defaultObj = await commonDefault.getDefaultObject();
     let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let widthHeight = await commonUtils.getComponentWidthHeight(jsonObjects, defaultObj, parentWidth, parentHeight, false, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
     let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
     let text = jsonObjects['text'];
     let formattedText = await commonUtilsIos.formatText(text);
     let forgroundColor = jsonObjects['color'] ?? "#FF000000";
     let fontSize = jsonObjects['fontSize'] ?? await commonDefault.getDefaultValue(jsonObjects["type"], "fontSize") ?? "12px";
     let numericFontSize = parseInt(fontSize.replace(/px$/, ""), 10);
     let cornerRadius = (await jsonObjects["borderBLR"] ?? "15px").replace(/px$/, "");
     let lineWidth = (await jsonObjects["borderBW"] ?? "1px").replace(/px$/, "");
     let strokeColor = await jsonObjects["borderBC"] ?? "#FF000000";
     let textFieldType = "";
     let fieldType = await jsonObjects["type"];
     if(fieldType == "QInputTextEmail") {
          textFieldType = ".fieldTypeEmailAddress";
     } else if(fieldType == "QInputTextNumber") {
          textFieldType = ".fieldTypePhonePad";
     } else {
          textFieldType = ".fieldTypeDefault";
     }
    
     // let borderView = await commonUtilsIos.customBorderView(jsonObjects);
     // let background = await commonUtilsIos.componentBackground(startingColum, jsonObjects, defaultObj, borderView, parentWidth, parentHeight, false, true);
     // let width = jsonObjects["width"] ?? await commonDefault.getDefaultValue(jsonObjects["type"], "width") ?? "nil";
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + 'VStack { \n' +
          ' '.repeat(startingColum + 1) + 'QTextField(\n' +
          ' '.repeat(startingColum + 2) + `placeHolder: ${formattedText}, \n` +
          ' '.repeat(startingColum + 2) + `textFieldType: ${textFieldType}, \n` +
          ' '.repeat(startingColum + 2) + `lineWidth: ${lineWidth}, \n` +
          ' '.repeat(startingColum + 2) + `strokeColor: \"${strokeColor}\", \n` +
          ' '.repeat(startingColum + 2) + `cornerRadius: ${cornerRadius}, \n` +
          ' '.repeat(startingColum + 2) + `height: ${widthHeight.height}, \n` +
          ' '.repeat(startingColum + 2) + `font: .system(size: ${numericFontSize}, weight: .regular, design: .rounded), \n` +
          ' '.repeat(startingColum + 2) + `forgroundColor: \"${forgroundColor}\" \n` +
          ' '.repeat(startingColum + 1) + ') {text in \n' +
          ' '.repeat(startingColum + 3) + `formData[\"${text.replace(/ $/, "_")}\"] = text \n` +
          ' '.repeat(startingColum + 1) + '}\n' +
          ' '.repeat(startingColum) + '}\n'
          // ' '.repeat(startingColum) + `.background(.yellow)\n\n`
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
               ' '.repeat(startingColum) + `.frame(${frame})\n` +
               // ' '.repeat(startingColum) + `${cornerRadius}` +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n`
               // ' '.repeat(startingColum) + `${shadow}`
               );
     }

    /* await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `${background}`
     );*/

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
     parseInputText
}