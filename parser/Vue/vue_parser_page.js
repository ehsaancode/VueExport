const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const commonUtilsReact = require("./common_utilits_vue");

class ParserPage {
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

  async parsePage() {
    await readWriteFile.writeToFile(
      this.fileName,
      "\n" +
        " ".repeat(this.startingColum + 1) +
        "<RouterView />\n" +
        ""
    );
  }
}

module.exports = {
  ParserPage,
};
