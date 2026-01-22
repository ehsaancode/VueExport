const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./create_page_design");
const commonDefault = require("../Common/parse_default_table_wrapper");
const commonUtilsIos = require("./common_utilits_ios");
const commonUtils = require("../../utility/common_utils");
const parserAnimations = require("./parser_animations");

class ParserTableWrapper {
  constructor(
    startingColum,
    fileName,
    jsonObjects,
    parentWidth,
    parentHeight,
    parantMainAlignment,
    parantCrossAlignment,
    parantType
  ) {
    this.startingColum = startingColum;
    this.fileName = fileName;
    this.jsonObjects = jsonObjects;
    this.parentWidth = parentWidth;
    this.parentHeight = parentHeight;
    this.parantMainAlignment = parantMainAlignment;
    this.parantCrossAlignment = parantCrossAlignment;
    this.parantType = parantType;
  }

  async parseTableWrapper() {
    let defaultObj = await commonDefault.getDefaultObject();
    let widthHeight = await commonUtils.getComponentWidthHeight(
      this.jsonObjects,
      defaultObj ?? "",
      this.parentWidth,
      this.parentHeight,
      false,
      false,
      true
    );
    let padding = await commonUtilsIos.componentPadding(
      this.jsonObjects,
      defaultObj ?? ""
    );
    let margin = await commonUtilsIos.componentMargin(
      this.jsonObjects,
      defaultObj ?? ""
    );
    let mainAlignment =
      this.jsonObjects["mainAlignment"] ??
      this.parantMainAlignment ??
      defaultObj["mainAlignment"];
    let crossAlignment =
      this.jsonObjects["crossAlignment"] ??
      this.parantCrossAlignment ??
      defaultObj["crossAlignment"];
    let alignment = "";
    if (crossAlignment === "align_top") {
      // alignment = alignment + "alignment: .leading";
      alignment = alignment + "VStack (alignment: .top)";
    } else if (crossAlignment === "align_bottom") {
      // alignment = alignment + "alignment: .trailing";
      alignment = alignment + "VStack (alignment: .bottom)";
    } else if (crossAlignment === "align_center") {
      // alignment = alignment + "alignment: .center";
      alignment = alignment + "VStack (alignment: .center)";
    } else {
      // alignment = alignment + "alignment: .leading";
      alignment = alignment + "VStack";
    }

    if (this.parantType === "QStack") {
      await readWriteFile.writeToFile(
        this.fileName,
        " ".repeat(this.startingColum) + "VStack { \n"
      );
    }

    await readWriteFile
      .writeToFile(
        this.fileName,
        // ' '.repeat(this.startingColum) + `HStack (${alignment}) { \n`
        " ".repeat(this.startingColum) + `${alignment} { \n`
      )
      .then(async (content) => {
        if (content == "success") {
          await this.parsePage(
            this.startingColum,
            this.fileName,
            this.jsonObjects["children"],
            (widthHeight.width ?? this.parentWidth) -
              (padding.paddingLeft +
                padding.paddingRight +
                margin.marginLeft +
                margin.marginRight),
            (widthHeight.height ?? this.parentHeight) -
              (padding.paddingTop +
                padding.paddingBottom +
                margin.marginTop +
                margin.marginBottom),
            mainAlignment,
            crossAlignment
          );
          await this.endFile(
            this.fileName,
            this.startingColum,
            this.jsonObjects
          );
        }
      });
  }

  async parsePage(
    startingColum,
    fileName,
    jsonObjects,
    parentWidth,
    parentHeight,
    parantMainAlignment,
    parantCrossAlignment
  ) {
    for (const index in jsonObjects) {
      var jsonObj = jsonObjects[index];
      // console.log(`index: ${index} object type: ${jsonObj["type"]}`);
      await createPageDesign.pageDesign(
        startingColum + 1,
        fileName,
        jsonObj,
        parentWidth,
        parentHeight,
        parantMainAlignment,
        parantCrossAlignment,
        "QTableWrapper"
      );
      await readWriteFile.writeToFile(fileName, "\n");
      if (
        parantMainAlignment === "space_between" &&
        index < jsonObjects.length - 1
      ) {
        await readWriteFile.writeToFile(
          fileName,
          " ".repeat(startingColum) +
            "Spacer()" +
            " ".repeat(startingColum) +
            "\n\n"
        );
      }
    }
  }

