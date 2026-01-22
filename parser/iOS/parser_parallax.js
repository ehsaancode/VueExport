const readWriteFile = require('../../utility/read_write_file');
const createPageDesign = require('./create_page_design');
const commonUtilsIos = require('./common_utilits_ios');
const commonDefault = require('../Common/parse_default_parallax');
const commonUtils = require('../../utility/common_utils');

class ParserParallax {
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

     async parseParallax() {
          const pageName = `HomeParallax${this.jsonObjects["id"] ?? ""}`;
          let pagePath = `./created_files/iOS/${pageName}.swift`;

          await readWriteFile.deleteFile(pagePath);

          let defaultObj = await commonDefault.getDefaultObject();
          let widthHeight = await commonUtils.getComponentWidthHeight(this.jsonObjects, defaultObj, this.parentWidth, this.parentHeight, false, false, true);
          // let size = await commonUtilsIos.componentSize(this.jsonObjects, commonDefault.getDefaultObject(), this.parentWidth, this.parentHeight, false, false);
          // console.log(`Parallax size: ${size} parentWidth, parentHeight : ${this.parentWidth}, ${this.parentHeight}`);
          let padding = await commonUtilsIos.componentPadding(this.jsonObjects, defaultObj);
          let margin = await commonUtilsIos.componentMargin(this.jsonObjects, defaultObj);
          let mainAlignment = this.jsonObjects["mainAlignment"] ?? defaultObj["mainAlignment"];
          let crossAlignment = this.jsonObjects["crossAlignment"] ?? defaultObj["crossAlignment"];
          let alignment = "";
          let backgroundImageUrl = this.jsonObjects["url"];
          let imageSize = await commonUtils.fetchImageResolution(backgroundImageUrl, commonUtils.screenSizeIphone().width, commonUtils.screenSizeIphone().height);
          if (mainAlignment === "align_left" || crossAlignment === "align_left") {
               alignment = alignment + "VStack (alignment: .leading)";
          } else if (mainAlignment === "align_right" || crossAlignment === "align_right") {
               alignment = alignment + "VStack (alignment: .trailing)";
          } else if (mainAlignment === "align_center" || crossAlignment === "align_center") {
               alignment = alignment + "VStack (alignment: .center)";
          } else {
               alignment = alignment + "VStack (alignment: .center)";
          }

          if (this.parantType === "QStack") {
               await readWriteFile.writeToFile(this.fileName,
                    ' '.repeat(this.startingColum) + 'VStack { \n'
               );
          }

          await readWriteFile.writeToFile(this.fileName,
               ' '.repeat(this.startingColum) + `${alignment} { \n` +
               ' '.repeat(this.startingColum + 1) + `${pageName}() \n`
          ).then(async content => {
               if (content == 'success') {
                    await readWriteFile.writeToFile(pagePath, "import SwiftUI \n\n" +
                              "struct " + `${pageName}` + ": View { \n" +
                              ' '.repeat(1) + `let backgroundURL = \"${backgroundImageUrl}\" \n` +
                              ' '.repeat(1) + `let imageSize = CGSize(width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.screenSizeIphone().width}, width: ${imageSize.width}), height: (${imageSize.height} * QUtility.convertedWidth(refaranceWidth: ${commonUtils.screenSizeIphone().width}, width: ${imageSize.width})) / ${commonUtils.screenSizeIphone().width}) \n\n` +
                              ' '.repeat(1) + `var body: some View { \n` +
                              ' '.repeat(2) + "ScrollView { \n" +
                              ' '.repeat(3) + "GeometryReader { proxy in \n" +
                              ' '.repeat(4) + "let minY = proxy.frame(in: .global).minY \n" +
                              ' '.repeat(4) + "ZStack { \n" +
                              ' '.repeat(5) + "VStack { \n" +
                              ' '.repeat(6) + "QCustomAsyncImageView(urlString: backgroundURL, imageSize: imageSize) \n" +
                              ' '.repeat(7) + ".scaleEffect(1.5) \n" +
                              ' '.repeat(7) + ".offset(y: -minY / 15) \n" +
                              ' '.repeat(5) + "} \n" +
                              ' '.repeat(5) + ".frame(width: imageSize.width, height: imageSize.height) \n\n" +
                              ' '.repeat(5) + "VStack { \n"
                    );

                    await this.parsePage(7, pagePath, this.jsonObjects['children'], 
                         (widthHeight.width ?? this.parentWidth) - (padding.paddingLeft + padding.paddingRight + margin.marginLeft + margin.marginRight), 
                         (widthHeight.height ?? this.parentHeight) - (padding.paddingTop + padding.paddingBottom + margin.marginTop + margin.marginBottom), 
                         mainAlignment, crossAlignment);
                    
                    await readWriteFile.writeToFile(pagePath, "\n" +
                              ' '.repeat(5) + "} \n" +
                              ' '.repeat(5) + ".offset(y: -minY / 12) \n" +
                              ' '.repeat(4) + "} \n" +
                              ' '.repeat(3) + "} \n" +
                              ' '.repeat(2) + "} \n" +
                              ' '.repeat(1) + "} \n" +
                              "} \n"
                    );

                    await this.endFile(this.fileName, this.startingColum, this.jsonObjects, imageSize);
               }
          });
     }
     
     async parsePage(startingColum, fileName, jsonObjects, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment) {   
          for (const index in jsonObjects) {
               var jsonObj = jsonObjects[index];
               // console.log(`index: ${index} object type: ${jsonObj["type"]}`);
               await createPageDesign.pageDesign(startingColum + 1, fileName, jsonObj, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, "QParallax");
          }
     }
     
     async endFile(pageName, startingColum, jsonObjects, imageSize) {
          let defaultObj = await commonDefault.getDefaultObject();
          let frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.screenSizeIphone().width}, width: ${imageSize.width}), height: (${imageSize.height} * QUtility.convertedWidth(refaranceWidth: ${commonUtils.screenSizeIphone().width}, width: ${imageSize.width})) / ${commonUtils.screenSizeIphone().width}, alignment: .center`;
          let padding = await commonUtilsIos.componentPadding(jsonObjects, defaultObj);
          let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
          let shadow = await commonUtilsIos.componentShadow(jsonObjects);
          let borderView = await commonUtilsIos.customBorderView(jsonObjects);
          let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
          await readWriteFile.writeToFile(pageName, "\n" +
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
     ParserParallax
}

