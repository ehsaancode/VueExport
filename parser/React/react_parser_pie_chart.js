const readWriteFile = require("../../utility/read_write_file");
// const defaultParseImage = require("../Common/parse_default_image");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_react");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper");

class ParsePieChart {
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

  async parsePieChart() {
    console.log("Pie chart render")
    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);

    let defaultObject = {};
    await commonUtilsReact.generateJSX({
      componentName: "QPieChart",
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
  ParsePieChart,
}; 