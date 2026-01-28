
const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const defaultParseRow = require("../Common/parse_default_row");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");


class ParserRepeat {
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

  async parseRepeat() {
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);
    let defaultObject = await defaultParseRow.getDefaultObject();

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
      componentName: "QRepeat",
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
      this.startingColum + 4,
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
      if (index == 0) { // runs only once for the first element
        var jsonObj = jsonObjects[index];
        await createPageDesign.pageDesign(
          this.projectId,
          this.pageId,
          startingColumn,
          fileName,
          jsonObj,
          parentWidth,
          parentHeight,
          this.isAbsoluteValue,
          "QRepeat"
        );
      }

    }
  }   

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QRepeat></QDiv>\n" + ""
    );
  }
}

module.exports = {
  //parseRow,
  ParserRepeat,
};
