const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./vue_create_page_design");
const defaultParseDiv = require("../Common/parse_default_div");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_vue");
const getOnClickProps = require("./onClickHandler");
const defaultParseTable = require("../Common/parse_default_table");
const defaultParseInputSearch = require("../Common/parse_default_input_search");
const defaultParseIcon = require("../Common/parse_default_icon");

class ParserTable {
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

  async parseTable() {
    let defaultObject = (await defaultParseTable.getDefaultObject()) ?? "";
    let defaultInputSearchObject =
      (await defaultParseInputSearch.getDefaultObject()) ?? "";
    let defaultIconObject = (await defaultParseIcon.getDefaultObject()) ?? "";

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

    const { onClick, action, navigation } = await getOnClickProps(
      this.jsonObjects
    );

    const formatValue = (val) => {
      return val === undefined || val === null || val === "null" || val === ""
        ? ""
        : val;
    };

    const headers = [];
    const rows = [];

    const tableSettings = this.jsonObjects?.table_payload_settings?.columns; // Each item is a column

    // Step 1: Generate headers
    for (let i = 0; i < tableSettings?.length; i++) {
      const label = tableSettings[i].columnLabel?.trim();

      if (label) {
        let newHeader = {};
        let width = await commonUtilsReact.componentFrameWidth(
          tableSettings[i],
          "",
          "",
          "",
          false
        );
        let height = await commonUtilsReact.componentFrameHeight(
          tableSettings[i],
          "",
          "",
          "",
          false
        );

        newHeader = {
          headerTitle: tableSettings[i].columnLabel?.trim(),
          accessor: tableSettings[i].columnKey?.trim(),
          sort: tableSettings[i].sortable ? "Yes" : "No",
          search: tableSettings[i].searchable ? "Yes" : "No",
          filter: tableSettings[i].filterable ? "Yes" : "No",
          value: "",
          show: tableSettings[i].isHidden === false,

          bgColor: await commonUtils.hexToRgba(
            tableSettings[i].bgColor ??
              this.jsonObjects?.table_payload_settings?.bgColor
          ),

          textAlign: tableSettings[i].textAlign
            ? formatValue(tableSettings[i].textAlign)
            : this.jsonObjects?.table_payload_settings?.textAlign
            ? formatValue(this.jsonObjects?.table_payload_settings?.textAlign)
            : "align_left",

          width:
            width.length > 0
              ? width
              : await commonUtilsReact.componentFrameWidth(
                  this.jsonObjects?.table_payload_settings,
                  "",
                  "",
                  "",
                  false
                ),

          height:
            height.length > 0
              ? height
              : await commonUtilsReact.componentFrameHeight(
                  this.jsonObjects?.table_payload_settings,
                  "",
                  "",
                  "",
                  false
                ),

          color: await commonUtils.hexToRgba(
            tableSettings[i].columnStyle.color
          ),

          fontSize: tableSettings[i].columnStyle.fontSize,
          fontWeight: tableSettings[i].columnStyle.fontWeight,

          fontFamily: tableSettings[i].columnStyle.fontFamily,

          // Conditionally add formatted padding
          ...(tableSettings[i].paddingLeft
            ? { paddingLeft: formatValue(tableSettings[i].paddingLeft) }
            : {}),
          ...(tableSettings[i].paddingTop
            ? { paddingTop: formatValue(tableSettings[i].paddingTop) }
            : {}),
          ...(tableSettings[i].paddingRight
            ? { paddingRight: formatValue(tableSettings[i].paddingRight) }
            : {}),
          ...(tableSettings[i].paddingBottom
            ? { paddingBottom: formatValue(tableSettings[i].paddingBottom) }
            : {}),

          // Conditionally add formatted margin
          ...(tableSettings[i].marginLeft
            ? { marginLeft: formatValue(tableSettings[i].marginLeft) }
            : {}),
          ...(tableSettings[i].marginTop
            ? { marginTop: formatValue(tableSettings[i].marginTop) }
            : {}),
          ...(tableSettings[i].marginRight
            ? { marginRight: formatValue(tableSettings[i].marginRight) }
            : {}),
          ...(tableSettings[i].marginBottom
            ? { marginBottom: formatValue(tableSettings[i].marginBottom) }
            : {}),

          // Conditionally add formatted border properties
          ...(tableSettings[i].borderTLR
            ? { borderTLR: formatValue(tableSettings[i].borderTLR) }
            : {}),
          ...(tableSettings[i].borderTRR
            ? { borderTRR: formatValue(tableSettings[i].borderTRR) }
            : {}),
          ...(tableSettings[i].borderBLR
            ? { borderBLR: formatValue(tableSettings[i].borderBLR) }
            : {}),
          ...(tableSettings[i].borderBRR
            ? { borderBRR: formatValue(tableSettings[i].borderBRR) }
            : {}),
          ...(tableSettings[i].borderTW
            ? { borderTW: formatValue(tableSettings[i].borderTW) }
            : {}),
          ...(tableSettings[i].borderTC
            ? {
                borderTC: formatValue(
                  await commonUtils.hexToRgba(tableSettings[i].borderTC)
                ),
              }
            : {}),
          ...(tableSettings[i].borderBW
            ? { borderBW: formatValue(tableSettings[i].borderBW) }
            : {}),
          ...(tableSettings[i].borderBC
            ? {
                borderBC: formatValue(
                  await commonUtils.hexToRgba(tableSettings[i].borderBC)
                ),
              }
            : {}),
          ...(tableSettings[i].borderLW
            ? { borderLW: formatValue(tableSettings[i].borderLW) }
            : {}),
          ...(tableSettings[i].borderLC
            ? {
                borderLC: formatValue(
                  await commonUtils.hexToRgba(tableSettings[i].borderLC)
                ),
              }
            : {}),
          ...(tableSettings[i].borderRW
            ? { borderRW: formatValue(tableSettings[i].borderRW) }
            : {}),
          ...(tableSettings[i].borderRC
            ? {
                borderRC: formatValue(
                  await commonUtils.hexToRgba(tableSettings[i].borderRC)
                ),
              }
            : {}),
        };

        // Add optional icons from children
        if (Array.isArray(tableSettings[i].children)) {
          for (let j = 0; j < tableSettings[i].children.length; j++) {
            const child = tableSettings[i].children[j];

            if (
              child.type === "QIcon" &&
              child.text === "filter" &&
              child.iconLink
            ) {
              newHeader.filterIcon = child.iconLink;
              newHeader.filterIconWidth = JSON.parse(
                await commonUtilsReact.componentFrameWidth(
                  child,
                  defaultIconObject,
                  "",
                  "",
                  false
                )
              );

              newHeader.filterIconHeight = JSON.parse(
                await commonUtilsReact.componentFrameHeight(
                  child,
                  defaultIconObject,
                  "",
                  "",
                  false
                )
              );
            }

            if (
              child.type === "QIcon" &&
              child.text === "sort" &&
              child.iconLink
            ) {
              newHeader.sortIcon = child.iconLink;

              newHeader.sortIconWidth = JSON.parse(
                await commonUtilsReact.componentFrameWidth(
                  child,
                  defaultIconObject,
                  "",
                  "",
                  false
                )
              );

              newHeader.sortIconHeight = JSON.parse(
                await commonUtilsReact.componentFrameHeight(
                  child,
                  defaultIconObject,
                  "",
                  "",
                  false
                )
              );
            }

            if (child.type === "QInputSearch") {
              // ✅ Fix the problematic line
              if (child.iconLink) {
                newHeader.searchIcon = formatValue(child.iconLink);
              }

              let searchSettingArray = [];
              searchSettingArray.push({
                bgColor: formatValue(
                  await commonUtils.hexToRgba(
                    child.bgColor ?? defaultInputSearchObject.bgColor
                  )
                ),
                fontFamily: formatValue(
                  child.fontFamily ?? defaultInputSearchObject.fontFamily
                ),
                fontStyle: formatValue(
                  child.fontStyle ?? defaultInputSearchObject.fontStyle
                ),
                fontSize: formatValue(
                  child.fontSize ?? defaultInputSearchObject.fontSize
                ),
                fontWeight: formatValue(
                  child.fontWeight ?? defaultInputSearchObject.fontWeight
                ),
                textAlign: formatValue(
                  child.textAlign ?? defaultInputSearchObject.textAlign
                ),
                color: formatValue(
                  await commonUtils.hexToRgba(
                    child.color ?? defaultInputSearchObject.color
                  )
                ),
                paddingLeft: formatValue(
                  child.paddingLeft ?? defaultInputSearchObject.paddingLeft
                ),
                paddingTop: formatValue(
                  child.paddingTop ?? defaultInputSearchObject.paddingTop
                ),
                paddingRight: formatValue(
                  child.paddingRight ?? defaultInputSearchObject.paddingRight
                ),
                paddingBottom: formatValue(
                  child.paddingBottom ?? defaultInputSearchObject.paddingBottom
                ),
                marginLeft: formatValue(
                  child.marginLeft ?? defaultInputSearchObject.marginLeft
                ),
                marginTop: formatValue(
                  child.marginTop ?? defaultInputSearchObject.marginTop
                ),
                marginRight: formatValue(
                  child.marginRight ?? defaultInputSearchObject.marginRight
                ),
                marginBottom: formatValue(
                  child.marginBottom ?? defaultInputSearchObject.marginBottom
                ),
                borderTLR: formatValue(
                  child.borderTLR ?? defaultInputSearchObject.borderTLR
                ),
                borderTRR: formatValue(
                  child.borderTRR ?? defaultInputSearchObject.borderTRR
                ),
                borderBLR: formatValue(
                  child.borderBLR ?? defaultInputSearchObject.borderBLR
                ),
                borderBRR: formatValue(
                  child.borderBRR ?? defaultInputSearchObject.borderBRR
                ),
                borderTW: formatValue(
                  child.borderTW ?? defaultInputSearchObject.borderTW
                ),
                borderTC: formatValue(
                  await commonUtils.hexToRgba(
                    child.borderTC ?? defaultInputSearchObject.borderTC
                  )
                ),
                borderBW: formatValue(
                  child.borderBW ?? defaultInputSearchObject.borderBW
                ),
                borderBC: formatValue(
                  await commonUtils.hexToRgba(
                    child.borderBC ?? defaultInputSearchObject.borderBC
                  )
                ),
                borderLW: formatValue(
                  child.borderLW ?? defaultInputSearchObject.borderLW
                ),
                borderLC: formatValue(
                  await commonUtils.hexToRgba(
                    child.borderLC ?? defaultInputSearchObject.borderLC
                  )
                ),
                borderRW: formatValue(
                  child.borderRW ?? defaultInputSearchObject.borderRW
                ),
                borderRC: formatValue(
                  await commonUtils.hexToRgba(
                    child.borderRC ?? defaultInputSearchObject.borderRC
                  )
                ),

                width: await commonUtilsReact.componentFrameWidth(
                  child,
                  defaultInputSearchObject,
                  "",
                  "",
                  false
                ),

                height: JSON.parse(
                  await commonUtilsReact.componentFrameHeight(
                    child,
                    defaultInputSearchObject,
                    "",
                    "",
                    false
                  )
                ),
              });

              newHeader.searchSetting = searchSettingArray;
            }
          }
        }

        headers.splice(tableSettings[i].index, 0, newHeader);
      }
    }
    //console.log(JSON.stringify(headers, null, 2));

    // Step 2: Transpose columns to rows
    const tableRowsJson = this.jsonObjects["children"][1].children || [];
    const columnsMeta = tableRowsJson["children"] || [];
    //console.log(tableRowsJson)

    const numRows = tableRowsJson?.length || 0;

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const row = {};

      for (
        let colIndex = 0;
        colIndex < tableRowsJson[rowIndex]["children"].length;
        colIndex++
      ) {
        //console.log(tableRowsJson[rowIndex]["children"][colIndex]?.columnValue)
        row[tableRowsJson[rowIndex]["children"][colIndex]?.columnValue] =
          tableRowsJson[rowIndex]["children"][colIndex]?.text || "";
      }

      rows.push(row);
    }

