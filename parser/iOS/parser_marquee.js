const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');
const commonUtilsIos = require('./common_utilits_ios');
const commonDefault = require('../Common/parse_default_marquee');
const commonUtils = require('../../utility/common_utils');

class ParserMarquee {
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

     async parseMarquee() {
          // const pageName = `HomeMarquee${this.jsonObjects["id"] ?? ""}`;
          // let pagePath = `./created_files/iOS/${pageName}.swift`;

          // await readWriteFile.deleteFile(pagePath);

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
               ' '.repeat(this.startingColum) + `${alignment} { \n` +
               ' '.repeat(this.startingColum + 1) + `QMarqueeView(items: [ \n` 
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
     
     async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment) {   
          for (const index in jsonObjects) {
               var jsonObj = jsonObjects[index];
               // console.log(`Marquee: ${jsonObj["type"]}`);
               let widthHeight = await createPageDesign.componentFrame(0, "", jsonObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, "QMarquee");
               await readWriteFile.writeToFile(this.fileName, 
                    ' '.repeat(startingColum) + "QMarqueeItem(item: \n" +
                    ' '.repeat(startingColum + 1) + "AnyView(_fromValue:  ContainerView(aligbment: .center, \n" +
                    ' '.repeat(startingColum + 2) + "Container: {AnyView(_fromValue: VStack { \n"
               );
               // console.log(`index: ${index} object type: ${jsonObj["type"]}`);
               await createPageDesign.pageDesign(startingColum + 3, fileName, jsonObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, "QMarquee");

               if(index < jsonObjects.length - 1) {
                    await readWriteFile.writeToFile(this.fileName, 
                         ' '.repeat(startingColum + 2) + "})} \n" +
                         ' '.repeat(startingColum + 2) + "))!, \n" +
                         ' '.repeat(startingColum + 2) + `frame: CGSize(width: ${widthHeight.width > 0 ? widthHeight.width : "0"}, height: ${widthHeight.height > 0 ? widthHeight.height : "0"}) \n` +
                         // ' '.repeat(startingColum + 2) + `frame: CGSize(width: 200, height: 80) \n` +
                         ' '.repeat(startingColum + 1) + "), \n"
                    );
               } else {
                    await readWriteFile.writeToFile(this.fileName, 
                         ' '.repeat(startingColum + 2) + "})} \n" +
                         ' '.repeat(startingColum + 2) + "))!, \n" +
                         ' '.repeat(startingColum + 2) + `frame: CGSize(width: ${widthHeight.width > 0 ? widthHeight.width : "0"}, height: ${widthHeight.height > 0 ? widthHeight.height : "0"}) \n` +
                         // ' '.repeat(startingColum + 2) + "frame: CGSize(width: 200, height: 80) \n" +
                         ' '.repeat(startingColum + 1) + ") \n"
                    );
               }
          }
     }
     
     async endFile(pageName, startingColum, jsonObjects) {
          let defaultObj = await commonDefault.getDefaultObject();
          let mainAlignment = (jsonObjects["mainAlignment"] ?? defaultObj["mainAlignment"]) ?? this.parantMainAlignment;
          let crossAlignment = (jsonObjects["crossAlignment"] ?? defaultObj["crossAlignment"] ?? this.parantCrossAlignment);
          let frame = await commonUtilsIos.componentFrame(jsonObjects, defaultObj, this.parentWidth, this.parentHeight, mainAlignment, crossAlignment, false, true);
          let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
          let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
          let shadow = await commonUtilsIos.componentShadow(jsonObjects);
          let borderView = await commonUtilsIos.customBorderView(jsonObjects);
          let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
          await readWriteFile.writeToFile(pageName, "\n" +
               ' '.repeat(startingColum + 1) + "])\n" +
               ' '.repeat(startingColum) + "}\n" +
               ' '.repeat(startingColum) + `.padding(.leading, ${!isNaN(parseFloat(padding.paddingLeft)) ? padding.paddingLeft : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.trailing, ${!isNaN(parseFloat(padding.paddingRight)) ? padding.paddingRight : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.top, ${!isNaN(parseFloat(padding.paddingTop)) ? padding.paddingTop : 0.0})\n` +
               ' '.repeat(startingColum) + `.padding(.bottom, ${!isNaN(parseFloat(padding.paddingBottom)) ? padding.paddingBottom : 0.0})\n` +
               ' '.repeat(startingColum) + `.frame(${frame})\n` +
               ' '.repeat(startingColum) + `.background(ZStack { \n QColor.hexToColor(hex:\"${jsonObjects["bgColor"] ?? ""}\") \n ${borderView} \n})\n\n` +
               ' '.repeat(startingColum) + `${cornerRadius}` +
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
}



module.exports = {
     ParserMarquee
}

