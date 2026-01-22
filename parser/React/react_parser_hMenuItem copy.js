const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_react");
const getOnClickProps = require("./onClickHandler");
const reactStyleProps = require("./react_style_props");

class ParserHMenuItem {
  constructor(
    projectId = 0,
    pageId = 0,
    startingColum,
    fileName,
    jsonObjects,
    parentWidth,
    parentHeight,
    isAbsoluteValue,
    parantType
  ) {
    this.projectId = projectId;
    this.pageId = pageId;
    this.startingColum = startingColum;
    this.fileName = fileName;
    this.jsonObjects = jsonObjects;
    this.parentWidth = parentWidth;
    this.parentHeight = parentHeight;
    this.isAbsoluteValue = isAbsoluteValue;
    this.parantType = parantType;
  }

  async parseHMenuItem() {
    let height = await commonUtilsReact.componentFrameHeight(
      this.jsonObjects,
      "",
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );
    let width = await commonUtilsReact.componentFrameWidth(
      this.jsonObjects,
      "",
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );

    const { onClick, action, navigation } = await getOnClickProps(
      this.jsonObjects
    );

    await reactStyleProps.styleProps(
      this.jsonObjects.widgetDefaultData.style ?? "",
      "",
      this.jsonObjects["type"]
    );

    let componentProps = [
      { key: "onClick", value: onClick },
      { key: "action", value: action },
      { key: "navigation", value: navigation },
      {
        key: "isAbsoluteValue",
        value: this.parantType === "QStack" ? true : false,
      },

      // { key: "positionedLeft", value: this.jsonObjects["positionedLeft"] ?? "" },
      // { key: "positionedRight", value: this.jsonObjects["positionedRight"] ?? "" },
      // { key: "positionedTop", value: this.jsonObjects["positionedTop"] ?? "" },
      // { key: "positionedBottom", value: this.jsonObjects["positionedBottom"] ?? "" },

      // {
      //   key: "widthType",
      //   value:
      //     this.jsonObjects["widthType"] ,
      // },
      // {
      //   key: "heightType",
      //   value:
      //     this.jsonObjects["heightType"] ,
      // },
      // {
      //   key: "headerText",
      //   value:
      //     this.jsonObjects["text"]
      // },
      // { key: "bgColor", value: this.jsonObjects["bgColor"] ?? (await defaultParseAccordion.getDefaultValue('bgColor') || "") },
      // {
      //   key: "borderRadius",
      //   value:
      //     this.jsonObjects["borderRadius"]
      // },
      //  { key: "borderColor", value: this.jsonObjects["borderColor"] ?? (await defaultParseAccordion.getDefaultValue('borderColor') || "") },
      // {
      //   key: "borderWidth",
      //   value:
      //     this.jsonObjects["borderWidth"]
      // },
      //  { key: "color", value: this.jsonObjects["color"] ?? (await defaultParseAccordion.getDefaultValue('color') || "") },
      // {
      //   key: "fontSize",
      //   value:
      //     this.jsonObjects["fontSize"]
      // },

      // {
      //   key: "fontFamily",
      //   value:
      //     this.jsonObjects["fontFamily"]
      // },
      // {
      //   key: "fontStyle",
      //   value:
      //     this.jsonObjects["fontStyle"]
      // },
      // {
      //   key: "fontWeight",
      //   value:
      //     this.jsonObjects["fontWeight"]
      // },
      // {
      //   key: "textAlign",
      //   value:
      //     this.jsonObjects["textAlign"]
      // },
      // {
      //   key: "crossAlignment",
      //   value:
      //     this.jsonObjects["crossAlignment"]
      // },
      // {
      //   key: "bgUrl",
      //   value:
      //     this.jsonObjects["url"]
      // },
      // {
      //   key: "isImageFill",
      //   value:
      //     this.jsonObjects["isImageFill"]
      // },
      // {
      //   key: "shadowBlurRadius",
      //   value:
      //     this.jsonObjects["shadowBlurRadius"]
      // },
      // {
      //   key: "shadowOffsetX",
      //   value:
      //     this.jsonObjects["shadowOffsetX"]
      // },
      // {
      //   key: "shadowOffsetY",
      //   value:
      //     this.jsonObjects["shadowOffsetY"]
      // },
      // {
      //   key: "shadowSpreadRadius",
      //   value:
      //     this.jsonObjects["shadowSpreadRadius"]
      // },
      // {
      //   key: "mainAlignment",
      //   value:
      //     this.jsonObjects["mainAlignment"]
      // },
      // {
      //   key: "alignment",
      //   value:
      //     this.jsonObjects["alignment"]
      // },

      {
        key: "animateType",
        value: this.jsonObjects["animateType"],
      },
      {
        key: "divCount",
        value: this.jsonObjects["divCount"],
      },
    ];

    componentProps = componentProps.concat(
      await reactStyleProps.getStyleProps()
    );
    componentProps.push({
      key: "tailwaindClasses",
      value: (await reactStyleProps.getTailwaindClasses())?.trim(),
    });

    let componentJSX =
      " ".repeat(this.startingColum) +
      `<HMenuItem

        onMouseEnter={() => handleTopMenuEnter("")}
    \n`;

    // Add dynamic properties to the JSX
    componentProps.forEach((prop) => {
      if (
        prop.value === undefined ||
        prop.value === "undefined" ||
        prop.value === null ||
        (typeof prop.value === "string" && prop.value.trim() === "")
      ) {
        return;
      } else {
        if (prop.key === "width" || prop.key === "height") {
          if (prop.value == "") {
            componentJSX +=
              " ".repeat(this.startingColum + 2) +
              `${prop.key}="${prop.value}"\n`;
          } else {
            componentJSX +=
              " ".repeat(this.startingColum + 2) +
              `${prop.key}=${prop.value}\n`;
          }
        } else {
          componentJSX +=
            " ".repeat(this.startingColum + 2) +
            `${prop.key}="${prop.value}"\n`;
        }
      }
    });

    await commonUtilsReact.setParentIds(`${this.jsonObjects["id"]}`);
    // Close the component tag
    componentJSX +=
      " ".repeat(this.startingColumn) +
      `>\n  <Menu 
    id="${this.jsonObjects["id"]}"
    
            onMouseEnter={() => handleMouseEnter("${
              this.jsonObjects[`id`]
            }",[${await commonUtilsReact.getParentIds()}])}

    
    >\n  `;

    await readWriteFile.writeToFile(this.fileName, componentJSX);
    await this.parsePage(
      this.startingColum + 3,
      this.fileName,
      this.jsonObjects["children"],
      width ?? this.parentWidth,
      height ?? this.parentHeight
    );

    componentJSX = " ".repeat(this.startingColum) + `</Menu>\n`;

    await readWriteFile.writeToFile(this.fileName, componentJSX);

    for (const index in this.jsonObjects["dChildren"]) {
      var jsonObj = this.jsonObjects["dChildren"][index];
      if (jsonObj["children"]?.length > 0 || jsonObj["dChildren"]?.length > 0) {
        const parentIds = await commonUtilsReact.getParentIds();

        // Ensure it's an array
        const ids = Array.isArray(parentIds)
          ? parentIds
          : String(parentIds).split(",");
        const allSame = ids.every((id) => id === ids[0]);

        const width = Number(this.jsonObjects["width"]);
        const padding = Number(
          (this.jsonObjects["padding"] || "0px").replace("px", "")
        );

        const top = Number((jsonObj["paddingTop"] || "0px").replace("px", ""));
        const bottom = Number(
          (jsonObj["paddingBottom"] || "0px").replace("px", "")
        );

        componentJSX =
          " ".repeat(this.startingColum) +
          `<SubMenu  
        id="${this.jsonObjects["id"]}"
        left="${allSame ? "0" : width + padding}"
        top="${top + bottom}"
        isOpen={openMenus["${this.jsonObjects["id"]}"]}
        onMouseEnter={() => handleMouseEnter("${
          jsonObj[`id`]
        }",[${await commonUtilsReact.getParentIds()}])}

        onMouseLeave={() => handleMouseLeave("${jsonObj[`id`]}")}
        >\n <HMenuItem> `;
        await readWriteFile.writeToFile(this.fileName, componentJSX);

        await createPageDesign.pageDesign(
          this.projectId,
          this.pageId,
          this.startingColumn,
          this.fileName,
          jsonObj,
          this.parentWidth,
          this.parentHeight,
          this.isAbsoluteValue,
          "QHMenuItem"
        );

        componentJSX =
          " ".repeat(this.startingColum) + `</HMenuItem></SubMenu>\n  `;
        await readWriteFile.writeToFile(this.fileName, componentJSX);

        if (jsonObj["dChildren"]?.length > 0) {
        } else {
          await commonUtilsReact.resetParentIds();
          await commonUtilsReact.setParentIds(
            await commonUtilsReact.getParentId()
          );
        }
      }
    }

    await this.endFile(this.fileName, this.startingColum);
  }

  async parsePage(
    startingColumn,
    fileName,
    jsonObjects,
    parentWidth,
    parentHeight
  ) {
    for (const index in jsonObjects) {
      var jsonObj = jsonObjects[index];
      await createPageDesign.pageDesign(
        this.projectId,
        this.pageId,
        startingColumn,
        fileName,
        jsonObj,
        parentWidth > 0 ? parentWidth : this.parentWidth,
        parentHeight > 0 ? parentHeight : this.parentHeight,
        this.isAbsoluteValue,
        "QHMenuItem"
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</HMenuItem>\n" + ""
    );
  }
}

module.exports = {
  // parserAccordionItem,
  ParserHMenuItem,
};