    const getValue = (key) => this.jsonObjects[key] ?? defaultObject[key] ?? "";
    const getHexValue = (key) =>
      commonUtils.hexToRgba(this.jsonObjects[key] ?? defaultObject[key] ?? "");

    const componentProps = [
      { key: "onClick", value: onClick },
      { key: "action", value: action },
      { key: "navigation", value: navigation },
      {
        key: "isAbsoluteValue",
        value: this.parantType === "QStack" ? true : false,
      },

      { key: "positionedLeft", value: getValue("positionedLeft") },
      { key: "positionedRight", value: getValue("positionedRight") },
      { key: "positionedTop", value: getValue("positionedTop") },
      { key: "positionedBottom", value: getValue("positionedBottom") },
      { key: "headerText", value: getValue("text") },
      { key: "borderWidth", value: getValue("borderWidth") },
      { key: "fontSize", value: getValue("fontSize") },
      { key: "fontFamily", value: getValue("fontFamily") },
      { key: "fontStyle", value: getValue("fontStyle") },
      { key: "fontWeight", value: getValue("fontWeight") },
      { key: "textAlign", value: getValue("textAlign") },
      { key: "crossAlignment", value: getValue("crossAlignment") },
      { key: "bgUrl", value: getValue("url") },
      { key: "isImageFill", value: getValue("isImageFill") },
      { key: "shadowBlurRadius", value: getValue("shadowBlurRadius") },
      { key: "shadowOffsetX", value: getValue("shadowOffsetX") },
      { key: "shadowOffsetY", value: getValue("shadowOffsetY") },
      { key: "shadowSpreadRadius", value: getValue("shadowSpreadRadius") },
      { key: "mainAlignment", value: getValue("mainAlignment") },
      { key: "alignment", value: getValue("alignment") },
      { key: "animateType", value: getValue("animateType") },
      { key: "divCount", value: getValue("divCount") },

      // paddings
      { key: "paddingLeft", value: getValue("paddingLeft") },
      { key: "paddingTop", value: getValue("paddingTop") },
      { key: "paddingRight", value: getValue("paddingRight") },
      { key: "paddingBottom", value: getValue("paddingBottom") },

      // margins
      { key: "marginLeft", value: getValue("marginLeft") },
      { key: "marginTop", value: getValue("marginTop") },
      { key: "marginRight", value: getValue("marginRight") },
      { key: "marginBottom", value: getValue("marginBottom") },

      // borders
      { key: "borderTLR", value: getValue("borderTLR") },
      { key: "borderTRR", value: getValue("borderTRR") },
      { key: "borderBLR", value: getValue("borderBLR") },
      { key: "borderBRR", value: getValue("borderBRR") },
      { key: "borderTW", value: getValue("borderTW") },
      { key: "borderTC", value: getValue("borderTC") },
      { key: "borderBW", value: getValue("borderBW") },
      { key: "borderBC", value: getValue("borderBC") },
      { key: "borderLW", value: getValue("borderLW") },
      { key: "borderLC", value: getValue("borderLC") },
      { key: "borderRW", value: getValue("borderRW") },
      { key: "borderRC", value: getValue("borderRC") },

      // colors (with conversion)
      {
        key: "bgColor",
        value: commonUtils.hexToRgba(
          // this.jsonObjects?.bgColor ?
          // this.jsonObjects?.bgColor : this.jsonObjects?.table_payload_settings?.backgroundColor ?
          // this.jsonObjects?.table_payload_settings?.backgroundColor: defaultObject.bgColor
          this.jsonObjects?.bgColor ?? defaultObject.bgColor
        ),
      },
      { key: "borderColor", value: getHexValue("borderColor") },
      { key: "color", value: getHexValue("color") },
      { key: "shadowColor", value: getHexValue("shadowColor") },

      {
        key: "width",
        value: await commonUtilsReact.componentFrameWidth(
          this.jsonObjects,
          defaultObject,
          this.parentWidth,
          this.parentHeight,
          false
        ),
      },

      {
        key: "height",
        value: await commonUtilsReact.componentFrameHeight(
          this.jsonObjects,
          defaultObject,
          this.parentWidth,
          this.parentHeight,
          false
        ),
      },

      {
        key: "taggedKey",
        value: this.jsonObjects?.taggedKey,
      },

      {
        key: "shortType",
        value: this.jsonObjects?.api_data?.url ? "apiData" : "fromData",
      },

      {
        key: "apiUrl",
        value: this.jsonObjects?.api_data?.url,
      },

      {
        key: "payload",
        value: this.jsonObjects?.api_data?.body,
      },

      {
        key: "TotalPage",
        value: this.jsonObjects?.tablePayload?.tableSettings?.pagination?.total,
      },
      {
        key: "perPageSize1",
        value:
          this.jsonObjects?.tablePayload?.tableSettings?.pagination
            ?.rowsPerPage ?? 10,
      },
      {
        key: "currentPage",
        value: 1,
      },
      {
        key: "pagination",
        value: "Yes",
      },

      {
        key: "globalSearch",
        value:
          this.jsonObjects?.tablePayload?.tableSettings?.globalSearch?.enabled,
      },

      {
        key: "tableData",
        value: {
          headers: headers, // full array of objects
          rows: rows, // full array of objects
        },
      },
    ];

