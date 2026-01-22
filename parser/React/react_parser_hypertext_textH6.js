const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_react");
const defaultParseParagraphH6 = require("../Common/parse_default_texth6");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper");


class ParseHyperTextH6 {
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

  replaceNewlinesWithBreaks(text) {
    return text.replace(/\n/g, "<br>");
  }

  async parserHyperTextH6() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    let defaultObject =
      (await defaultParseParagraphH6.getDefaultObject(
        this.jsonObjects["type"]
      )) ?? "";

    await commonUtilsReact.generateJSX({
      componentName: "QTextH6",
      isSelfClosing: true,
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
    await reactJsMapper.endReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
  }
}

module.exports = {
  ParseHyperTextH6,
};
