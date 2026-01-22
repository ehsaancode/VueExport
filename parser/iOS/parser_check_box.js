const readWriteFile = require('../../utility/read_write_file');
const commonDefault = require('../Common/parse_default_check_box');
const commonUtilsIos = require('./common_utilits_ios');
const commonUtils = require('../../utility/common_utils');

async function parseCheckBox(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     let defaultObj = await commonDefault.getDefaultObject();
     let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
     let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
     let text = await jsonObjects['text'];
     let options = await jsonObjects["options"];
     let optionsObj = "[";
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
          ' '.repeat(startingColum + 1) + 'QCheckBox (' +
          `items: ${optionsObj}) { ids in \n` +
          ' '.repeat(startingColum + 2) + `formData[\"${text.replace(/ $/, "_")}\"] = ids \n` +
          ' '.repeat(startingColum + 1) + '}\n' +
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
               // ' '.repeat(startingColum) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n`
               );
     }
}

module.exports = {
     parseCheckBox
}