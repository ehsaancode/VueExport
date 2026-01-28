const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const defaultParseParagraphH4 = require("../Common/parse_default_texth4");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");


class ParseHyperTextH4 {
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

  async parserHyperTextH4() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    let defaultObject =
      (await defaultParseParagraphH4.getDefaultObject(
        this.jsonObjects["type"]
      )) ?? "";

    await commonUtilsReact.generateVueTemplate({
      componentName: "QTextH4",
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
  ParseHyperTextH4,
};