  async endFile(pageName, startingColum, jsonObjects) {
    let defaultObj = (await commonDefault.getDefaultObject()) ?? "";
    let mainAlignment =
      jsonObjects["mainAlignment"] ??
      defaultObj["mainAlignment"] ??
      this.parantMainAlignment;
    let crossAlignment =
      jsonObjects["crossAlignment"] ??
      defaultObj["crossAlignment"] ??
      this.parantCrossAlignment;
    let frame = await commonUtilsIos.componentFrame(
      jsonObjects,
      defaultObj,
      this.parentWidth,
      this.parentHeight,
      mainAlignment,
      crossAlignment,
      false,
      true
    );
    let padding = await commonUtilsIos.componentPadding(
      jsonObjects,
      defaultObj
    );
    let margin = await commonUtilsIos.componentMargin(jsonObjects, defaultObj);
    let shadow = await commonUtilsIos.componentShadow(jsonObjects);
    let cornerRadius = await commonUtilsIos.componentCornerRadius(jsonObjects);
    let borderView = await commonUtilsIos.customBorderView(jsonObjects);
    let background = await commonUtilsIos.componentBackground(
      startingColum,
      jsonObjects,
      defaultObj,
      borderView,
      this.parentWidth,
      this.parentHeight,
      false,
      true
    );
    await readWriteFile.writeToFile(
      pageName,
      "\n" +
        " ".repeat(startingColum) +
        "}\n" +
        " ".repeat(startingColum) +
        `.padding(.leading, ${
          !isNaN(parseFloat(padding.paddingLeft)) ? padding.paddingLeft : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `.padding(.trailing, ${
          !isNaN(parseFloat(padding.paddingRight)) ? padding.paddingRight : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `.padding(.top, ${
          !isNaN(parseFloat(padding.paddingTop)) ? padding.paddingTop : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `.padding(.bottom, ${
          !isNaN(parseFloat(padding.paddingBottom))
            ? padding.paddingBottom
            : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `${cornerRadius}` +
        " ".repeat(startingColum) +
        `.frame(${frame})\n` +
        " ".repeat(startingColum) +
        `${background}` +
        " ".repeat(startingColum) +
        `${shadow}` +
        " ".repeat(startingColum) +
        `.padding(.leading, ${
          !isNaN(parseFloat(margin.marginLeft)) ? margin.marginLeft : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `.padding(.trailing, ${
          !isNaN(parseFloat(margin.marginRight)) ? margin.marginRight : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `.padding(.top, ${
          !isNaN(parseFloat(margin.marginTop)) ? margin.marginTop : 0.0
        })\n` +
        " ".repeat(startingColum) +
        `.padding(.bottom, ${
          !isNaN(parseFloat(margin.marginBottom)) ? margin.marginBottom : 0.0
        })\n`
    );

    if (this.parantType === "QStack") {
      await readWriteFile.writeToFile(
        pageName,
        " ".repeat(startingColum) + "} \n"
      );
      let positioned = await commonUtilsIos.componentStackPositioned(
        jsonObjects,
        startingColum
      );
      await readWriteFile.writeToFile(
        pageName,
        " ".repeat(startingColum) + `${positioned}\n`
      );
    }

    let jsonOnClick = jsonObjects["onClick"];
    if (jsonOnClick != undefined) {
      let action = jsonOnClick["action"];
      if (action != undefined && action == "Navigate to") {
        let destination = jsonOnClick["destination"];
        if (destination != undefined) {
          let actionFilePath = await commonUtilsIos.actionFilePath();
          await readWriteFile.writeToFile(
            actionFilePath,
            "" + `, ${destination}`
          );

          await readWriteFile.writeToFile(
            pageName,
            " ".repeat(startingColum) +
              `.onTapGesture { \n` +
              " ".repeat(startingColum + 1) +
              `onTapAction?(.${destination}) \n` +
              " ".repeat(startingColum) +
              `} \n`
          );
        }
      }
    }

    let componentId = jsonObjects["id"];
    let animationObj = jsonObjects["AnimationsData"] ?? [];
    await parserAnimations.parseAnimation(
      startingColum,
      pageName,
      animationObj,
      componentId
    );
  }
}

module.exports = {
  ParserTableWrapper,
};
