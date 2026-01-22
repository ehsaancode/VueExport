const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_react");
const getOnClickProps = require("./onClickHandler");
const routesController = require("./react_parser_routes");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper");
const projectMetadata = require("../../utility/project_metadata");
const path = require("path");

class ParserNSection {
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

  async parseNSection() {
    await reactJsMapper.startReactjsMapper(
      this.projectId,
      this.pageId,
      this.fileName,
      this.jsonObjects["id"]
    );
    const cmsPageId = this.jsonObjects?.editorSettings?.cmsPageId;

    // condition should just check cmsPageId is valid
    if (cmsPageId && cmsPageId > 0) {
      let componentName = await commonUtilsReact.getComponentNameByPageId(
        cmsPageId
      );

      const metadata = projectMetadata.getInstance();
      const lastComponent = path.basename(this.fileName);
      metadata.importFiles = {
        key: lastComponent,
        value: `import ${componentName} from \"../../../components/${componentName}/${componentName}_index\"\n`,
      };

      /*await readWriteFile.replaceWordInFile(
        this.fileName,
        "[import_files]",
        `import ${componentName} from \"../../components/${componentName}/${componentName}_index\"\n[import_files]`
      );*/
      // inject actual variable name
      // await readWriteFile.writeToFile(this.fileName, `\n<${componentName}/>\n`);
      await readWriteFile.writeToFile(
        this.fileName,
        " ".repeat(this.startingColum + 4) + `<${componentName}/>\n` + ""
      );
    }else {
         await commonUtilsReact.generateJSX({
              componentName: "QDiv",
              isSelfClosing: false,
              props: await commonUtilsReact.componentProps(
                this.jsonObjects,
                '',
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
      
    }



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
  
          this.parantType === "QHMenuItem" ? "QHMenuItem" : this.parantType !== "QFormItem" ? "QDiv" : this.parantType,
          '',
          this.parantType !== "QFormItem" ? this.jsonObjects?.id : this.parentId
        );
      }
    }
  
    async endFile(pageName, startingColumn) {
      await readWriteFile.writeToFile(
        pageName,
        "\n" + " ".repeat(startingColumn + 1) + "</QDiv>\n" + ""
      );
    }

}

module.exports = {
  // parserAccordionItem,
  ParserNSection,
};
