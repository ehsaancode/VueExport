const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactStyleProps = require("./vue_style_props");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");

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
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
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
      `<QHMenuItem

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
      `>\n  <QMenu 
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

    componentJSX = " ".repeat(this.startingColum) + `</QMenu>\n`;

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

        componentJSX =
          " ".repeat(this.startingColum) +
          `<QSubMenu  
        id="${this.jsonObjects["id"]}"
        left="${allSame ? "0" : ""}"
        isOpen={openMenus["${this.jsonObjects["id"]}"]}
        onMouseEnter={() => handleMouseEnter("${
          jsonObj[`id`]
        }",[${await commonUtilsReact.getParentIds()}])}

        onMouseLeave={() => handleMouseLeave("${jsonObj[`id`]}")}
        >\n <QHMenuItem> `;
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
          " ".repeat(this.startingColum) + `</QHMenuItem></QSubMenu>\n  `;
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
    await reactJsMapper.endReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
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
      "\n" + " ".repeat(startingColumn + 1) + "</QHMenuItem>\n" + ""
    );
  }
}

module.exports = {
  // parserAccordionItem,
  ParserHMenuItem,
};
