const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const defaultParseParagraph = require("../Common/parse_default_text");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");


class ParseBlockText {
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

  replaceNewlinesWithBreaks(text) {
    return text
      .replace(/^"(.*)"$/, "$1") // removes starting and ending quotes
      .replace(/\n/g, "<br/>"); // replaces \n with <br/>
  }

  async parseBlockText() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    let defaultObject =
      (await defaultParseParagraph.getDefaultObject(
        this.jsonObjects["type"]
      )) ?? "";

    const useCase =
      this.jsonObjects?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
        ?.useCase ?? "";

    if (
      this.jsonObjects?.type === "QText" &&
      useCase === 'formValidation'
    ) {
      await commonUtilsReact.generateVueTemplate({
        componentName: "QErrorMessage",
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
          this.parentId,
          'QErrorMessage'
        ),
        startingIndent: this.startingColum,
        fileName: this.fileName,
        writeToFile: true,
        jsonObjects: this.jsonObjects,
      });
    } else {
      //console.log("formInput object is empty");
      await commonUtilsReact.generateVueTemplate({
        componentName: "QParagraph",
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
        jsonObjects: this.jsonObjects,
      });
    }
    await reactJsMapper.endReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
  }
}

module.exports = {
  ParseBlockText,
};
