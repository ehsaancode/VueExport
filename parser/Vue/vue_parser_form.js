const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const defaultParseFloatingButton = require("../Common/parse_default_floating_button");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/vuejs/vuejs_mapper");
const FormMetada = require("../../utility/form_metadata");

class ParserForm {
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

  async parseForm() {
    const widgetDefaultData = this.jsonObjects["widgetDefaultData"] ?? "";
    const style = widgetDefaultData?.style ?? "";
    const widgetSpecialStyle = style?.widgetSpecialStyle ?? "";
    const formData = widgetSpecialStyle?.formData ?? "";
    const formInput = formData?.formInput ?? "";
    if (formInput !== "") {
      const formInputsObject = JSON.parse(formInput);
      const cms_form_Id = formInputsObject?.cms_form_Id ?? "";
      if (cms_form_Id !== "") {
        const widgetId = this.jsonObjects["id"];
        let formMetadaObj = {
          widgetId: widgetId,
          cms_form_Id: cms_form_Id,
        };
        const refFormMetada = FormMetada.getInstance();
        refFormMetada.formMetadata = {
          key: String(`${cms_form_Id}`),
          value: formMetadaObj,
        };
      }
    }
    await reactJsMapper.startReactjsMapper(
      this.projectId,
      this.pageId,
      this.fileName,
      this.jsonObjects["id"]
    );
    await commonUtilsReact.generateVueTemplate({
      componentName: "QForm",
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
    await reactJsMapper.endReactjsMapper(
      this.projectId,
      this.pageId,
      this.fileName,
      this.jsonObjects["id"]
    );
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
        "QForm",
        "",
        this.jsonObjects.id
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QForm>\n" + ""
    );
  }
}

module.exports = {
  ParserForm,
};
