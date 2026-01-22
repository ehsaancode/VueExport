const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const defaultParseRow = require("../Common/parse_default_row");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_react");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper");


class ParserRow {
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

  async parseRow() {
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

    await commonUtilsReact.generateJSX({
      componentName: "QRow",
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
         this.parantType == "QHMenuItem" ? "QHMenuItem" : (this.parantType == "QFormItem" || this.parantType == "QForm") ? this.parantType : "QRow",
        '',
        (this.parantType == "QFormItem" || this.parantType == "QForm") ? this.parentId : this.jsonObjects?.id 
    
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QRow>\n" + ""
    );
  }
}

module.exports = {
  //parseRow,
  ParserRow,
};
