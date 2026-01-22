const readWriteFile = require("../../utility/read_write_file");
const createPageDesign = require("./react_create_page_design");
const defaultParseRow = require("../Common/parse_default_row");
const commonUtils = require("../../utility/common_utils");
const commonUtilsReact = require("./common_utilits_react");
const getOnClickProps = require("./onClickHandler");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper");


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
    let height = await commonUtilsReact.componentFrameHeight(
      this.jsonObjects,
      "",
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );
    let width = await commonUtilsReact.componentFrameWidth(
      this.jsonObjects,
      "",
      this.parentWidth,
      this.parentHeight,
      this.isAbsoluteValue == true ? false : true
    );

    const { onClick, action, navigation } = await getOnClickProps(
      this.jsonObjects
    );

    const componentProps = [
      { key: "tableColumn", value: this.jsonObjects["tableColumn"] ?? "" },
      { key: "apiUrl", value: this.jsonObjects["onLoad"]?.api[0].url ?? "" },
      { key: "body", value: this.jsonObjects["onLoad"]?.api[0].body ?? "" },
      { key: "id", value: this.jsonObjects["onLoad"]?.api[0].id ?? "" },
      { key: "name", value: this.jsonObjects["onLoad"]?.api[0].name ?? "" },
      { key: "method", value: this.jsonObjects["onLoad"]?.api[0].method ?? "" },
      { key: "header", value: this.jsonObjects["onLoad"]?.api[0].header ?? "" },
      { key: "taggedKey", value: this.jsonObjects["taggedKey"] ?? "" },

      { key: "onClick", value: onClick },
      { key: "action", value: action },
      { key: "navigation", value: navigation },

      {
        key: "isAbsoluteValue",
        value: this.parantType === "QStack" ? true : false,
      },
      {
        key: "positionedLeft",
        value: this.jsonObjects["positionedLeft"] ?? "",
      },
      {
        key: "positionedRight",
        value: this.jsonObjects["positionedRight"] ?? "",
      },
      { key: "positionedTop", value: this.jsonObjects["positionedTop"] ?? "" },
      {
        key: "positionedBottom",
        value: this.jsonObjects["positionedBottom"] ?? "",
      },

      {
        key: "widthType",
        value: this.jsonObjects["widthType"]
          ? this.jsonObjects["widthType"]
          : (await defaultParseRow.getDefaultValue("widthType")) || "",
      },
      {
        key: "heightType",
        value: this.jsonObjects["heightType"]
          ? this.jsonObjects["heightType"]
          : (await defaultParseRow.getDefaultValue("heightType")) || "",
      },
      // { key: "bgColor", value: this.jsonObjects["bgColor"] ?? (await defaultParseRow.getDefaultValue('bgColor') || "") },
      {
        key: "borderRadius",
        value:
          this.jsonObjects["borderRadius"] ??
          ((await defaultParseRow.getDefaultValue("borderRadius")) || ""),
      },
      {
        key: "borderTLR",
        value:
          this.jsonObjects["borderTLR"] ??
          ((await defaultParseRow.getDefaultValue("borderTLR")) || ""),
      },
      {
        key: "borderTRR",
        value:
          this.jsonObjects["borderTRR"] ??
          ((await defaultParseRow.getDefaultValue("borderTRR")) || ""),
      },
      {
        key: "borderBLR",
        value:
          this.jsonObjects["borderBLR"] ??
          ((await defaultParseRow.getDefaultValue("borderBLR")) || ""),
      },
      {
        key: "borderBRR",
        value:
          this.jsonObjects["borderBRR"] ??
          ((await defaultParseRow.getDefaultValue("borderBRR")) || ""),
      },
      //  { key: "borderColor", value: this.jsonObjects["borderColor"] ?? (await defaultParseRow.getDefaultValue('borderColor') || "") },
      {
        key: "borderWidth",
        value:
          this.jsonObjects["borderWidth"] ??
          ((await defaultParseRow.getDefaultValue("borderWidth")) || ""),
      },
      {
        key: "borderTW",
        value:
          this.jsonObjects["borderTW"] ??
          ((await defaultParseRow.getDefaultValue("borderTW")) || ""),
      },
      {
        key: "borderBW",
        value:
          this.jsonObjects["borderBW"] ??
          ((await defaultParseRow.getDefaultValue("borderBW")) || ""),
      },
      {
        key: "borderLW",
        value:
          this.jsonObjects["borderLW"] ??
          ((await defaultParseRow.getDefaultValue("borderLW")) || ""),
      },
      {
        key: "borderRW",
        value:
          this.jsonObjects["borderRW"] ??
          ((await defaultParseRow.getDefaultValue("borderRW")) || ""),
      },
      //  { key: "color", value: this.jsonObjects["color"] ?? (await defaultParseRow.getDefaultValue('color') || "") },
      {
        key: "fontSize",
        value:
          this.jsonObjects["fontSize"] ??
          ((await defaultParseRow.getDefaultValue("fontSize")) || ""),
      },

      {
        key: "fontFamily",
        value:
          this.jsonObjects["fontFamily"] ??
          ((await defaultParseRow.getDefaultValue("fontFamily")) || ""),
      },
      {
        key: "fontStyle",
        value:
          this.jsonObjects["fontStyle"] ??
          ((await defaultParseRow.getDefaultValue("fontStyle")) || ""),
      },
      {
        key: "fontWeight",
        value:
          this.jsonObjects["fontWeight"] ??
          ((await defaultParseRow.getDefaultValue("fontWeight")) || ""),
      },
      {
        key: "textAlign",
        value:
          this.jsonObjects["textAlign"] ??
          ((await defaultParseRow.getDefaultValue("textAlign")) || ""),
      },
      {
        key: "crossAlignment",
        value:
          this.jsonObjects["crossAlignment"] ??
          ((await defaultParseRow.getDefaultValue("crossAlignment")) || ""),
      },
      {
        key: "bgUrl",
        value:
          this.jsonObjects["url"] ??
          ((await defaultParseRow.getDefaultValue("url")) || ""),
      },
      {
        key: "isImageFill",
        value:
          this.jsonObjects["isImageFill"] ??
          ((await defaultParseRow.getDefaultValue("isImageFill")) || "true"),
      },
      // { key: "shadowColor", value: this.jsonObjects["shadowColor"] ?? (await defaultParseRow.getDefaultValue('shadowColor') || "") },
      {
        key: "shadowBlurRadius",
        value:
          this.jsonObjects["shadowBlurRadius"] ??
          ((await defaultParseRow.getDefaultValue("shadowBlurRadius")) || ""),
      },
      {
        key: "shadowOffsetX",
        value:
          this.jsonObjects["shadowOffsetX"] ??
          ((await defaultParseRow.getDefaultValue("shadowOffsetX")) || ""),
      },
      {
        key: "shadowOffsetY",
        value:
          this.jsonObjects["shadowOffsetY"] ??
          ((await defaultParseRow.getDefaultValue("shadowOffsetY")) || ""),
      },
      {
        key: "shadowSpreadRadius",
        value:
          this.jsonObjects["shadowSpreadRadius"] ??
          ((await defaultParseRow.getDefaultValue("shadowSpreadRadius")) ||
            "0px"),
      },
      {
        key: "mainAlignment",
        value:
          this.jsonObjects["mainAlignment"] ??
          ((await defaultParseRow.getDefaultValue("mainAlignment")) || ""),
      },
      {
        key: "alignment",
        value:
          this.jsonObjects["alignment"] ??
          ((await defaultParseRow.getDefaultValue("alignment")) || ""),
      },
      {
        key: "animateType",
        value:
          this.jsonObjects["animateType"] ??
          ((await defaultParseRow.getDefaultValue("animateType")) || ""),
      },
      {
        key: "divCount",
        value:
          this.jsonObjects["divCount"] ??
          ((await defaultParseRow.getDefaultValue("divCount")) || ""),
      },
    ];

    const extractAnimationProps = (data = []) => {
      const mapJoin = (key, transformFn = (v) => v) =>
        data
          .map((item) => transformFn(item?.[key]))
          .filter(Boolean)
          .join(", ");

      return [
        { key: "isAnimationP", value: mapJoin("isAnimationP") },
        { key: "animationType", value: mapJoin("animationType") },
        { key: "animationDirection", value: mapJoin("animationDirection") },
        {
          key: "animationEasing",
          value: mapJoin("animationEasing", (val) =>
            val?.replace(/^easing/, "ease")
          ),
        },
        { key: "animationIterations", value: mapJoin("animationIterations") },
        {
          key: "animationDelay",
          value: mapJoin("animationDelay", (val) =>
            val
              ? parseFloat(`${val}`.replace(/[a-zA-Z]/g, "")) / 1000 + "s"
              : ""
          ),
        },
        {
          key: "isRevarsed",
          value: data
            .map((item) => (item?.isRevarsed === true ? "true" : "false"))
            .join(", "),
        },
        {
          key: "animationDuration",
          value: data
            .map((item) => {
              const val = `${item?.animationDuration ?? ""}`;
              return val.endsWith("s") ? val : val + "s";
            })
            .filter(Boolean)
            .join(", "),
        },
      ];
    };

    if (this.jsonObjects?.["AnimationsData"]?.length > 0) {
      const data = this.jsonObjects["AnimationsData"];
      componentProps.push(...extractAnimationProps(data));
    }

    componentProps.push(
      {
        key: "paddingLeft",
        value:
          this.jsonObjects["paddingLeft"] ??
          (await defaultParseRow.getDefaultValue("paddingLeft")) ??
          "",
      },
      {
        key: "paddingTop",
        value:
          this.jsonObjects["paddingTop"] ??
          (await defaultParseRow.getDefaultValue("paddingTop")) ??
          "",
      },
      {
        key: "paddingRight",
        value:
          this.jsonObjects["paddingRight"] ??
          (await defaultParseRow.getDefaultValue("paddingRight")) ??
          "",
      },
      {
        key: "paddingBottom",
        value:
          this.jsonObjects["paddingBottom"] ??
          (await defaultParseRow.getDefaultValue("paddingBottom")) ??
          "",
      }
    );

    componentProps.push(
      {
        key: "marginLeft",
        value:
          this.jsonObjects["marginLeft"] ??
          (await defaultParseRow.getDefaultValue("marginLeft")) ??
          "",
      },
      {
        key: "marginTop",
        value:
          this.jsonObjects["marginTop"] ??
          (await defaultParseRow.getDefaultValue("marginTop")) ??
          "",
      },
      {
        key: "marginRight",
        value:
          this.jsonObjects["marginRight"] ??
          (await defaultParseRow.getDefaultValue("marginRight")) ??
          "",
      },
      {
        key: "marginBottom",
        value:
          this.jsonObjects["marginBottom"] ??
          (await defaultParseRow.getDefaultValue("marginBottom")) ??
          "",
      }
    );

    componentProps.push(
      {
        key: "width",
        value: await commonUtilsReact.componentFrameWidth(
          this.jsonObjects,
          await defaultParseRow.getDefaultObject(),
          this.parentWidth,
          this.parentHeight,
          false
        ),
      },

      {
        key: "height",
        value: await commonUtilsReact.componentFrameHeight(
          this.jsonObjects,
          await defaultParseRow.getDefaultObject(),
          this.parentWidth,
          this.parentHeight,
          this.isAbsoluteValue == true ? false : true
        ),
      }
    );

    if (
      this.jsonObjects["bgColor"] !== undefined &&
      this.jsonObjects["bgColor"] !== null &&
      this.jsonObjects["bgColor"] !== "" &&
      this.jsonObjects["bgColor"] !== "null"
    ) {
      componentProps.push({
        key: "bgColor",
        value: commonUtils.hexToRgba(this.jsonObjects["bgColor"]),
      });
    } else {
      // Ensure `hexCode` is only used after it is retrieved
      const hexCode = await defaultParseRow.getDefaultValue("bgColor");

      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "bgColor",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["borderColor"] !== undefined &&
      this.jsonObjects["borderColor"] !== null &&
      this.jsonObjects["borderColor"] !== "" &&
      this.jsonObjects["borderColor"] !== "null"
    ) {
      componentProps.push({
        key: "borderColor",
        value: commonUtils.hexToRgba(this.jsonObjects["borderColor"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("borderColor"); // Example hex color
      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "borderColor",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["borderTC"] !== undefined &&
      this.jsonObjects["borderTC"] !== null &&
      this.jsonObjects["borderTC"] !== "" &&
      this.jsonObjects["borderTC"] !== "null"
    ) {
      componentProps.push({
        key: "borderTC",
        value: commonUtils.hexToRgba(this.jsonObjects["borderTC"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("borderTC"); // Example hex color
      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "borderTC",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["borderBC"] !== undefined &&
      this.jsonObjects["borderBC"] !== null &&
      this.jsonObjects["borderBC"] !== "" &&
      this.jsonObjects["borderBC"] !== "null"
    ) {
      componentProps.push({
        key: "borderBC",
        value: commonUtils.hexToRgba(this.jsonObjects["borderBC"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("borderBC"); // Example hex color
      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "borderBC",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["borderLC"] !== undefined &&
      this.jsonObjects["borderLC"] !== null &&
      this.jsonObjects["borderLC"] !== "" &&
      this.jsonObjects["borderLC"] !== "null"
    ) {
      componentProps.push({
        key: "borderLC",
        value: commonUtils.hexToRgba(this.jsonObjects["borderLC"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("borderLC"); // Example hex color
      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "borderLC",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["borderRC"] !== undefined &&
      this.jsonObjects["borderRC"] !== null &&
      this.jsonObjects["borderRC"] !== "" &&
      this.jsonObjects["borderRC"] !== "null"
    ) {
      componentProps.push({
        key: "borderRC",
        value: commonUtils.hexToRgba(this.jsonObjects["borderRC"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("borderRC"); // Example hex color
      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "borderRC",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["color"] !== undefined &&
      this.jsonObjects["color"] !== null &&
      this.jsonObjects["color"] !== "" &&
      this.jsonObjects["color"] !== "null"
    ) {
      componentProps.push({
        key: "color",
        value: commonUtils.hexToRgba(this.jsonObjects["color"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("color"); // Example hex color

      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "color",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    if (
      this.jsonObjects["shadowColor"] !== undefined &&
      this.jsonObjects["shadowColor"] !== null &&
      this.jsonObjects["shadowColor"] !== "" &&
      this.jsonObjects["shadowColor"] !== "null"
    ) {
      componentProps.push({
        key: "shadowColor",
        value: commonUtils.hexToRgba(this.jsonObjects["shadowColor"]),
      });
    } else {
      const hexCode = await defaultParseRow.getDefaultValue("shadowColor"); // Example hex color
      if (
        hexCode !== undefined &&
        hexCode !== null &&
        hexCode !== "" &&
        hexCode !== "null"
      ) {
        componentProps.push({
          key: "shadowColor",
          value: commonUtils.hexToRgba(hexCode),
        });
      }
    }

    let componentJSX = " ".repeat(this.startingColum) + `<QRepeat\n`;

    // Add dynamic properties to the JSX
    componentProps.forEach((prop) => {
      if (
        prop.value === undefined ||
        prop.value === null ||
        prop.value === ""
      ) {
        return;
      } else {
        if (prop.key === "body") {
          componentJSX +=
            " ".repeat(this.startingColum + 2) +
            `${prop.key}='${prop.value}'\n`;
        } else {
          componentJSX +=
            " ".repeat(this.startingColum + 2) +
            `${prop.key}="${prop.value}"\n`;
        }
      }
    });

    // Close the component tag
    componentJSX += " ".repeat(this.startingColum) + ">\n";

    // Write the JSX into the file
    await readWriteFile.writeToFile(this.fileName, componentJSX);

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
        "QRepeat"
      );
    }
  }

  async endFile(pageName, startingColumn) {
    await readWriteFile.writeToFile(
      pageName,
      "\n" + " ".repeat(startingColumn + 1) + "</QRepeat>\n" + ""
    );
  }
}

module.exports = {
  //parseRepeat,
  ParserRepeat,
};
