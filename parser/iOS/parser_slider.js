/*
QFullWidth( aligbment: .center,
     contents: [
     AnyView(_fromValue:  ContainerView(aligbment: .center,
     Container: {AnyView(_fromValue: VStack {
     
          [objects]

     })}))!
])
*/

const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');
const commonUtilsIos = require('./common_utilits_ios');
const commonDefault = require('../Common/parse_default_slider');
const commonUtils = require('../../utility/common_utils');

class ParserSlider {
     constructor(startingColum, fileName, jsonObjects, parentWidth, parentHeight, 
          parantMainAlignment, parantCrossAlignment, parantType) {
          this.startingColum = startingColum;
          this.fileName = fileName;
          this.jsonObjects = jsonObjects;
          this.parentWidth = parentWidth; 
          this.parentHeight = parentHeight;
          this.parantMainAlignment = parantMainAlignment;
          this.parantCrossAlignment = parantCrossAlignment;
          this.parantType = parantType;
     }

     async parserSlider() {
          let defaultObj = await commonDefault.getDefaultObject();
          let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, defaultObj, this.parentWidth, this.parentHeight, false, false, true);
          let padding = await commonUtilsIos.componentPadding(this.jsonObjects, defaultObj);
          let margin = await commonUtilsIos.componentMargin(this.jsonObjects, defaultObj);
          let mainAlignment = this.jsonObjects["mainAlignment"] ?? defaultObj["mainAlignment"];
          let crossAlignment = this.jsonObjects["crossAlignment"] ?? defaultObj["crossAlignment"];
          let alignment = "";
          if (mainAlignment === "align_left" || crossAlignment === "align_left") {
               alignment = alignment + "VStack (alignment: .leading)";
          } else if (mainAlignment === "align_right" || crossAlignment === "align_right") {
               alignment = alignment + "VStack (alignment: .trailing)";
          } else if (mainAlignment === "align_center" || crossAlignment === "align_center") {
               alignment = alignment + "VStack (alignment: .center)";
          } else {
               alignment = alignment + "VStack (alignment: .leading)";
          }

          if (this.parantType === "QStack") {
               await readWriteFile.writeToFile(this.fileName,
                    ' '.repeat(this.startingColum) + 'VStack { \n'
               );
          }

          await readWriteFile.writeToFile(this.fileName,
               ' '.repeat(this.startingColum) + `${alignment} { \n`
          ).then(async content => {
               if (content == 'success') {
                    await readWriteFile.writeToFile(this.fileName,
                         ' '.repeat(this.startingColum) + 'QSlider(contents: [ \n'
                    ).then(async content => {
                         if (content == 'success') {
                              await this.parsePage(this.startingColum, this.fileName, this.jsonObjects['children'], 
                                   (widthHeight.width ?? this.parentWidth) - (padding.paddingLeft + padding.paddingRight + margin.marginLeft + margin.marginRight), 
                                   (widthHeight.height ?? this.parentHeight) - (padding.paddingTop + padding.paddingBottom + margin.marginTop + margin.marginBottom), 
                                   mainAlignment, crossAlignment);
                              await this.endFile(this.fileName, this.startingColum, this.jsonObjects);
                         }
                    });
               }
          });     
     }
          
     async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment) {   
          for (const index in jsonObjects) {
               const numericIndex = parseInt(index, 10); // Convert index to a number
               const pageName = `slider_page${numericIndex + 1}`;
               let pagePath = `./created_files/iOS/${pageName}.swift`;
               await readWriteFile.deleteFile(pagePath);
               var jsonObj = jsonObjects[index];
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum + 2) + 'AnyView(_fromValue:  ContainerView(aligbment: .center,\n' +
                    ' '.repeat(startingColum + 3) + 'Container: {AnyView(_fromValue: VStack { \n' +
                    ' '.repeat(startingColum + 4) + `${pageName}() \n` +
                    ' '.repeat(startingColum + 3) + '})}\n' +
                    ' '.repeat(startingColum + 2) + '))!,\n'
               ).then(async content => {
               if (content == 'success') {
                    await readWriteFile.writeToFile(pagePath, "import SwiftUI \n\n" +
                         `struct ` + `${pageName}` + `: View { \n` +
                         ' '.repeat(1) + "var body: some View { \n").then(async content => {
                              if (content == 'success') {
                                   await createPageDesign.pageDesign(2, pagePath, jsonObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, "QSlider");
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

     async endFile(pageName, startingColum, jsonObjects) {
          let defaultObj = await commonDefault.getDefaultObject();
          let mainAlignment = (jsonObjects["mainAlignment"] ?? defaultObj["mainAlignment"]) ?? this.parantMainAlignment;
          let crossAlignment = (jsonObjects["crossAlignment"] ?? defaultObj["crossAlignment"] ?? this.parantCrossAlignment);
          let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, this.parentWidth, this.parentHeight, mainAlignment, crossAlignment, false, true);
          /*console.log(`defaultObj[type]: ${defaultObj["type"]}    Slider frame: ${frame}`);
          console.log(`widthType: ${jsonObjects["widthType"]} ?? ${defaultObj["widthType"]},
               width: ${jsonObjects["width"]} ?? ${defaultObj["width"]},
               widthPercent: ${jsonObjects["widthPercent"]} ?? ${defaultObj["widthPercent"]}`);
          console.log(`heightType: ${jsonObjects["heightType"]} ?? ${defaultObj["heightType"]},
               height: ${jsonObjects["height"]} ?? ${defaultObj["height"]},
               heightPercent: ${jsonObjects["heightPercent"]} ?? ${defaultObj["heightPercent"]}`);*/
          let padding = await commonUtilsIos.componentPadding(jsonObjects, await defaultObj);
          let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
          let shadow = await commonUtilsIos.componentShadow(jsonObjects);
          let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
          await readWriteFile.writeToFile(pageName, "\n" +
               ' '.repeat(startingColum + 1) + ']\n' +
               ' '.repeat(startingColum) + ")\n" +
               ' '.repeat(startingColum) + "}\n" +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(padding.paddingLeft)) ? padding.paddingLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(padding.paddingRight)) ? padding.paddingRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(padding.paddingTop)) ? padding.paddingTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(padding.paddingBottom)) ? padding.paddingBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `${cornerRadius}` +
               ' '.repeat(startingColum) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + `${shadow}` +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0})\n`
          );

          if (this.parantType === "QStack") {
               await readWriteFile.writeToFile(pageName,
                    ' '.repeat(startingColum) + '} \n'
               );
               let positioned = await commonUtilsIos.componentStackPositioned(jsonObjects, startingColum);
               await readWriteFile.writeToFile(pageName,
                    ' '.repeat(startingColum) + `${positioned}\n`
               );
          }
     }

     async childHeight(jsonObjects) {
          let childObj = jsonObjects['children'][0];
          let backgroundImageUrl = childObj["url"] ?? "";
          let imageSize = await commonUtils.fetchImageResolution(backgroundImageUrl, commonUtils.screenSizeIphone().width, commonUtils.screenSizeIphone().height);
          return imageSize;
     }
}

module.exports = {
     ParserSlider
}