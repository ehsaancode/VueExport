const readWriteFile = require('../../utility/read_write_file');
const commonDefault = require('../Common/parse_default_dropdown');
const commonUtilsIos = require('./common_utilits_ios');
const commonUtils = require('../../utility/common_utils');

async function parseDropdown(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     let defaultObj = await commonDefault.getDefaultObject();
     let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let widthHeight = await commonUtils.getComponentWidthHeight(jsonObjects, defaultObj, parentWidth, parentHeight, false, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
     let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
     let forgroundColor = jsonObjects['color'] ?? "#FF000000";
     let cornerRadius = (await jsonObjects["borderBLR"] ?? "15px").replace(/px$/, "");
     let lineWidth = (await jsonObjects["borderBW"] ?? "1px").replace(/px$/, "");
     let strokeColor = await jsonObjects["borderBC"] ?? "#FF000000";
     let text = await jsonObjects['text'];
     let options = await jsonObjects["options"];
     let optionsObj = "[\"Select an option\",";
     for (const index in options) {
          var option = options[index];
          optionsObj = optionsObj + `\"${option}\"`;
          if(index < options.length - 1) {
               optionsObj = optionsObj + `,`;
          }
     }
     optionsObj = optionsObj + `]`;
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + 'VStack { \n' +
          ' '.repeat(startingColum + 1) + 'QDropdown(\n' +
          ' '.repeat(startingColum + 2) + `options: ${optionsObj}, \n` +
          ' '.repeat(startingColum + 2) + `forgroundColor: \"${forgroundColor}\", \n` + 
          ' '.repeat(startingColum + 2) + `strokeColor: \"${strokeColor}\", \n` +
          ' '.repeat(startingColum + 2) + `lineWidth: ${lineWidth}, \n` +
          ' '.repeat(startingColum + 2) + `cornerRadius: ${cornerRadius} \n` +
          ' '.repeat(startingColum + 1) + ') {selectedText in \n' +
          ' '.repeat(startingColum + 3) + `formData[\"${text.replace(/ $/, "_")}\"] = selectedText \n` +
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
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n`
               );
     }
}

module.exports = {
     parseDropdown
}