    let componentJSX = " ".repeat(this.startingColum) + `<QTableData\n`;

    // Add dynamic properties to the JSX
    componentProps.forEach((prop) => {
      const indent = " ".repeat(this.startingColum + 2);

      const mustBeJSExpression = [
        "TotalPage",
        "perPageSize1",
        "currentPage",
        "globalSearch",
        "tableData",
      ].includes(prop.key);

      const isDimension = ["width", "height"].includes(prop.key);

      if (mustBeJSExpression) {
        if (
          prop.value === "" ||
          prop.value === undefined ||
          prop.value === null
        ) {
          componentJSX += `${indent}${prop.key}=""\n`;
        } else {
          // For array or object properties, we use JSON.stringify to ensure they are correctly rendered in JSX
          componentJSX += `${indent}${prop.key}={${JSON.stringify(
            prop.value
          )}}\n`;
        }
      } else {
        if (
          prop.value === undefined ||
          prop.value === null ||
          prop.value === ""
        ) {
          return;
        } else if (isDimension && prop.value !== "") {
          componentJSX += `${indent}${prop.key}= ${prop.value}\n`;
        } else {
          if (prop.key == "payload") {
            componentJSX += `${indent}${prop.key}='${prop.value}'\n`;
          } else {
            componentJSX += `${indent}${prop.key}="${prop.value}"\n`;
          }
        }
      }
    });

    // Close the component tag
    componentJSX += " ".repeat(this.startingColum) + ">\n";

    // Write the JSX into the file
    await readWriteFile.writeToFile(this.fileName, componentJSX);

    //console.log('HeightType', this.jsonObjects["heightType"],"*********\n")

    await this.parsePage(
      this.startingColum + 3,
      this.fileName,
      this.jsonObjects["children"],
      width ?? this.parentWidth,
      height ?? this.parentHeight
    );
    await this.endFile(this.fileName, this.startingColum);
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
        this.parantType === "QHMenuItem" ? "QHMenuItem" : "QTable"
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QTableData>\n" + ""
    );
  }
}

module.exports = {
  // parseTable,
  ParserTable,
};
