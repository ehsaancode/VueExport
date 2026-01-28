const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const defaultParseTableWrapper = require("../Common/parse_default_table_wrapper");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");
const tableMetadata = require("../../utility/table_metadata");

class ParserTable {
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

  async parseTable() {
    const metadata = tableMetadata.getInstance();
    await commonUtils.tableWidgetInfo(this.jsonObjects);
    console.log("tableType2", metadata.tableType);

    // await reactJsMapper.startReactjsMapper(
    //   this.projectId,
    //   this.pageId,
    //   this.fileName,
    //   this.jsonObjects["id"]
    // );
    let defaultObject =
      (await defaultParseTableWrapper.getDefaultObject()) ?? "";

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

    await commonUtilsReact.generateVueTemplate({
      componentName: "QTable",
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
        this.parantType === "QHMenuItem" ? "QHMenuItem" : "QTable",
        jsonObj?.widgetDefaultData?.style?.widgetSpecialStyle?.commonStyle ?? {}
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QTable>\n" + ""
    );
  }
}

module.exports = {
  ParserTable,
};
