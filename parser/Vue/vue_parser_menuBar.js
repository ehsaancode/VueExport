const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactStyleProps = require("./vue_style_props");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");


class ParserMenuBar {
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

  async parseMenuBar() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
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
        key: "alignment",
        value: this.jsonObjects["alignment"],
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
      `<QMenuBar

     setOpenMenus={setOpenMenus}

      @mouseenter="handleMouseLeave('')"
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
        componentJSX +=
          " ".repeat(this.startingColum + 2) + `${prop.key}="${prop.value}"\n`;
      }
    });

    // Close the component tag
    componentJSX += " ".repeat(this.startingColum) + ">\n";

    // Write the JSX into the file
    await readWriteFile.writeToFile(this.fileName, componentJSX);

    await this.parsePage(
      this.startingColum + 3,
      this.fileName,
      this.jsonObjects["children"],
      this.parentWidth,
      this.parentHeight
    );

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
      await commonUtilsReact.setParentId(await jsonObj[`id`]);
      await commonUtilsReact.resetParentIds();
      await commonUtilsReact.setParentIds(await commonUtilsReact.getParentId());
      // console.log(`*********** parent id: ${await commonUtilsReact.getParentId()}`);
      await createPageDesign.pageDesign(
        this.projectId,
        this.pageId,
        startingColumn,
        fileName,
        jsonObj,
        parentWidth > 0 ? parentWidth : this.parentWidth,
        parentHeight > 0 ? parentHeight : this.parentHeight,
        this.isAbsoluteValue,
        "QMenuBar"
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QMenuBar>\n" + ""
    );
  }
}

module.exports = {
  // parserAccordionItem,
  ParserMenuBar,
};
