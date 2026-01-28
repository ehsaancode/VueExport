const readWriteFile = require("../../utility/read_write_file");
const defaultParseImage = require("../Common/parse_default_image");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");


class ParseBlockImage {
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

  async parseBlockImage() {

    await reactJsMapper.startReactjsMapper(this.projectId, this.pageId, this.fileName, this.jsonObjects["id"]);

    let defaultObject =
      defaultParseImage.getDefaultObject(this.jsonObjects["type"]) ?? "";
      await commonUtilsReact.generateVueTemplate({
      componentName: "QImage",
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
  ParseBlockImage,
};
