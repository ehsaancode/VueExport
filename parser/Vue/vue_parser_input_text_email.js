const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const defaultParseFloatingButton = require("../Common/parse_default_floating_button");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");

class ParserInputTextEmail {
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

  async parseInputTextEmail() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    await commonUtilsReact.generateVueTemplate({
      componentName: "QInputEmail",
      isSelfClosing: false,
      props: await commonUtilsReact.componentProps(
        this.jsonObjects,
        "",
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
      await createPageDesign.pageDesign(
        this.projectId,
        this.pageId,
        startingColumn,
        fileName,
        jsonObj,
        parentWidth > 0 ? parentWidth : this.parentWidth,
        parentHeight > 0 ? parentHeight : this.parentHeight,
        this.isAbsoluteValue,
        "QInputTextEmail"
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QInputEmail>\n" + ""
    );
  }
}

module.exports = {
  ParserInputTextEmail,
};
