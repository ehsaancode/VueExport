const readWriteFile = require('../../utility/read_write_file');
const commonDefault = require('../Common/parse_default_table_pagination_rpp');
const commonUtilsIos = require('./common_utilits_ios');
const parserAnimations = require('./parser_animations');

async function parseTablePaginationRpp(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     let defaultObj = await commonDefault.getDefaultObject() ?? "";
     let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, true, true);
     let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
     let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
    
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum + 1) + 'QTablePaginationRPP(options: ["1", "5", "10", "25", "50"]) {selectedValue in \n' +
          ' '.repeat(startingColum + 3) + 'print("\(selectedValue)") \n' +
          ' '.repeat(startingColum + 1) + '} \n' +
          ' '.repeat(startingColum + 3) + '.padding(5) \n' +
          ' '.repeat(startingColum + 3) + '.background(.lightGray) \n'
     );

     if (parantType === "QStack") {
          let positioned = await commonUtilsIos.componentStackPositioned(jsonObjects, startingColum);
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum) + `${positioned}\n`
          );
     } else {
          /*await readWriteFile.writeToFile(fileName,
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
          );*/
     }
     let componentId = jsonObjects["id"];
     let animationObj = jsonObjects["AnimationsData"] ?? [];
     await parserAnimations.parseAnimation(startingColum, fileName, animationObj, componentId);
}

module.exports = {
     parseTablePaginationRpp
}