const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtilsReact = require("./common_utilits_vue");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");
const commonUtils = require("../../utility/common_utils");
const tableMetadata = require("../../utility/table_metadata");

class ParserTableRow {
  constructor(
    projectId = 0,
    pageId = 0,
    startingColum,
    fileName,
    jsonObjects,
    parentWidth,
    parentHeight,
    isAbsoluteValue,
    parantType,
    commonStyle
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
    this.commonStyle = commonStyle;
  }

  async parseTableRow() {
    const metadata = tableMetadata.getInstance();
    // await reactJsMapper.startReactjsMapper(
    //   this.projectId,
    //   this.pageId,
    //   this.fileName,
    //   this.jsonObjects["id"]
    // );
    let defaultObject = "";

    let height = await commonUtilsReact.componentFrameHeight(
      this.jsonObjects,
      defaultObject,
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );
    let width = await commonUtilsReact.componentFrameWidth(
      this.jsonObjects,
      defaultObject,
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );

    if (metadata.tableType === "customDynamic" || metadata.tableType === "dataTable") {
      const widgetId =
        metadata.tableType === "customDynamic"
          ? metadata.tableRowsId
          : metadata.tableWidgetId;

      await readWriteFile.writeToFile(
        this.fileName,
        "\n" +
        " ".repeat(1) +
        `<QRepeat widgetId="${widgetId}">\n`
      );
    }

    await commonUtilsReact.generateVueTemplate({
      componentName: "QTableRow",
      isSelfClosing: false,
      props: await commonUtilsReact.componentProps(
        this.jsonObjects,
        defaultObject,
        this.parentWidth,
        this.parentHeight,
        this.parantType,
        this.isAbsoluteValue,
        this.commonStyle
      ),
      startingIndent: this.startingColum,
      fileName: this.fileName,
      writeToFile: true,
    });

    await this.parsePage(
      this.startingColum + 3,
      this.fileName,
      this.jsonObjects["children"],
      width ?? this.parentWidth,
      height ?? this.parentHeight
    );
    await this.endFile(this.fileName, this.startingColum);
    if (metadata.tableType == "customDynamic" || metadata.tableType == "dataTable") {
      await readWriteFile.writeToFile(
        this.fileName,
        "\n" + " ".repeat(this.startingColum + 1) + `</QRepeat>\n` + ""
      );
    }
    // await reactJsMapper.endReactjsMapper(
    //   this.projectId,
    //   this.pageId,
    //   this.fileName,
    //   this.jsonObjects["id"]
    // );
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
        this.parantType === "QHMenuItem" ? "QHMenuItem" : "QTableRow",
        jsonObj?.widgetDefaultData?.style?.widgetSpecialStyle?.commonStyle ?? {}
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QTableRow>\n" + ""
    );
  }
}

module.exports = {
  ParserTableRow,
};
