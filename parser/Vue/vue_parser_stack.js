const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const defaultParseStack = require("../Common/parse_default_stack");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");


class ParserStack {
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

  async parseStack() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    let defaultObject = (await defaultParseStack.getDefaultObject()) ?? "";

    let height = await commonUtilsReact.componentFrameHeight(
      this.jsonObjects,
      (await defaultParseStack.getDefaultObject()) ?? "",
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );
    let width = await commonUtilsReact.componentFrameWidth(
      this.jsonObjects,
      (await defaultParseStack.getDefaultObject()) ?? "",
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );

    await commonUtilsReact.generateVueTemplate({
      componentName: "QStack",
      isSelfClosing: false,
      props: await commonUtilsReact.componentProps(
        this.jsonObjects,
        defaultObject,
        this.parentWidth,
        this.parentHeight,
        this.parantType,
        this.isAbsoluteValue
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
      // console.log(`parentHeight: ${parentHeight}`);
      var jsonObj = jsonObjects[index];
      await createPageDesign.pageDesign(
        this.projectId,
        this.pageId,
        startingColumn,
        fileName,
        jsonObj,
        parentWidth,
        parentHeight,
        true,
        "QStack"
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QStack>\n" + ""
    );
  }
}

module.exports = {
  // parseStack,
  ParserStack,
};
