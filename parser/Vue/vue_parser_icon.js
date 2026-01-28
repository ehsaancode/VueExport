const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const defaultParseIcon = require("../Common/parse_default_icon");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");

class ParserIcon {
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
    parentId
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
    this.parentId= parentId;
  }

  async parseIcon() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    let defaultObject = (await defaultParseIcon.getDefaultObject()) ?? "";

    await commonUtilsReact.generateVueTemplate({
      componentName: "QIcon",
      isSelfClosing: true,
      props: await commonUtilsReact.componentProps(
        this.jsonObjects,
        defaultObject,
        this.parentWidth,
        this.parentHeight,
        this.parantType,
        this.isAbsoluteValue,
        "",
        this.projectId, 
        this.pageId, 
        this.parentId
      ),
      startingIndent: this.startingColum,
      fileName: this.fileName,
      writeToFile: true,
    });
    await reactJsMapper.endReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
  }
}

module.exports = {
  // parseIcon,
  ParserIcon,
};
