const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./android_create_page_design');
const commonUtils = require('../../utility/common_utils');
const commonUtilsAndroid = require('./utils');
const commonDefault = require('../Common/parse_default_slider');

class AndroidParserSlider{
     constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parentType) {
          this.startingColum = startingColum;
          this.fileName = fileName;
          this.jsonObjects = jsonObjects;
          this.parentWidth = parentWidth; 
          this.parentHeight = parentHeight;
          this.parentType = parentType;
     }

     async parseSlider() {
          let getDefaultObject = await commonDefault.getDefaultObject();
          let frame = await commonUtilsAndroid.componentFrame(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, false, true);
          
          await readWriteFile.writeToFile(this.fileName,
               ' '.repeat(this.startingColum) + 'QSlider( \n'+ 
               ' '.repeat(this.startingColum + 1) + `${frame} \n` +
               ' '.repeat(this.startingColum + 1) + 'children = listOf(\n'
          ).then(async (content) => {
               if (content == 'success') {
                    let getDefaultObject = await commonDefault.getDefaultObject();
                    let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, getDefaultObject, this.parentWidth, this.parentHeight, true);
                                              
                    if (this.jsonObjects["children"] != null && this.jsonObjects["children"].length > 0) {
                         await this.parsePage(this.startingColum + 3, this.fileName, this.jsonObjects["children"], widthHeight.width ?? this.parentWidth, widthHeight.height ?? this.parentHeight);
                    }
                    await this.endFile(this.fileName, this.startingColum, this.parentType);
               }
          });
     }

     async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight) {    
          for (const index in jsonObjects) {
               const numericIndex = parseInt(index, 10); // Convert index to a number
               const pageName = `SliderPage${numericIndex + 1}`;
               // console.log(`+++++++++ ${pageName} +++++++++++\n`);
               let pagePath = `./created_files/Android/${pageName}.kt`;
               await readWriteFile.deleteFile(pagePath);
               var jsonObj = jsonObjects[index];
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum + 2) + '{\n' +
                    ' '.repeat(startingColum + 3) + `${pageName}() \n` +
                    ' '.repeat(startingColum + 2) + '},\n'
               ).then(async content => {
               if (content == 'success') {
                    await readWriteFile.writeToFile(pagePath,  
                         "package com.redoq.appbuilder.ui.screen \n\n" +
                         "@Composable \n" +
                         `fun ` + `${pageName}` + `(){ \n` +
                         ' '.repeat(1) + "Box ( \n" +
                         ' '.repeat(2) + "modifier = Modifier.fillMaxSize()){ \n"
                    ).then(async content => {
                              if (content == 'success') {
                                   await createPageDesign.pageDesign(2, pagePath, jsonObj);
                                   await readWriteFile.writeToFile(pagePath, "\n" +
                                        ' '.repeat(1) + "} \n" +
                                        "}"
                                   );
                              }
                         });
                    }
               });
          }
     }

     async endFile(pageName, startingColum, parentType) {
          await readWriteFile.writeToFile(pageName, "\n" +
               ' '.repeat(startingColum + 1) + ')\n' +
               ' '.repeat(startingColum) + ")\n" 
          );
     }
}

/*async function parserSlider(startingColum, fileName, jsonObjects) {
     let mainCanvasJsonFile = '../.././created_files/common_private/main_canvas.json';
     const mainCanvasObject = require(mainCanvasJsonFile);

     console.log('+++++++++ parseFullWidth +++++++++++\n');
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + 'QSlider(\n' +
          ' '.repeat(startingColum + 1) + `height = convertedHeight(referenceHeight = ${commonUtils.nullCheckedFloatValue(mainCanvasObject["height"])+"f"}, height = ${commonUtils.nullCheckedFloatValue(jsonObjects["height"])+"f"}).toString(), \n` +
          ' '.repeat(startingColum + 1) + `width = convertedWidth(referenceWidth = ${commonUtils.nullCheckedFloatValue(mainCanvasObject["width"])+"f"}, width = ${commonUtils.nullCheckedFloatValue(jsonObjects["width"])+"f"}).toString(), \n` +  
          ' '.repeat(startingColum + 1) + 'children = listOf(\n'
     ).then(async content => {
          if (content == 'success') {
               console.log('*********** success full width ************');
               await parsePage(startingColum, fileName, jsonObjects['children'], 0);
               await endFile(fileName, startingColum);
          }
     });
}

async function parsePage(startingColum, fileName, jsonObjects, index) {
     for (const index in jsonObjects) {
          const numericIndex = parseInt(index, 10); // Convert index to a number
          const pageName = `SliderPage${numericIndex + 1}`;
          // console.log(`+++++++++ ${pageName} +++++++++++\n`);
          let pagePath = `./created_files/Android/${pageName}.kt`;
          await readWriteFile.deleteFile(pagePath);
          var jsonObj = jsonObjects[index];
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum + 2) + '{\n' +
               ' '.repeat(startingColum + 3) + `${pageName}() \n` +
               ' '.repeat(startingColum + 2) + '},\n'
          ).then(async content => {
          if (content == 'success') {
               await readWriteFile.writeToFile(pagePath,  
                    "package com.redoq.appbuilder.ui.screen \n\n" +
                    "@Composable \n" +
                    `fun ` + `${pageName}` + `(){ \n` +
                    ' '.repeat(1) + "Box ( \n" +
                    ' '.repeat(2) + "modifier = Modifier.fillMaxSize()){ \n"
               ).then(async content => {
                         if (content == 'success') {
                              await createPageDesign.pageDesign(2, pagePath, jsonObj);
                              await readWriteFile.writeToFile(pagePath, "\n" +
                                   ' '.repeat(1) + "} \n" +
                                   "}"
                              );
                         }
                    });
               }
          });
     }
}

async function endFile(pageName, startingColum) {
     await readWriteFile.writeToFile(pageName, "\n" +
          // ' '.repeat(startingColum + 3) + '})}\n' +
          // ' '.repeat(startingColum + 2) + '))!,\n' +
          ' '.repeat(startingColum + 1) + ')\n' +
          ' '.repeat(startingColum) + ")\n" 
          // "}\n"
          //' '.repeat(startingColum) + ".frame(width: proxy.size.width, height: proxy.size.height, alignment: .center)\n"
     );
}*/

module.exports = {
     AndroidParserSlider
}