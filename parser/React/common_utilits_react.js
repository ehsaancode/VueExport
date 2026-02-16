const commonUtils = require("../../utility/common_utils");
const jsonKeys = require("../../utility/json_keys");
const commonDefaultParse = require("../Common/parse_default_common");
const getOnClickProps = require("./onClickHandler");
const readWriteFile = require("../../utility/read_write_file");
const reactStyleProps = require("./react_style_props");
const reactCommonStyleProps = require("./react_common_style_props");
const getFormConfigForItem = require("../../mapper/reactjs/reactjs_mapper_form");
const { removeTransparencyFromHexCode } = require("../../utility/common_utils");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper");
const propToStyleKeyMap = require("../../resource/props_mapper.json");
const stateHandler = require("../../utility/state_handler");

let props = [];
let parentIds = [];
let parentId = "";
let components = [];
let elements = [];

/*
let actions = {};
let onLoadActions = {};
let formSubmitActions = {};
let actionObjects = {};

// Function to insert an object into the array for a specific tag
async function insertAction(tag, actionObj) {
  if (!tag || !actionObj || actionObj === undefined) {
    return false; // Return false if tag or actionObj is invalid
  }

  // Initialize array for the tag if it doesn't exist
  if (!actions[tag]) {
    actions[tag] = [];
  }

  // Insert the action object into the tag's array
  actions[tag].push(actionObj);
  return true; // Return true to indicate success
}

// Function to clear all objects for a specific tag
async function clearActionsForTag(tag) {
  if (!tag) {
    return false; // Return false if tag is invalid
  }
  if (actions[tag]) {
    delete actions[tag]; // Remove the tag and its array
    // Alternatively, you could use: actions[tag] = [];
    return true; // Return true to indicate success
  }
  return false; // Return false if tag doesn't exist
}

// Function to get the array for a specific tag
async function getActionsArray(tag) {
  if (!tag || !actions[tag]) {
    return []; // Return empty array if tag doesn't exist
  }
  return [...actions[tag]]; // Return a copy of the array
}

async function insertOnLoadAction(tag, actionObj) {
  if (!tag || !actionObj || actionObj === undefined) {
    return false; // Return false if tag or actionObj is invalid
  }

  // Initialize array for the tag if it doesn't exist
  if (!onLoadActions[tag]) {
    onLoadActions[tag] = [];
  }

  // Insert the action object into the tag's array
  onLoadActions[tag].push(actionObj);
  return true; // Return true to indicate success
}

async function insertFormSubmitAction(tag, actionObj) {
  if (!tag || !actionObj || actionObj === undefined) {
    return false; // Return false if tag or actionObj is invalid
  }

  // Initialize array for the tag if it doesn't exist
  if (!formSubmitActions[tag]) {
    formSubmitActions[tag] = [];
  }

  // Insert the action object into the tag's array
  formSubmitActions[tag].push(actionObj);
  return true; // Return true to indicate success
}

// Function to clear all objects for a specific tag
async function clearOnLoadActionsForTag(tag) {
  if (!tag) {
    return false; // Return false if tag is invalid
  }
  if (onLoadActions[tag]) {
    delete onLoadActions[tag]; // Remove the tag and its array
    // Alternatively, you could use: actions[tag] = [];
    return true; // Return true to indicate success
  }
  return false; // Return false if tag doesn't exist
}

async function clearFormSubmitForTag(tag) {
  if (!tag) {
    return false; // Return false if tag is invalid
  }
  if (formSubmitActions[tag]) {
    delete formSubmitActions[tag]; // Remove the tag and its array
    // Alternatively, you could use: actions[tag] = [];
    return true; // Return true to indicate success
  }
  return false; // Return false if tag doesn't exist
}

// Function to get the array for a specific tag
async function getOnLoadActionsArray(tag) {
  if (!tag || !onLoadActions[tag]) {
    return []; // Return empty array if tag doesn't exist
  }
  return [...onLoadActions[tag]]; // Return a copy of the array
}

async function getFormSubmitActionsArray(tag) {
  if (!tag || !formSubmitActions[tag]) {
    return []; // Return empty array if tag doesn't exist
  }
  return [...formSubmitActions[tag]]; // Return a copy of the array
}*/

async function componentFrameWidth(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  isWidthAutoNull,
  type = "",
) {
  let frame = "";
  if (jsonObject?.[jsonKeys.widthType] == "px") {
    frame = `\"${
      jsonObject?.[jsonKeys.width] == "auto"
        ? ""
        : (jsonObject?.[jsonKeys.width] ?? "")
    }px\"`;
  } else if (jsonObject?.[jsonKeys.widthType] == "percent") {
    frame = `\"${jsonObject?.[jsonKeys.widthPercent] ?? ""}\"`;
  } else if (jsonObject?.[jsonKeys.widthType] == "vw") {
    frame = `\"${(jsonObject?.[jsonKeys.widthPercent] ?? "").replace(
      "%",
      "vw",
    )}\"`;
  } else {
    frame = "";
  }

  return frame;
}

async function childFrameWidth(
  jsonObject,
  parentWidth,
  parentHeight,
  isWidthAutoNull,
  type = "",
) {
  let frame = "";
  for (const index in jsonObject) {
    var jsonObj = jsonObject[index];
    let defaultJsonObject =
      (await commonDefaultParse.defaultObjct(jsonObj)) ?? "";
    if (
      jsonObj[jsonKeys.widthType] == "px" ||
      defaultJsonObject[jsonKeys.widthType] == "px"
    ) {
      frame = `\"${jsonObj[jsonKeys.width]}px\"`;
    } else if (
      jsonObj[jsonKeys.widthType] == "percent" ||
      defaultJsonObject[jsonKeys.widthType] == "percent"
    ) {
      frame = `\"${jsonObj[jsonKeys.widthPercent]}\"`;
    } else if (
      jsonObj[jsonKeys.widthType] == "vw" ||
      defaultJsonObject[jsonKeys.widthType] == "vw"
    ) {
      frame = `\"${(
        jsonObj[jsonKeys.widthPercent] ??
        defaultJsonObject[jsonKeys.widthPercent] ??
        ""
      ).replace("%", "vw")}\"`;
    } else {
      frame = "";
    }

    if (frame.length > 0) {
      break;
    } else if (jsonObj[jsonKeys.children].length > 0) {
      frame = await childFrameWidth(
        jsonObj[jsonKeys.children],
        parentWidth,
        parentHeight,
        isWidthAutoNull,
        type,
      );
      if (frame.length > 0) {
        break;
      }
    } else {
      frame = "";
    }
  }
  return frame.length > 0 ? frame : '"auto"';
}

async function componentFrameHeight(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  isHeightAutoNull,
) {
  let frame = "";
  if (jsonObject[jsonKeys.heightType] == "px") {
    frame = `\"${
      jsonObject[jsonKeys.height] == "auto"
        ? defaultJsonObject[jsonKeys.height]
        : (jsonObject[jsonKeys.height] ?? defaultJsonObject[jsonKeys.height])
    }px\"`;
  } else if (jsonObject[jsonKeys.heightType] == "percent") {
    frame = `\"${
      jsonObject[jsonKeys.heightPercent] ??
      defaultJsonObject[jsonKeys.heightPercent]
    }\"`;
  } else if (jsonObject[jsonKeys.heightType] == "vh") {
    frame = `\"${(
      jsonObject[jsonKeys.heightPercent] ??
      defaultJsonObject[jsonKeys.heightPercent] ??
      ""
    ).replace("%", "vh")}\"`;
  } else if (defaultJsonObject?.heightType == "px") {
    frame = `\"${
      jsonObject[jsonKeys.height] == "auto"
        ? defaultJsonObject[jsonKeys.height]
        : (jsonObject[jsonKeys.height] ?? defaultJsonObject[jsonKeys.height])
    }px\"`;
  } else if (defaultJsonObject?.[jsonKeys.heightType] == "percent") {
    frame = `\"${
      jsonObject[jsonKeys.heightPercent] ??
      defaultJsonObject[jsonKeys.heightPercent]
    }\"`;
  } else if (defaultJsonObject?.[jsonKeys.heightType] == "vh") {
    frame = `\"${(
      jsonObject[jsonKeys.heightPercent] ??
      defaultJsonObject?.[jsonKeys.heightPercent] ??
      ""
    ).replace("%", "vh")}\"`;
  } else {
    frame = ``;
    /*if (jsonObject["children"].length > 0) {
               if (parentHeight.length > 0 && parentHeight != "auto") {
                    frame = parentHeight
               } else if (jsonObject["children"].length > 0) {
                    frame = await childFrameHeight(jsonObject["children"], parentWidth, parentHeight, isHeightAutoNull);
               } else {
                    return '\"auto\"';
               }
          } else {
               return '\"auto\"';
          }*/
  }

  return frame; //.length > 0 ? frame : '\"auto\"';
}

async function childFrameHeight(
  jsonObject,
  parentWidth,
  parentHeight,
  isHeightAutoNull,
) {
  let frame = "";
  for (const index in jsonObject) {
    var jsonObj = jsonObject[index];
    let defaultJsonObject =
      (await commonDefaultParse.defaultObjct(jsonObj)) ?? "";
    if (
      jsonObj[jsonKeys.heightType] == "px" ||
      defaultJsonObject[jsonKeys.heightType] == "px"
    ) {
      frame = `\"${jsonObj[jsonKeys.height]}px\"`;
    } else if (
      jsonObj[jsonKeys.heightType] == "percent" ||
      defaultJsonObject[jsonKeys.heightType] == "percent"
    ) {
      frame = `\"${jsonObj[jsonKeys.heightPercent]}\"`;
    } else if (
      jsonObj[jsonKeys.heightType] == "vw" ||
      defaultJsonObject[jsonKeys.heightType] == "vw"
    ) {
      frame = `\"${(
        jsonObj[jsonKeys.heightPercent] ??
        defaultJsonObject[jsonKeys.heightPercent] ??
        ""
      ).replace("%", "vw")}\"`;
    } else {
      frame = "";
    }

    if (frame.length > 0) {
      break;
    } else if (jsonObj[jsonKeys.children].length > 0) {
      frame = await childFrameHeight(
        jsonObj[jsonKeys.children],
        parentWidth,
        parentHeight,
        isHeightAutoNull,
      );
      if (frame.length > 0) {
        break;
      }
    } else {
      frame = "";
    }
  }
  return frame;
}

async function setParentId(parId) {
  parentId = parId;
}

async function getParentId() {
  return parentId;
}

async function setParentIds(parentId) {
  parentIds.push(parentId);
}

async function getParentIds() {
  return parentIds;
}

async function resetParentIds() {
  parentIds = [];
}

async function getFont(jsonObj, defaultObjct) {
  return jsonObj[jsonKeys.fontFamily]
    ? jsonObj[jsonKeys.fontFamily]
    : defaultObjct[jsonKeys.fontFamily]
      ? defaultObjct[jsonKeys.fontFamily]
      : "Arial";
}

async function hasMenuBar(jsonObjects) {
  // let jsonObj = jsonObjects[jsonKeys.children];
  for (const index in jsonObjects?.children) {
    // let json = jsonObj[index];
    let objectType = await jsonObjects?.children[index]?.type;
    if (objectType == "QMenuBar") {
      return "success";
    } else {
    }
  }
  return "failure";
}

async function getComponentName(cmsPageId) {
  return "Header";
}

async function generateStyleCode(list) {
  const excludedKeys = [
    "colorBackground.background.image.url",
    "colorBackground.background.image.seoTitle",
    "colorBackground.background.image.repeat",
    "colorBackground.background.image.seoAlt",
    "colorBackground.background.image.imageFit",
    "typography.text.content",
    "repeater_data_source",
  ];

  let lines = [];
  // console.log('list', list)

  list.forEach(({ prop, stateVariableName, appStateVariableName }) => {
    if (!prop || (!stateVariableName && !appStateVariableName)) return; // skip invalid
    if (excludedKeys.includes(prop)) return; // skip excluded keys

    const styleKey = propToStyleKeyMap[prop];
    if (!styleKey) return; // skip if no mapping

    if (stateVariableName && stateVariableName.trim() !== "") {
      // page state
      lines.push(`  ${styleKey}: \`\${${stateVariableName}}\``);
    } else if (appStateVariableName && appStateVariableName.trim() !== "") {
      // app state
      lines.push(`  ${styleKey}: \`\${get('${appStateVariableName}')}\``);
    }
  });

  console.log(lines.join("\n"));

  if (lines.length === 0) {
    return "";
  }

  return `{\n${lines.join(",\n")}\n}`;
}

async function findStateVariable(propKey, list) {
  const item = list.find((obj) => obj.prop === propKey);
  return item ? item.stateVariableName : "";
}

// Object pool for reusing prop objects
const propPool = {
  pool: [],
  get() {
    return this.pool.pop() || { key: "", value: "" };
  },
  release(obj) {
    obj.key = "";
    obj.value = "";
    if (this.pool.length < 1000) this.pool.push(obj);
  },
  releaseAll(arr) {
    arr.forEach((obj) => this.release(obj));
    arr.length = 0;
  },
};

// Cache for jsonKeys to avoid repeated property access
const keysCache = new Map();

async function componentProps(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  parantType,
  isAbsoluteValue,
  commonStyle,
  projectId,
  pageId,
  parentId,
  componentName = "",
) {
  if (!jsonObject) return [];

  const type = jsonObject[jsonKeys.type];
  if (!type) return [];

  // Reuse array instead of creating new one
  const props = [];

  // Cache frequently accessed paths
  // const wdd = jsonObject[jsonKeys.widgetDefaultData];
  // const style = wdd?.[jsonKeys.style];
  // const wss = style?.[jsonKeys.widgetSpecialStyle];
  // const dwdd = defaultJsonObject?.[jsonKeys.widgetDefaultData];
  // const dstyle = dwdd?.[jsonKeys.style];
  // const dwss = dstyle?.[jsonKeys.widgetSpecialStyle];
  const dwdd = {}; //defaultJsonObject?.[jsonKeys.widgetDefaultData];
  const dstyle = {}; //dwdd?.[jsonKeys.style];
  const dwss = {}; //dstyle?.[jsonKeys.widgetSpecialStyle];

  // Table components - early handling
  const isTableComponent =
    type === "QTableWrapper" ||
    type === "QTable" ||
    type === "QTableRow" ||
    type === "TableRows" ||
    type === "QColumnHeaders";

  if (isTableComponent) {
    await reactCommonStyleProps.styleProps(commonStyle || "", "", type);
  }

  // QRepeat - handle early if not this type, skip
  let variableName = "";
  if (type === "QRepeat") {
    const vars = await reactJsMapper.getPropsAndStateVariablesFromWidget(
      commonUtils?.projectId,
      commonUtils?.pageId,
      jsonObject[jsonKeys.id],
    );
    variableName = await findStateVariable("repeater_data_source", vars);
  }

  // Style props - required for all
  await reactStyleProps.styleProps(
    jsonObject?.widgetDefaultData?.style || "",
    dstyle || "",
    type,
    jsonObject[jsonKeys.id],
  );

  const { onClick, action, navigation } = await getOnClickProps(jsonObject);

  // Form handling - only if needed
  let formInputParsed = null;
  let textInputType = "";
  let itemId = "";
  let formId = "";
  let readOnly = false;
  let disabled = false;

  // const needsFormConfig = projectId && pageId && parentId;

  const parts = typeof parentId === "string" ? parentId.split("-") : [];


  if ( projectId && pageId && parentId !== 0 && parts.length > 1 ) {
     
   // console.log('parentId', parentId)

    if (parts.length < 2) {
      console.error("parentId format invalid:", parentId);
      return;
    }

    const [formId, itemId] = parts;

    const formConfigInfo = await getFormConfigForItem.getFormConfigForItem(
      projectId,
      pageId,
      parentId,
    );

      //  console.log('formConfigInfo', formConfigInfo)

    if (formConfigInfo) {
      const rules = formConfigInfo.validation?.rules || [];
      const config = formConfigInfo.config;

      // Find rules without creating intermediate arrays
      let regexRule, requiredRule, minRule, maxRule;
      for (let i = 0; i < rules.length; i++) {
        const r = rules[i];
        if (r.type === "regex") regexRule = r;
        else if (r.type === "required" && r.value === true) requiredRule = r;
        else if (r.type === "minLength") minRule = r;
        else if (r.type === "maxLength") maxRule = r;
      }

      textInputType = config?.type || "";
      readOnly = config?.inputProps?.readOnly || false;
      disabled = config?.inputProps?.disabled || false;

      // Only get item config if needed
      let formattedOptions = null;
      if (type === "QCheckBox" || type === "QRadio" || type === "QDropdown") {
        const itemConfig = await getFormConfigForItem.getFormItemConfig(
          projectId,
          pageId,
          jsonObject?.id,
          type
        );
        if (Array.isArray(itemConfig) && itemConfig.length > 0) {
          formattedOptions = {
            values: itemConfig.map((item) => ({ l: item.key, v: item.value })),
          };
        }
      }

      formInputParsed = {
        cms_form_input_Id: itemId,
        cms_form_Id: formId,
        cms_form_input_Name:
          config?.id ||
          jsonObject?.widgetDefaultData?.style?.typography?.placeHolder
            ?.value ||
          "",
        cms_form_input_Options: formattedOptions || { values: [] },
        cms_form_input_Required: requiredRule ? "1" : "0",
        cms_form_input_Required_Msg: requiredRule?.message || "",
        cms_form_input_Regex: regexRule?.value || "",
        cms_form_input_Regex_Msg: regexRule?.message || "",
        cms_form_input_Min: minRule?.value || "",
        cms_form_input_Min_Msg: minRule?.message || "",
        cms_form_input_Max: maxRule?.value || "",
        cms_form_input_Max_Msg: maxRule?.message || "",
        cms_form_value: formConfigInfo?.value,
        cms_form_input_On_Change_Validation: formConfigInfo.validation
          ?.autoValidation
          ? "1"
          : "0",
        trailingIconEnabled: config?.inputProps?.trailingIconEnabled || false,
        trailingIconAction: config?.inputProps?.trailingIconAction || "",
      };
    }
  }

  // Get style objects once
  const PropsAndStateVars =
    await reactJsMapper.getPropsAndStateVariablesFromWidget(
      commonUtils?.projectId,
      commonUtils?.pageId,
      jsonObject?.id,
    );

  const finalStyleObj = await generateStyleCode(PropsAndStateVars);

  // State for QRepeat
  let state = null;
  if (type === "QRepeat") {
    const handler = stateHandler.getInstance();
    state = handler.getStateByField(
      String(commonUtils?.pageId),
      "widgetId",
      String(jsonObject?.id),
    );
  }

  // Helper to add prop without object allocation
  const addProp = (key, value) => {
    if (value !== "" && value != null) {
      props.push({ key, value });
    }
  };

  // Common props - always needed
  addProp("style", finalStyleObj);
  addProp("widgetId", jsonObject?.id);
  addProp(jsonKeys.taggedKey, jsonObject[jsonKeys.taggedKey]);
  addProp(jsonKeys.onClick, onClick);
  addProp(jsonKeys.action, action);
  addProp(jsonKeys.navigation, navigation);

  if ((await hasMenuBar(jsonObject)) === "success") {
    addProp(jsonKeys.zIndex, 99999);
  }

  if (parantType === "QStack") {
    addProp(jsonKeys.isAbsoluteValue, true);
  }

  // Type-specific props - use switch for better performance
  switch (type) {
    case "QLineChart":
    case "QAreaChart":
    case "QColumnChart":
    case "QBarChart":
    case "QPieChart": {
      const gl =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.graphLine;
      const layout =
        jsonObject?.widgetDefaultData?.style?.layout?.properties?.flexChild;

      addProp(jsonKeys.childAlign, layout?.childAlign);
      addProp(jsonKeys.markerSize, gl?.markerSize);
      addProp(jsonKeys.showLegend, gl?.showLegend);
      addProp(jsonKeys.xAxisLineWidth, gl?.xAxisLineWidth);
      addProp(jsonKeys.yAxisLineWidth, gl?.yAxisLineWidth);
      addProp(jsonKeys.showTooltip, gl?.showTooltip);
      addProp(jsonKeys.showMarker, gl?.showMarker);
      addProp(jsonKeys.xAxisLabel, gl?.xAxisLabel);
      addProp(jsonKeys.yAxisLabel, gl?.yAxisLabel);

      if (type === "QLineChart") {
        addProp(jsonKeys.xAxisGridLines, gl?.xAxisGridLines);
        addProp(jsonKeys.yAxisGridLines, gl?.yAxisGridLines);
      } else if (type === "QPieChart") {
        const pg =
          jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.pieGraph;
        addProp(jsonKeys.pieChartType, pg?.pieChartType);
        addProp(jsonKeys.tooltipFontSize, pg?.tooltipFontSize);
        addProp(
          jsonKeys.tooltipTextColor,
          removeTransparencyFromHexCode(pg?.tooltipTextColor),
        );
        addProp(jsonKeys.tooltipFontWeight, pg?.tooltipFontWeight);
        addProp(
          jsonKeys.tooltipBgColor,
          removeTransparencyFromHexCode(pg?.tooltipBgColor),
        );
        addProp(jsonKeys.showTooltipShadow, pg?.showTooltipShadow);
        addProp(
          jsonKeys.pieTooltipborderRadiusValueBottomLeft,
          pg?.pieTooltipborderRadiusValueBottomLeft,
        );
        addProp(
          jsonKeys.pieTooltipborderRadiusType,
          pg?.pieTooltipborderRadiusType,
        );
        addProp(
          jsonKeys.pieTooltipborderRadiusValueBottomRight,
          pg?.pieTooltipborderRadiusValueBottomRight,
        );
        addProp(
          jsonKeys.pieTooltipborderRadiusValueTopLeft,
          pg?.pieTooltipborderRadiusValueTopLeft,
        );
        addProp(
          jsonKeys.pieTooltipborderRadiusValueTopRight,
          pg?.pieTooltipborderRadiusValueTopRight,
        );
        addProp(jsonKeys.legendPosition, pg?.legendPosition);
      }
      break;
    }

    case "QRepeat": {
      addProp("repeaterDefaultData", state?.name);
      addProp("loading", "loading");
      addProp("targetKey", jsonObject?.editorSettings?.taggedKey);
      break;
    }

    case "QInputText": {
      addProp("cms_form_Id", formInputParsed?.cms_form_Id);
      addProp("cmsFormInputLabel", formInputParsed?.cms_form_input_Id);
      if (formInputParsed) addProp("errorSet", JSON.stringify(formInputParsed));
      addProp("readOnly", readOnly);
      addProp("disabled", disabled);
      addProp("textInputType", textInputType);
      addProp(
        "placeHolder",
        jsonObject?.widgetDefaultData?.style?.typography?.placeHolder?.value,
      );

      const ph = jsonObject?.widgetDefaultData?.style?.typography?.placeHolder;
      if (ph) {
        const fs = ph.fontSize;
        if (fs) addProp("placeHolderFontSize", (fs.v || "") + (fs.u || ""));
        addProp("placeHolderFontWeight", ph.fontWeight);
        addProp("placeHolderTextColor", commonUtils.hexToRgba(ph.textColor));
      }

      addProp(
        "leftPadding",
        jsonObject?.widgetDefaultData?.style?.spacing?.padding?.left?.v ||
          "15px",
      );
      addProp(
        "fontSize",
        jsonObject?.widgetDefaultData?.style?.typography?.text?.fontSize?.v ||
          "30px",
      );
      break;
    }

    case "QDropdown":
    case "QCheckBox":
    case "QRadio": {
      addProp("cms_form_Id", formInputParsed?.cms_form_Id);
      addProp("cmsFormInputLabel", formInputParsed?.cms_form_input_Id);

      if (formInputParsed) addProp("errorSet", JSON.stringify(formInputParsed));
      addProp(
        "placeHolder",
        jsonObject?.widgetDefaultData?.style?.typography?.placeHolder?.value,
      );

      if (type === "QCheckBox" || type === "QRadio") {
        const cr =
          jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
            ?.checkBoxRadioProperties;
        if (cr) {
          addProp("activeColor", commonUtils.hexToRgba(cr.activeColor));
          addProp("fillColor", commonUtils.hexToRgba(cr.fillColor));
          addProp("inactiveColor", commonUtils.hexToRgba(cr.inactiveColor));
          addProp("flexDirection", cr.shape);
          if (cr.size) addProp("size", (cr.size.v || "") + (cr.size.u || ""));
          if (cr.radius)
            addProp("radius", (cr.radius.v || "") + (cr.radius.u || ""));
        }
      }
      break;
    }

    case "QTextarea": {
      addProp("cms_form_Id", formInputParsed?.cms_form_Id);
      addProp("cmsFormInputLabel", formInputParsed?.cms_form_input_Id);
      if (formInputParsed) addProp("errorSet", JSON.stringify(formInputParsed));
      addProp(
        "placeHolder",
        jsonObject?.widgetDefaultData?.style?.typography?.placeHolder?.value,
      );

      const fd =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData;
      addProp("maxWords", fd?.maxWords);
      addProp("showNumberCount", fd?.showNumberCount);
      addProp("showResizeButton", fd?.showResizeButton);
      break;
    }

    case "QButton": {
      addProp(
        jsonKeys.text,
        jsonObject[jsonKeys.text] || jsonObject[jsonKeys.taggedKey] || "",
      );
      addProp(
        jsonKeys.buttonType,
        jsonObject?.widgetState?.onClick?.action === "Form Submit"
          ? "submit"
          : "button",
      );
      addProp(
        jsonKeys.design,
        jsonObject[jsonKeys.design] || defaultJsonObject?.[jsonKeys.design],
      );
      addProp("tagKey", jsonObject?.editorSettings?.taggedKey);
      break;
    }

    case "QIcon": {
      const iconUseCase =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
          ?.useCase;
      addProp("useCase", iconUseCase);
      if (iconUseCase === "formValidation")
        addProp("cms_form_input_Id", formInputParsed?.cms_form_input_Id);

      addProp("cms_form_Id", formInputParsed?.cms_form_Id);
      addProp(
        "clickableWidget",
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.icon
          ?.clickableWidget,
      );
      addProp(
        jsonKeys.iconLink,
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.icon
          ?.iconUrl || dwss?.icon?.iconUrl,
      );
      break;
    }

    case "QForm": {
      addProp("cms_form_Id", jsonObject?.id);
      addProp("apiUrl", "https://jsonplaceholder.typicode.com/posts");
      break;
    }

    case "QSlider": {
      const sl =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.slider;
      if (sl) {
        addProp("sliderDirection", sl.sliderDirection);
        addProp("sliderIndicatorType", sl.sliderIndicatorType);
        addProp("sliderArrowVisible", sl.sliderArrowVisible);
        addProp("arrowActiveColor", commonUtils.hexToRgba(sl.arrowActiveColor));
        addProp(
          "arrowDeactivatedColor",
          commonUtils.hexToRgba(sl.arrowDeactivatedColor),
        );
        addProp(
          "indicatorActiveColor",
          commonUtils.hexToRgba(sl.indicatorActiveColor),
        );
        addProp(
          "indicatorDeactivatedColor",
          commonUtils.hexToRgba(sl.indicatorDeactivatedColor),
        );
        addProp("indicatorPositionType", sl.indicatorPositionType);
        addProp("sliderAutoPlay", sl.sliderAutoPlay);
        addProp("sliderAutoPlayDuration", sl.sliderAutoPlayDuration);
      }
      break;
    }

    case "QGallery":
    case "QCustomGallery": {
      const gal =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.gallery;
      if (gal) {
        addProp(jsonKeys.column, gal.column);
        if (gal.vSpace)
          addProp(jsonKeys.vSpace, (gal.vSpace.v || "") + (gal.vSpace.u || ""));
        if (gal.hSpace)
          addProp(jsonKeys.hSpace, (gal.hSpace.v || "") + (gal.hSpace.u || ""));
      }
      break;
    }

    case "QTabBar": {
      const tb =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar;
      const dtb = dwss?.tabBar;
      if (tb || dtb) {
        addProp("tabDirection", tb?.tabDirection);
        addProp(
          "dividerColor",
          commonUtils.hexToRgba(tb?.dividerColor) ||
            commonUtils.hexToRgba(dtb?.dividerColor),
        );
        addProp(
          "indicatorColor",
          commonUtils.hexToRgba(tb?.indicatorColor) ||
            commonUtils.hexToRgba(dtb?.indicatorColor),
        );

        const ih = tb?.indicatorHeight || dtb?.indicatorHeight;
        if (ih) addProp("indicatorHeight", (ih.v || "") + (ih.u || ""));

        const ds = tb?.dividerSize || dtb?.dividerSize;
        if (ds) addProp("dividerSize", (ds.v || "") + (ds.u || ""));

        const ths = tb?.tabHeaderSize || dtb?.tabHeaderSize;
        if (ths) addProp("tabHeaderSize", (ths.v || "") + (ths.u || ""));
      }
      break;
    }

    case "QMap": {
      const gm =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.googleMap;
      const dgm = dwss?.googleMap;

      addProp(
        jsonKeys.zoomControlsEnabled,
        gm?.zoomControlsEnabled ?? dgm?.zoomControlsEnabled,
      );
      addProp(jsonKeys.zoom, gm?.zoom ?? dgm?.zoom);
      addProp(jsonKeys.pathType, gm?.pathType ?? dgm?.pathType);
      addProp(
        jsonKeys.boundaryEnabled,
        jsonObject[jsonKeys.boundaryEnabled] ??
          defaultJsonObject?.[jsonKeys.boundaryEnabled],
      );
      addProp(
        jsonKeys.isPolygonEnable,
        jsonObject[jsonKeys.isPolygonEnable] ??
          defaultJsonObject?.[jsonKeys.isPolygonEnable],
      );
      addProp(
        jsonKeys.isCircleRadiusEnable,
        jsonObject[jsonKeys.isCircleRadiusEnable] ??
          defaultJsonObject?.[jsonKeys.isCircleRadiusEnable],
      );
      addProp(
        jsonKeys.mapKey,
        jsonObject[jsonKeys.mapKey] ?? defaultJsonObject?.[jsonKeys.mapKey],
      );
      addProp(
        jsonKeys.radiusColor,
        commonUtils.hexToRgba(jsonObject[jsonKeys.radiusColor]) ??
          commonUtils.hexToRgba(defaultJsonObject?.[jsonKeys.radiusColor]),
      );
      addProp(
        jsonKeys.polygonColor,
        commonUtils.hexToRgba(jsonObject[jsonKeys.polygonColor]) ??
          commonUtils.hexToRgba(defaultJsonObject?.[jsonKeys.polygonColor]),
      );
      addProp(jsonKeys.markers, gm?.markers ?? dgm?.markers);
      addProp(
        jsonKeys.enableFullScreen,
        gm?.enableFullScreen ?? dgm?.enableFullScreen,
      );
      addProp(jsonKeys.centerMarkers, gm?.centerMarkers ?? dgm?.centerMarkers);
      break;
    }

    case "QProgressbarWithPercentage":
    case "QProgressbarWithStepper":
    case "QDashedProgressbar":
    case "QProgressbarWithSlider": {
      const pb =
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.progressBar;
      const dpb = dwss?.progressBar;

      addProp(jsonKeys.shape, pb?.shape || dpb?.shape);

      const thickness = pb?.thickness || dpb?.thickness;
      const thicknessType = pb?.thicknessType || dpb?.thicknessType;
      if (thickness)
        addProp(jsonKeys.thickness, thickness + (thicknessType || ""));

      addProp(jsonKeys.step, pb?.step || dpb?.step);
      addProp(jsonKeys.direction, pb?.direction || dpb?.direction);
      addProp(
        jsonKeys.tooltipColor,
        commonUtils.hexToRgba(pb?.tooltipColor) ||
          commonUtils.hexToRgba(dpb?.tooltipColor),
      );
      addProp(
        jsonKeys.tooltipBackgroundColor,
        commonUtils.hexToRgba(pb?.tooltipBackgroundColor) ||
          commonUtils.hexToRgba(dpb?.tooltipBackgroundColor),
      );
      addProp(
        jsonKeys.tooltipHandleColor,
        commonUtils.hexToRgba(pb?.tooltipHandleColor) ||
          commonUtils.hexToRgba(dpb?.tooltipHandleColor),
      );
      addProp(
        jsonKeys.activeColor,
        commonUtils.hexToRgba(pb?.activeColor) ||
          commonUtils.hexToRgba(dpb?.activeColor),
      );
      addProp(
        jsonKeys.inActiveColor,
        commonUtils.hexToRgba(pb?.inActiveColor) ||
          commonUtils.hexToRgba(dpb?.inActiveColor),
      );
      break;
    }

    case "QVideoNetwork": {
      const videoUrl =
        jsonObject?.widgetDefaultData?.style?.background?.media?.videoUrl ||
        dstyle?.background?.media?.videoUrl;
      addProp(jsonKeys.videoUrl, videoUrl);
      break;
    }

    case "QText": {
      addProp("tagKey", jsonObject?.editorSettings?.taggedKey);
      if (
        jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
          ?.useCase === "formValidation"
      ) {
        addProp("cms_form_input_Id", formInputParsed?.cms_form_input_Id);
      }
      break;
    }

    case "QTextH1":
    case "QTextH2":
    case "QTextH3":
    case "QTextH4":
    case "QTextH5":
    case "QTextH6":
    case "QParagraph":
    case "QImageNetwork": {
      addProp("tagKey", jsonObject?.editorSettings?.taggedKey);
      break;
    }

    case "QParallax": {
      addProp(
        jsonKeys.type,
        parantType === "QParallaxGroup" ? "Horizontal" : "Vertical",
      );
      break;
    }
  }

  // Common props applicable to multiple types
  if (componentName === "QErrorMessage") {
    addProp("cms_form_Id", formInputParsed?.cms_form_Id);
    // addProp("cms_form_input_Id", formInputParsed?.cms_form_input_Id);
  }

  const isPaginationType =
    parantType === "QTablePaginationButton" ||
    parantType === "QTablePaginationInfo" ||
    parantType === "QTablePaginationRPP";
  if (isPaginationType) {
    addProp(jsonKeys.Pagination, true);
  }

  // Image URL
  const imgUrl =
    jsonObject[jsonKeys.taggedKey] ||
    jsonObject[jsonKeys.url] ||
    defaultJsonObject?.[jsonKeys.url];
  addProp(jsonKeys.imageUrl, imgUrl);

  // Misc props
  addProp(jsonKeys.animateType, jsonObject[jsonKeys.animateType]);
  addProp(jsonKeys.divCount, jsonObject[jsonKeys.divCount]);
  addProp(jsonKeys.options, jsonObject[jsonKeys.options]);
  addProp(jsonKeys.endValue, jsonObject[jsonKeys.endValue]);

  // Add style props
  const styleProps = await reactStyleProps.getStyleProps(
    String(jsonObject?.id),
  );
  for (let i = 0; i < styleProps.length; i++) {
    const sp = styleProps[i];
    if (sp.value !== "" && sp.value != null) {
      props.push(sp);
    }
  }

  addProp(
    "tailwaindClasses",
    (await reactStyleProps.getTailwaindClasses(String(jsonObject?.id)))?.trim(),
  );

  // Table component styles
  if (isTableComponent) {
    const commonStyleProps = await reactCommonStyleProps.getStyleProps();
    for (let i = 0; i < commonStyleProps.length; i++) {
      const csp = commonStyleProps[i];
      if (csp.value !== "" && csp.value != null) {
        props.push(csp);
      }
    }
    addProp(
      "commonTailwaindClasses",
      (await reactCommonStyleProps.getTailwaindClasses())?.trim(),
    );
  }

  // Animation props
  if (jsonObject?.widgetDefaultData?.style?.animation?.length > 0) {
    const animProps = extractAnimationProps(
      jsonObject?.widgetDefaultData?.style?.animation,
    );
    for (let i = 0; i < animProps.length; i++) {
      const ap = animProps[i];
      if (ap.value !== "" && ap.value != null) {
        props.push(ap);
      }
    }
  }

  return props;
}

// Optimized animation extraction
function extractAnimationProps(data) {
  if (!data || data.length === 0) return [];

  const props = [];
  const len = data.length;

  // Pre-allocate string builders
  const animationType = [];
  const direction = [];
  const easing = [];
  const iterations = [];
  const delay = [];
  const reversed = [];
  const duration = [];
  const maxValue = [];
  const minValue = [];
  const midValue = [];


  for (let i = 0; i < len; i++) {
    const item = data[i];

    if (item.animationType) animationType.push(item.animationType);
    if (item.direction) direction.push(item.direction);
    if (item.fillMode) easing.push(item.fillMode.replace(/^easing/, "ease"));
    if (item.iterationCount) iterations.push(item.iterationCount);

    // Delay conversion
    const delayVal = item.delay;
    if (delayVal != null) {
      const delayUnit = item.delayUnit;
      let converted = "";
      const num = parseFloat(delayVal);

      if (delayUnit === "ms") converted = num / 1000 + "s";
      else if (delayUnit === "m") converted = num * 60 + "s";
      else if (delayUnit === "hr") converted = num * 3600 + "s";
      else if (delayUnit === "s") converted = delayVal + "s";
      else converted = num / 1000 + "s";

      delay.push(converted);
    }

    reversed.push(item.isReversed === true ? "true" : "false");

    // Duration conversion
    const durVal = item.duration;
    if (durVal != null) {
      const durUnit = item.durationUnit;
      let converted = "";
      const num = parseFloat(durVal);

      if (durUnit === "ms") converted = num / 1000 + "s";
      else if (durUnit === "m") converted = num * 60 + "s";
      else if (durUnit === "hr") converted = num * 3600 + "s";
      else if (durUnit === "s") converted = durVal + "s";
      else {
        const str = String(durVal);
        converted = str.endsWith("s") ? str : num / 1000 + "s";
      }

      duration.push(converted);
    }

    if (item.maxValue) maxValue.push(item.maxValue);
    if (item.minValue) minValue.push(item.minValue);
    if (item.midValue) midValue.push(item.midValue);

  }

  props.push({ key: jsonKeys.isAnimationP, value: "true" });
  if (animationType.length)
    props.push({
      key: jsonKeys.animationType,
      value: animationType.join(", "),
    });
  if (direction.length)
    props.push({
      key: jsonKeys.animationDirection,
      value: direction.join(", ") || "none",
    });
  if (easing.length)
    props.push({ key: jsonKeys.animationEasing, value: easing.join(", ") });
  if (iterations.length)
    props.push({
      key: jsonKeys.animationIterations,
      value: iterations.join(", "),
    });
  if (delay.length)
    props.push({ key: jsonKeys.animationDelay, value: delay.join(", ") });
  if (reversed.length)
    props.push({ key: jsonKeys.isRevarsed, value: reversed.join(", ") });
  if (duration.length)
    props.push({ key: jsonKeys.animationDuration, value: duration.join(", ") });
  if (maxValue.length)
    props.push({ key: jsonKeys.maxValue, value: maxValue.join(", ") });
  if (minValue.length)
    props.push({ key: jsonKeys.minValue, value: minValue.join(", ") });
  if (midValue.length)
    props.push({ key: jsonKeys.midValue, value: midValue.join(", ") });


  return props;
}

async function componentProps2(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  parantType,
  isAbsoluteValue,
  commonStyle,
  projectId,
  pageId,
  parentId,
  componentName = "",
) {
  if (
    jsonObject[jsonKeys.type] == "QTableWrapper" ||
    jsonObject[jsonKeys.type] == "QTable" ||
    jsonObject[jsonKeys.type] == "QTableRow" ||
    jsonObject[jsonKeys.type] == "TableRows" ||
    jsonObject[jsonKeys.type] == "QColumnHeaders"
  ) {
    //console.log("commonStyle in componentProps:", commonStyle);
    await reactCommonStyleProps.styleProps(
      commonStyle ?? "",
      "",
      jsonObject[jsonKeys.type],
    );
  }

  let variableName = "";
  if (jsonObject[jsonKeys.type] == "QRepeat") {
    let PropsAndStateVariablesFromWidget =
      await reactJsMapper.getPropsAndStateVariablesFromWidget(
        commonUtils?.projectId,
        commonUtils?.pageId,
        jsonObject[jsonKeys.id],
      );
    variableName = await findStateVariable(
      "repeater_data_source",
      PropsAndStateVariablesFromWidget,
    );
    PropsAndStateVariablesFromWidget = null;
  }

  await reactStyleProps.styleProps(
    jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style] ?? "",
    defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style] ?? "",
    jsonObject[jsonKeys.type],
    jsonObject[jsonKeys.id],
  );
  const { onClick, action, navigation } = await getOnClickProps(jsonObject);

  let formInputParsed = {};

  const useCase =
    jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
      ?.useCase ?? "";

  //Form info get ------------------------
  //console.log('projectId, pageId, parentId', projectId, pageId, parentId)
  //console.log('formInfo', JSON.stringify (await getFormConfigForItem.getFormConfigForItem(projectId, pageId, parentId)));
  let formConfigInfo;
  let formItemConfigInfo;
  let textInputType = "";
  let itemId = "";
  let formId = "";
  let readOnly = false;
  let disabled = false;

  if (projectId && pageId && parentId) {
    const [formIdd, itemSId] = parentId.split("-");
    itemId = itemSId;
    formId = formIdd;

    formConfigInfo = await getFormConfigForItem.getFormConfigForItem(
      projectId,
      pageId,
      parentId,
    );

    const regexRule = formConfigInfo?.validation?.rules?.find(
      (rule) => rule.type === "regex",
    );
    const requiredRule = formConfigInfo?.validation?.rules?.find(
      (rule) => rule.type === "required" && rule.value === true,
    );
    const minRule = formConfigInfo?.validation?.rules?.find(
      (rule) => rule.type === "minLength",
    );
    const maxRule = formConfigInfo?.validation?.rules?.find(
      (rule) => rule.type === "maxLength",
    );

    const isRequired = !!requiredRule;
    const autoValidationValue = formConfigInfo?.validation?.autoValidation;
    textInputType = formConfigInfo?.config?.type;
    readOnly = formConfigInfo?.config?.inputProps?.readOnly;
    disabled = formConfigInfo?.config?.inputProps?.disabled;

    if (
      jsonObject[jsonKeys.type] === "QCheckBox" ||
      jsonObject[jsonKeys.type] === "QRadio" ||
      jsonObject[jsonKeys.type] === "QDropdown"
    ) {
      formItemConfigInfo = await getFormConfigForItem.getFormItemConfig(
        projectId,
        pageId,
        jsonObject?.id,
      );
    }

    // Ensure we have an array before mapping
    const optionsArray = Array.isArray(formItemConfigInfo)
      ? formItemConfigInfo
      : [];

    const formattedOptions = {
      values: optionsArray.map((item) => ({
        l: item.key,
        v: item.value,
      })),
    };

    //  console.log('formConfigInfo', formConfigInfo?.config?.id)

    formInputParsed = {
      cms_form_input_Id: itemId,
      cms_form_Id: formId,
      cms_form_input_Name:
        formConfigInfo?.config?.id ??
        jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.typography
          ?.placeHolder?.value,
      cms_form_input_Options: formattedOptions,
      cms_form_input_Required: isRequired ? "1" : "0",
      cms_form_input_Required_Msg: isRequired ? requiredRule.message : "",
      cms_form_input_Regex: regexRule?.value || "",
      cms_form_input_Regex_Msg: regexRule?.message || "",
      cms_form_input_Min: minRule?.value || "",
      cms_form_input_Min_Msg: minRule?.message || "",
      cms_form_input_Max: maxRule?.value || "",
      cms_form_input_Max_Msg: maxRule?.message || "",
      cms_form_input_On_Change_Validation: autoValidationValue ? "1" : "0",
      trailingIconEnabled:
        formConfigInfo?.config?.inputProps?.trailingIconEnabled,
      trailingIconAction:
        formConfigInfo?.config?.inputProps?.trailingIconAction,
    };
  }

  //--------------------------------------
  // if (jsonObject[jsonKeys.type] == "QAreaChart") {
  //   console.log("value:", jsonKeys.xAxisGridLines);
  //   console.log("value:", jsonKeys.yAxisGridLines);

  //   console.log(
  //     "value1:",
  //     jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
  //       jsonKeys.widgetSpecialStyle
  //     ]?.graphLine?.yAxisGridLines
  //   )

  //   console.log(
  //     "value1:",
  //     jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
  //       jsonKeys.widgetSpecialStyle
  //     ]?.graphLine?.xAxisGridLines

  //   );

  //   console.log("value:", jsonKeys.showLegend);
  //   console.log(
  //     "value1:",
  //     jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
  //       jsonKeys.widgetSpecialStyle
  //     ]?.graphLine?.showLegend
  //   );
  // }

  //lineChart test
  // if(jsonObject[jsonKeys.type] == "QLineChart"){
  //   //  console.log("Line X value:", jsonKeys.xAxisGridLines);
  //   //  console.log("Line Y value:", jsonKeys.yAxisGridLines);
  //    console.log("Line X width:", jsonKeys.xAxisLineWidth);
  //    console.log("Line Y width:", jsonKeys.yAxisLineWidth);

  //   // console.log( "Xvalue1:",jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[jsonKeys.widgetSpecialStyle]?.graphLine?.xAxisGridLines);
  //   // console.log( "Yvalue2:",jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[jsonKeys.widgetSpecialStyle]?.graphLine?.yAxisGridLines);
  //   console.log( "X width:",jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[jsonKeys.widgetSpecialStyle]?.graphLine?.xAxisLineWidth);
  //   console.log( "Y width:",jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[jsonKeys.widgetSpecialStyle]?.graphLine?.yAxisLineWidth);
  // }

  if (jsonObject[jsonKeys.type] == "QColumnChart") {
    console.log("value", jsonKeys.childAlign);
    // console.log(
    //   "Column valuessssssssssssssssssss",
    //   jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //     jsonKeys.widgetSpecialStyle
    //   ]?.pieGraph?.childAlign
    // );

    console.log(
      "Column X valuessssssssssssssssssss",
      jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
        jsonKeys.widgetSpecialStyle
      ]?.graphLine?.xAxisGridLines,
    );
    console.log(
      "Column Y valuessssssssssssssssssss",
      jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
        jsonKeys.widgetSpecialStyle
      ]?.graphLine?.yAxisGridLines,
    );
  }

  const chartTypes = [
    "QLineChart",
    "QAreaChart",
    "QColumnChart",
    "QBarChart",
    "QPieChart",
  ];

  PropsAndStateVariablesFromWidget =
    await reactJsMapper.getPropsAndStateVariablesFromWidget(
      commonUtils?.projectId,
      commonUtils?.pageId,
      jsonObject?.id,
    );

  const finalStyleObj = await generateStyleCode(
    PropsAndStateVariablesFromWidget,
  );
  //console.log("finalStyleObj", finalStyleObj);

  const handler = stateHandler.getInstance();
  let state = "";
  if (jsonObject?.type === "QRepeat") {
    state = handler.getStateByField(
      String(commonUtils?.pageId),
      "widgetId",
      String(jsonObject?.id),
    );
  }

  props = [
    //combines
    // {
    //   key: jsonKeys.childAlign,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.layout
    //       ]?.[jsonKeys.properties]?.flexChild?.childAlign
    //     : "",
    // },
    //  {
    //   key: jsonKeys.markerSize,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.markerSize
    //     : "",
    // },
    // {
    //   key: jsonKeys.showLegend,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.showLegend
    //     : "",
    // },
    //   {
    //   key: jsonKeys.xAxisGridLines,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.xAxisGridLines
    //     : "",
    // },
    //   {
    //   key: jsonKeys.yAxisGridLines,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.yAxisGridLines
    //     : "",
    // },
    //   {
    //   key: jsonKeys.xAxisLineWidth,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.xAxisLineWidth
    //     : "",
    // },
    //   {
    //   key: jsonKeys.yAxisLineWidth,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.yAxisLineWidth
    //     : "",
    // },

    //  {
    //   key: jsonKeys.showTooltip,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.showTooltip
    //     : "",
    // },
    //  {
    //   key: jsonKeys.showMarker,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.showMarker
    //     : "",
    // },
    //  {
    //   key: jsonKeys.xAxisLabel,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.xAxisLabel
    //     : "",
    // },
    //  {
    //   key: jsonKeys.yAxisLabel,
    //   value: chartTypes.includes(jsonObject[jsonKeys.type])
    //     ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
    //         jsonKeys.widgetSpecialStyle
    //       ]?.[jsonKeys.graphLine]?.yAxisLabel
    //     : "",
    // },

    ///////////////////////////////////////////////////////////////////////////////////////////////////area chart
    {
      key: jsonKeys.xAxisGridLines,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisGridLines
          : "",
    },

    {
      key: jsonKeys.yAxisGridLines,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisGridLines
          : "",
    },

    {
      key: jsonKeys.xAxisLineWidth,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisLineWidth
          : "",
    },

    {
      key: jsonKeys.yAxisLineWidth,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisLineWidth
          : "",
    },

    {
      key: jsonKeys.showLegend,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showLegend
          : "",
    },

    {
      key: jsonKeys.xAxisLabel,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisLabel
          : "",
    },

    {
      key: jsonKeys.yAxisLabel,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisLabel
          : "",
    },

    {
      key: jsonKeys.showMarker,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showMarker
          : "",
    },

    {
      key: jsonKeys.markerSize,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.markerSize
          : "",
    },

    {
      key: jsonKeys.showTooltip,
      value:
        jsonObject[jsonKeys.type] == "QAreaChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showTooltip
          : "",
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////column chart

    {
      key: jsonKeys.xAxisGridLines,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisGridLines
          : "",
    },

    {
      key: jsonKeys.yAxisGridLines,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisGridLines
          : "",
    },

    {
      key: jsonKeys.xAxisLineWidth,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisLineWidth
          : "",
    },

    {
      key: jsonKeys.yAxisLineWidth,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisLineWidth
          : "",
    },

    {
      key: jsonKeys.showLegend,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showLegend
          : "",
    },

    {
      key: jsonKeys.xAxisLabel,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisLabel
          : "",
    },
    {
      key: jsonKeys.yAxisLabel,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisLabel
          : "",
    },

    {
      key: jsonKeys.showMarker,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showMarker
          : "",
    },

    {
      key: jsonKeys.markerSize,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.markerSize
          : "",
    },

    {
      key: jsonKeys.showTooltip,
      value:
        jsonObject[jsonKeys.type] == "QColumnChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showTooltip
          : "",
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////line chart
    {
      key: jsonKeys.xAxisGridLines,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisGridLines
          : "",
    },

    {
      key: jsonKeys.yAxisGridLines,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisGridLines
          : "",
    },

    {
      key: jsonKeys.xAxisLineWidth,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisLineWidth
          : "",
    },

    {
      key: jsonKeys.yAxisLineWidth,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisLineWidth
          : "",
    },

    {
      key: jsonKeys.showLegend,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showLegend
          : "",
    },

    {
      key: jsonKeys.xAxisLabel,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.xAxisLabel
          : "",
    },

    {
      key: jsonKeys.yAxisLabel,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.yAxisLabel
          : "",
    },

    {
      key: jsonKeys.markerSize,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.markerSize
          : "",
    },

    {
      key: jsonKeys.showTooltip,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showTooltip
          : "",
    },

    {
      key: jsonKeys.showMarker,
      value:
        jsonObject[jsonKeys.type] == "QLineChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.graphLine?.showMarker
          : "",
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////pie chart
    {
      key: jsonKeys.pieChartType,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.pieChartType
          : "",
    },
    {
      key: jsonKeys.tooltipFontSize,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.tooltipFontSize
          : "",
    },
    {
      key: jsonKeys.tooltipTextColor,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? removeTransparencyFromHexCode(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.pieGraph?.tooltipTextColor ?? "",
            ) //need fallback
          : "",
    },
    {
      key: jsonKeys.tooltipFontWeight,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.tooltipFontWeight
          : "",
    },
    {
      key: jsonKeys.tooltipBgColor,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? removeTransparencyFromHexCode(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.pieGraph?.tooltipBgColor ?? "",
            )
          : "", //needed fallback
    },

    {
      key: jsonKeys.showTooltipShadow,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.showTooltipShadow
          : "",
    },
    {
      key: jsonKeys.pieTooltipborderRadiusValueBottomLeft,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.pieTooltipborderRadiusValueBottomLeft
          : "",
    },
    {
      key: jsonKeys.pieTooltipborderRadiusType,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.pieTooltipborderRadiusType
          : "",
    },
    {
      key: jsonKeys.pieTooltipborderRadiusValueBottomRight,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.pieTooltipborderRadiusValueBottomRight
          : "",
    },
    {
      key: jsonKeys.pieTooltipborderRadiusValueTopLeft,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.pieTooltipborderRadiusValueTopLeft
          : "",
    },
    {
      key: jsonKeys.pieTooltipborderRadiusValueTopRight,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.pieTooltipborderRadiusValueTopRight
          : "",
    },
    {
      key: jsonKeys.legendPosition,
      value:
        jsonObject[jsonKeys.type] == "QPieChart"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.pieGraph?.legendPosition
          : "",
    },

    ///////////////////////////////////////

    {
      key: "repeaterDefaultData",
      value: jsonObject?.type === "QRepeat" ? state?.name : "",
    },

    {
      key: "loading",
      value: jsonObject?.type === "QRepeat" ? "loading" : "",
    },

    {
      key: "useCase",
      value:
        jsonObject?.type === "QIcon"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
              ?.useCase
          : "",
    },

    {
      key: "style",
      value: finalStyleObj ?? "",
    },
    {
      key: "readOnly",
      value: jsonObject[jsonKeys.type] == "QInputText" ? readOnly : "",
    },

    {
      key: "disabled",
      value: jsonObject[jsonKeys.type] == "QInputText" ? disabled : "",
    },

    {
      key: "cms_form_Id",
      value:
        jsonObject[jsonKeys.type] === "QForm"
          ? jsonObject?.id
          : jsonObject[jsonKeys.type] == "QInputText" ||
              jsonObject[jsonKeys.type] == "QDropdown" ||
              jsonObject[jsonKeys.type] == "QCheckBox" ||
              jsonObject[jsonKeys.type] == "QRadio" ||
              jsonObject[jsonKeys.type] === "QTextarea" ||
              jsonObject[jsonKeys.type] === "QIcon" ||
              componentName === "QErrorMessage"
            ? formId
            : "",
    },

    {
      key: "cmsFormInputLabel",
      value:
        jsonObject[jsonKeys.type] == "QInputText" ||
        jsonObject[jsonKeys.type] == "QDropdown" ||
        jsonObject[jsonKeys.type] == "QCheckBox" ||
        jsonObject[jsonKeys.type] == "QRadio" ||
        jsonObject[jsonKeys.type] === "QTextarea"
          ? itemId
          : "",
    },

    {
      key: "errorSet",
      value:
        jsonObject[jsonKeys.type] == "QInputText" ||
        jsonObject[jsonKeys.type] == "QDropdown" ||
        jsonObject[jsonKeys.type] == "QCheckBox" ||
        jsonObject[jsonKeys.type] == "QRadio" ||
        jsonObject[jsonKeys.type] === "QTextarea"
          ? JSON.stringify(formInputParsed)
          : "",
    },

    {
      key: "cms_form_input_Id",
      value:
        (jsonObject?.type === "QText" && useCase === "formValidation") ||
        jsonObject[jsonKeys.type] === "QIcon"
          ? itemId
          : "",
    },

    {
      key: "textInputType",
      value: textInputType,
    },

    {
      key: "placeHolder",
      value:
        jsonObject[jsonKeys.type] === "QInputText" ||
        jsonObject[jsonKeys.type] === "QDropdown" ||
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio" ||
        jsonObject[jsonKeys.type] === "QTextarea"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.typography?.placeHolder?.value
          : "",
    },

    {
      key: "placeHolderFontSize",
      value:
        jsonObject["type"] === "QInputText"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.typography?.placeHolder?.fontSize?.v ??
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.typography?.placeHolder?.fontSize?.v ??
              "") +
            (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.typography?.placeHolder?.fontSize?.u ??
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.typography?.placeHolder?.fontSize?.u ??
              "")
          : "",
    },

    {
      key: "placeHolderFontWeight",
      value:
        jsonObject[jsonKeys.type] == "QInputText"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.typography?.placeHolder?.fontWeight
          : "",
    },

    {
      key: "leftPadding",
      value:
        jsonObject[jsonKeys.type] === "QInputText"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.spacing
              ?.padding?.left?.v || "15px"
          : "",
    },

    {
      key: "fontSize",
      value:
        jsonObject[jsonKeys.type] === "QInputText"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.typography?.text?.fontSize?.v || "30px"
          : "",
    },

    {
      key: "placeHolderTextColor",
      value:
        jsonObject[jsonKeys.type] == "QInputText"
          ? commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.typography?.placeHolder?.textColor,
            )
          : "",
    },

    {
      key: jsonKeys.taggedKey,
      value: jsonObject[jsonKeys.taggedKey] ?? "",
    },
    {
      key: jsonKeys.onClick,
      value: onClick,
    },
    {
      key: jsonKeys.action,
      value: action,
    },
    {
      key: jsonKeys.navigation,
      value: navigation,
    },
    {
      key: jsonKeys.zIndex,
      value: (await hasMenuBar(jsonObject)) == "success" ? 99999 : "",
    },

    {
      key: jsonKeys.isAbsoluteValue,
      value: parantType === "QStack" ? true : "",
    },

    {
      key: jsonKeys.Pagination,
      value:
        parantType === "QTablePaginationButton" ||
        parantType === "QTablePaginationInfo" ||
        parantType === "QTablePaginationRPP"
          ? true
          : "",
    },

    {
      key: jsonKeys.text,
      value:
        jsonObject[jsonKeys.type] == "QButton"
          ? (jsonObject[jsonKeys.text] ?? jsonObject[jsonKeys.taggedKey] ?? "")
          : "",
    },

    {
      key: jsonKeys.buttonType,
      value:
        jsonObject[jsonKeys.type] == "QButton"
          ? jsonObject?.widgetState?.onClick?.action == "Form Submit"
            ? "submit"
            : "button"
          : "",
    },

    {
      key: jsonKeys.design,
      value:
        jsonObject[jsonKeys.type] == "QButton"
          ? (jsonObject[jsonKeys.design] ?? defaultJsonObject[jsonKeys.design])
          : "",
    },

    {
      key: jsonKeys.imageUrl,
      value: jsonObject[jsonKeys.taggedKey]
        ? jsonObject[jsonKeys.taggedKey]
        : jsonObject[jsonKeys.url]
          ? jsonObject[jsonKeys.url]
          : (defaultJsonObject?.[jsonKeys.url] ?? ""),
    },

    {
      key: jsonKeys.animateType,
      value: jsonObject[jsonKeys.animateType] ?? "",
    },
    {
      key: jsonKeys.divCount,
      value: jsonObject[jsonKeys.divCount] ?? "",
    },

    {
      key: jsonKeys.options,
      value: jsonObject[jsonKeys.options] ?? "",
    },

    {
      key: jsonKeys.endValue,
      value: jsonObject[jsonKeys.endValue] ?? "",
    },

    {
      key: jsonKeys.type,
      value:
        jsonObject[jsonKeys.type] == "QParallax"
          ? parantType === "QParallaxGroup"
            ? "Horizontal"
            : "Vertical"
          : "",
    },

    {
      key: "sliderDirection",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.slider?.sliderDirection
          : "",
    },

    {
      key: "sliderIndicatorType",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.slider?.sliderIndicatorType
          : "",
    },

    {
      key: "sliderArrowVisible",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.slider?.sliderArrowVisible
          : "",
    },

    {
      key: "arrowActiveColor",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.slider?.arrowActiveColor,
            )
          : "",
    },

    {
      key: "arrowDeactivatedColor",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.slider?.arrowDeactivatedColor,
            )
          : "",
    },

    {
      key: "indicatorActiveColor",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.slider?.indicatorActiveColor,
            )
          : "",
    },

    {
      key: "indicatorDeactivatedColor",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.slider?.indicatorDeactivatedColor,
            )
          : "",
    },

    {
      key: "indicatorPositionType",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.slider?.indicatorPositionType
          : "",
    },

    {
      key: "sliderAutoPlay",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.slider?.sliderAutoPlay
          : "",
    },

    {
      key: "sliderAutoPlayDuration",
      value:
        jsonObject[jsonKeys.type] == "QSlider"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.slider?.sliderAutoPlayDuration
          : "",
    },

    {
      key: jsonKeys.column,
      value:
        jsonObject[jsonKeys.type] == "QGallery" || "QCustomGallery"
          ? jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.gallery]?.[jsonKeys.column]
          : "",
    },

    {
      key: jsonKeys.vSpace,
      value:
        jsonObject?.[jsonKeys.type] === "QGallery" || "QCustomGallery"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.gallery]?.[jsonKeys.vSpace]?.[jsonKeys.v] ?? "") +
            (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.gallery]?.[jsonKeys.vSpace]?.[jsonKeys.u] ?? "")
          : "",
    },

    {
      key: jsonKeys.hSpace,
      value:
        jsonObject?.[jsonKeys.type] === "QGallery" || "QCustomGallery"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.gallery]?.[jsonKeys.hSpace]?.[jsonKeys.v] ?? "") +
            (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.gallery]?.[jsonKeys.hSpace]?.[jsonKeys.u] ?? "")
          : "",
    },

    {
      key: "clickableWidget",
      value:
        jsonObject["type"] == "QIcon"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.icon
              ?.clickableWidget
          : "",
    },

    {
      key: "tabDirection",
      value:
        jsonObject["type"] == "QTabBar"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.tabDirection
          : "",
    },

    {
      key: "dividerColor",
      value:
        jsonObject["type"] == "QTabBar"
          ? (commonUtils.hexToRgba(
              jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
                ?.dividerColor,
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.dividerColor,
            ))
          : "",
    },

    {
      key: "indicatorColor",
      value:
        jsonObject["type"] == "QTabBar"
          ? (commonUtils.hexToRgba(
              jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
                ?.indicatorColor,
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.indicatorColor,
            ))
          : "",
    },

    {
      key: "indicatorHeight",
      value:
        jsonObject["type"] === "QTabBar"
          ? (jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.indicatorHeight?.v ??
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.indicatorHeight?.v ??
              "") +
            (jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.indicatorHeight?.u ??
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.indicatorHeight?.u ??
              "")
          : "",
    },

    {
      key: "dividerSize",
      value:
        jsonObject["type"] === "QTabBar"
          ? (jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.dividerSize?.v ??
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.dividerSize?.v ??
              "") +
            (jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.dividerSize?.u ??
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.dividerSize?.u ??
              "")
          : "",
    },

    {
      key: "tabHeaderSize",
      value:
        jsonObject["type"] === "QTabBar"
          ? (jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.tabHeaderSize?.v ??
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.tabHeaderSize?.v ??
              "") +
            (jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.tabBar
              ?.tabHeaderSize?.u ??
              defaultJsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.tabBar?.tabHeaderSize?.u ??
              "")
          : "",
    },

    {
      key: jsonKeys?.videoUrl ?? "",
      value:
        jsonObject[jsonKeys?.type] == "QVideoNetwork"
          ? (jsonObject?.[jsonKeys?.widgetDefaultData]?.[jsonKeys?.style]?.[
              jsonKeys?.background
            ]?.[jsonKeys?.media][jsonKeys?.videoUrl] ??
            defaultJsonObject?.[jsonKeys?.widgetDefaultData]?.[
              jsonKeys?.style
            ]?.[jsonKeys?.background]?.[jsonKeys?.media][jsonKeys?.videoUrl])
          : "",
    },

    {
      key: jsonKeys.iconLink,
      value:
        jsonObject[jsonKeys.type] == "QIcon"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.icon]?.[jsonKeys.iconUrl] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.icon]?.[jsonKeys.iconUrl])
          : "",
    },

    {
      key: jsonKeys.zoomControlsEnabled,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.zoomControlsEnabled] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.zoomControlsEnabled])
          : "",
    },

    {
      key: jsonKeys.zoom,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.zoom] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.zoom])
          : "",
    },

    {
      key: jsonKeys.pathType,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.pathType] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.pathType])
          : "",
    },

    {
      key: jsonKeys.boundaryEnabled,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject[jsonKeys.boundaryEnabled] ??
            defaultJsonObject[jsonKeys.boundaryEnabled])
          : "",
    },

    {
      key: jsonKeys.isPolygonEnable,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject[jsonKeys.isPolygonEnable] ??
            defaultJsonObject[jsonKeys.isPolygonEnable])
          : "",
    },

    {
      key: jsonKeys.isCircleRadiusEnable,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject[jsonKeys.isCircleRadiusEnable] ??
            defaultJsonObject[jsonKeys.isCircleRadiusEnable])
          : "",
    },

    {
      key: jsonKeys.mapKey,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject[jsonKeys.mapKey] ?? defaultJsonObject[jsonKeys.mapKey])
          : "",
    },

    {
      key: jsonKeys.radiusColor,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (commonUtils.hexToRgba(jsonObject[jsonKeys.radiusColor]) ??
            commonUtils.hexToRgba(defaultJsonObject[jsonKeys.radiusColor]))
          : "",
    },

    {
      key: jsonKeys.polygonColor,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (commonUtils.hexToRgba(jsonObject[jsonKeys.polygonColor]) ??
            commonUtils.hexToRgba(defaultJsonObject[jsonKeys.polygonColor]))
          : "",
    },

    {
      key: jsonKeys.markers,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.markers] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.markers])
          : "",
    },
    {
      key: jsonKeys.enableFullScreen,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.enableFullScreen] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.enableFullScreen])
          : "",
    },

    {
      key: jsonKeys.centerMarkers,
      value:
        jsonObject[jsonKeys.type] == "QMap"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.googleMap][jsonKeys.centerMarkers] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.googleMap[jsonKeys.centerMarkers])
          : "",
    },

    {
      key: "apiUrl",
      value:
        jsonObject[jsonKeys.type] == "QForm"
          ? "https://jsonplaceholder.typicode.com/posts"
          : "",
    },

    {
      key: "activeColor",
      value:
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio"
          ? commonUtils.hexToRgba(
              jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.checkBoxRadioProperties?.activeColor,
            )
          : "",
    },

    {
      key: "fillColor",
      value:
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio"
          ? commonUtils.hexToRgba(
              jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.checkBoxRadioProperties?.fillColor,
            )
          : "",
    },

    {
      key: "inactiveColor",
      value:
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio"
          ? commonUtils.hexToRgba(
              jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
                ?.checkBoxRadioProperties?.inactiveColor,
            )
          : "",
    },

    {
      key: "flexDirection",
      value:
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle
              ?.checkBoxRadioProperties?.shape
          : "",
    },

    {
      key: "size",
      value:
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.widgetSpecialStyle?.checkBoxRadioProperties?.size?.v ??
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.widgetSpecialStyle?.checkBoxRadioProperties?.size?.v ??
              "") +
            (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.widgetSpecialStyle?.checkBoxRadioProperties?.size?.u ??
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.widgetSpecialStyle?.checkBoxRadioProperties?.size?.u ??
              "")
          : "",
    },

    {
      key: "radius",
      value:
        jsonObject[jsonKeys.type] === "QCheckBox" ||
        jsonObject[jsonKeys.type] === "QRadio"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.widgetSpecialStyle?.checkBoxRadioProperties?.radius?.v ??
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.widgetSpecialStyle?.checkBoxRadioProperties?.radius?.v ??
              "") +
            (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
              ?.widgetSpecialStyle?.checkBoxRadioProperties?.radius?.u ??
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]
                ?.widgetSpecialStyle?.checkBoxRadioProperties?.radius?.u ??
              "")
          : "",
    },

    {
      key: "maxWords",
      value:
        jsonObject[jsonKeys.type] == "QTextarea"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
              ?.maxWords
          : "",
    },

    {
      key: "showNumberCount",
      value:
        jsonObject[jsonKeys.type] == "QTextarea"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
              ?.showNumberCount
          : "",
    },

    {
      key: "showResizeButton",
      value:
        jsonObject[jsonKeys.type] == "QTextarea"
          ? jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.formData
              ?.showResizeButton
          : "",
    },

    {
      key: jsonKeys.shape,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar][jsonKeys.shape] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar][jsonKeys.shape])
          : "",
    },

    {
      key: jsonKeys.thickness,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar]?.[jsonKeys.thickness] ??
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar]?.[
                jsonKeys.thickness
              ] ??
              "") +
            "" +
            (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar]?.[jsonKeys.thicknessType] ??
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar]?.[
                jsonKeys.thicknessType
              ] ??
              "")
          : "",
    },

    {
      key: jsonKeys.step,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar][jsonKeys.step] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar][jsonKeys.step])
          : "",
    },

    {
      key: jsonKeys.direction,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar][jsonKeys.direction] ??
            defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
              jsonKeys.widgetSpecialStyle
            ]?.[jsonKeys.progressBar][jsonKeys.direction])
          : "",
    },

    {
      key: jsonKeys.tooltipColor,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.[jsonKeys.progressBar][jsonKeys.tooltipColor],
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar][
                jsonKeys.tooltipColor
              ],
            ))
          : "",
    },

    {
      key: jsonKeys.tooltipBackgroundColor,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.[jsonKeys.progressBar][jsonKeys.tooltipBackgroundColor],
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar][
                jsonKeys.tooltipBackgroundColor
              ],
            ))
          : "",
    },

    {
      key: jsonKeys.tooltipHandleColor,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.[jsonKeys.progressBar][jsonKeys.tooltipHandleColor],
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar][
                jsonKeys.tooltipHandleColor
              ],
            ))
          : "",
    },

    {
      key: jsonKeys.activeColor,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.[jsonKeys.progressBar][jsonKeys.activeColor],
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar][
                jsonKeys.activeColor
              ],
            ))
          : "",
    },

    {
      key: jsonKeys.inActiveColor,
      value:
        jsonObject[jsonKeys.type] == "QProgressbarWithPercentage" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithStepper" ||
        jsonObject[jsonKeys.type] == "QDashedProgressbar" ||
        jsonObject[jsonKeys.type] == "QProgressbarWithSlider"
          ? (commonUtils.hexToRgba(
              jsonObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
                jsonKeys.widgetSpecialStyle
              ]?.[jsonKeys.progressBar][jsonKeys.inActiveColor],
            ) ??
            commonUtils.hexToRgba(
              defaultJsonObject?.[jsonKeys.widgetDefaultData]?.[
                jsonKeys.style
              ]?.[jsonKeys.widgetSpecialStyle]?.[jsonKeys.progressBar][
                jsonKeys.inActiveColor
              ],
            ))
          : "",
    },

    {
      key: "targetKey",
      value:
        jsonObject[jsonKeys.type] == "QRepeat"
          ? jsonObject?.editorSettings?.taggedKey
          : "",
    },

    {
      key: "widgetId",
      value: jsonObject?.id ?? "",
    },

    {
      key: "tagKey",
      value:
        jsonObject[jsonKeys.type] === "QText" ||
        jsonObject[jsonKeys.type] === "QTextH1" ||
        jsonObject[jsonKeys.type] === "QTextH2" ||
        jsonObject[jsonKeys.type] === "QTextH3" ||
        jsonObject[jsonKeys.type] === "QTextH4" ||
        jsonObject[jsonKeys.type] === "QTextH5" ||
        jsonObject[jsonKeys.type] === "QTextH6" ||
        jsonObject[jsonKeys.type] === "QParagraph" ||
        jsonObject[jsonKeys.type] === "QImageNetwork" ||
        jsonObject[jsonKeys.type] === "QButton"
          ? jsonObject?.editorSettings?.taggedKey
          : "",
    },
  ];

  const extractAnimationProps = (data = []) => {
    const mapJoin = (key, transformFn = (v) => v) =>
      data
        .map((item) => transformFn(item?.[key]))
        .filter(Boolean)
        .join(", ");

    return [
      //{ key: "isAnimationP", value: mapJoin("isAnimationP") },
      { key: jsonKeys.isAnimationP, value: "true" },
      { key: jsonKeys.animationType, value: mapJoin("animationType") },
      {
        key: jsonKeys.animationDirection,
        // value: mapJoin("direction") === "none" ? "top" : mapJoin("direction"),
        value: mapJoin("direction") || "none",
      },
      {
        key: jsonKeys.animationEasing,
        value: mapJoin("fillMode", (val) => val?.replace(/^easing/, "ease")),
      },
      { key: jsonKeys.animationIterations, value: mapJoin("iterationCount") },
      {
        key: jsonKeys.animationDelay,
        // value: mapJoin("delay", (val) =>
        //   val ? parseFloat(`${val}`.replace(/[a-zA-Z]/g, "")) / 1000 + "s" : ""
        // ),
        value: data
          .map((item) => {
            const val = item?.delay;
            if (!val && val !== 0 && val !== "0") return "";
            const unit = item?.delayUnit;
            if (unit === "ms") return parseFloat(val) / 1000 + "s";
            if (unit === "m") return parseFloat(val) * 60 + "s";
            if (unit === "hr") return parseFloat(val) * 3600 + "s";
            if (unit === "s") return val + "s";

            return val
              ? parseFloat(`${val}`.replace(/[a-zA-Z]/g, "")) / 1000 + "s"
              : "";
          })
          .filter(Boolean)
          .join(", "),
      },
      {
        key: jsonKeys.isRevarsed,
        value: data
          .map((item) => (item?.isReversed === true ? "true" : "false"))
          .join(", "),
      },
      {
        key: jsonKeys.animationDuration,
        value: data
          .map((item) => {
            // const val = `${item?.duration ?? ""}`;
            // return val.endsWith("s") ? val : val + "s";
            const val = item?.duration;
            if (!val && val !== 0 && val !== "0") return "";
            const unit = item?.durationUnit;
            if (unit === "ms") return parseFloat(val) / 1000 + "s";
            if (unit === "m") return parseFloat(val) * 60 + "s";
            if (unit === "hr") return parseFloat(val) * 3600 + "s";
            if (unit === "s") return val + "s";

            // Fallback
            const strVal = `${val}`;
            return strVal.endsWith("s") ? strVal : strVal + "s";
          })
          .filter(Boolean)
          .join(", "),
      },

      //added scale animation
      {
        key: jsonKeys.maxValue,
        value: mapJoin("maxValue"),
      },
      {
        key: jsonKeys.minValue,
        value: mapJoin("minValue"),
      },
    ];
  };

  /*props = props.concat(await reactStyleProps.getStyleProps());

  props.push({
    key: "tailwaindClasses",
    value: (await reactStyleProps.getTailwaindClasses())?.trim(),
  });*/

  if (
    jsonObject[jsonKeys.type] == "QTableWrapper" ||
    jsonObject[jsonKeys.type] == "QTable" ||
    jsonObject[jsonKeys.type] == "QTableRow" ||
    jsonObject[jsonKeys.type] == "TableRows" ||
    jsonObject[jsonKeys.type] == "QColumnHeaders"
  ) {
    props = [
      ...props,
      ...(await reactCommonStyleProps.getStyleProps()),

      {
        key: "commonTailwaindClasses",
        value: (await reactCommonStyleProps.getTailwaindClasses())?.trim(),
      },
    ];
  }

  if (jsonObject?.widgetDefaultData?.style?.animation?.length > 0) {
    const data = jsonObject?.widgetDefaultData?.style?.animation;
    props.push(...extractAnimationProps(data));
  }

  return props;
}

const generateJSX = async ({
  componentName,
  props,
  isSelfClosing = false,
  startingIndent = 0,
  fileName,
  writeToFile = false,
  jsonObjects,
  defaultObject,
}) => {
  let jsxString = " ";
  const tailwind = props.find((item) => item.key === "tailwaindClasses")?.value;

  const isTextComponent = [
    "QTextH1",
    "QTextH2",
    "QTextH3",
    "QTextH4",
    "QTextH5",
    "QTextH6",
    "QParagraph",
    "QRepeat",
  ].includes(componentName);

  let backgroundType = "";
  if (isTextComponent) {
    let foreground =
      jsonObjects?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
        jsonKeys.typography
      ]?.[jsonKeys.text]?.[jsonKeys.foreground] ??
      defaultObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
        jsonKeys.typography
      ]?.[jsonKeys.text]?.[jsonKeys.foreground] ??
      "";

    let background =
      jsonObjects?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
        jsonKeys.background
      ] ??
      defaultObject?.[jsonKeys.widgetDefaultData]?.[jsonKeys.style]?.[
        jsonKeys.background
      ] ??
      "";

    backgroundType = foreground?.[jsonKeys.backgroundType] ?? "";

    if (
      backgroundType === "linear" ||
      backgroundType === "radial" ||
      componentName == "QRepeat"
    ) {
      jsxString += " ".repeat(startingIndent) + `<QDiv\n`;

      let bgColor = "";

      switch (background?.[jsonKeys.backgroundType]) {
        case "solid": {
          bgColor =
            commonUtils.hexToRgba(
              background?.[jsonKeys.solid]?.[jsonKeys.color],
            ) ??
            commonUtils.hexToRgba(
              defaultBackground?.[jsonKeys.solid]?.[jsonKeys.color],
            );

          break;
        }
        case "linear": {
          const angle =
            background?.[jsonKeys.linearGradient]?.[jsonKeys.angle] ?? "0deg";
          const color1 = commonUtils.hexToRgba(
            background?.[jsonKeys.linearGradient]?.[jsonKeys.colors]?.[0]?.[
              jsonKeys.color
            ] ?? "",
          );
          const stop1 =
            background?.[jsonKeys.linearGradient]?.[jsonKeys.colors]?.[0]?.[
              jsonKeys.stop
            ] ?? "0%";

          const color2 = commonUtils.hexToRgba(
            background?.[jsonKeys.linearGradient]?.[jsonKeys.colors]?.[1]?.[
              jsonKeys.color
            ] ?? "",
          );
          const stop2 =
            background?.[jsonKeys.linearGradient]?.[jsonKeys.colors]?.[1]?.[
              jsonKeys.stop
            ] ?? "100%";

          bgColor = `linear-gradient(${angle}, ${color1} ${stop1}, ${color2} ${stop2})`;
          break;
        }

        case "radial": {
          const shape =
            background?.[jsonKeys.radialGradient]?.[jsonKeys.shape] ?? "circle";

          const size = await getValueWithUnit(
            background?.[jsonKeys.radialGradient]?.[jsonKeys.size],
            defaultBackground?.[jsonKeys.radialGradient]?.[jsonKeys.size],
          );

          const posX = await getValueWithUnit(
            background?.[jsonKeys.radialGradient]?.[jsonKeys.position]?.x,
            defaultBackground?.[jsonKeys.radialGradient]?.[jsonKeys.position]
              ?.x,
          );

          const posY = await getValueWithUnit(
            background?.[jsonKeys.radialGradient]?.[jsonKeys.position]?.y,
            defaultBackground?.[jsonKeys.radialGradient]?.[jsonKeys.position]
              ?.y,
          );

          const color1 = commonUtils.hexToRgba(
            background?.[jsonKeys.radialGradient]?.[jsonKeys.colors]?.[0]?.[
              jsonKeys.color
            ] ?? "",
          );
          const stop1 =
            background?.[jsonKeys.radialGradient]?.[jsonKeys.colors]?.[0]?.[
              jsonKeys.stop
            ] ?? "0%";

          const color2 = commonUtils.hexToRgba(
            background?.[jsonKeys.radialGradient]?.[jsonKeys.colors]?.[1]?.[
              jsonKeys.color
            ] ?? "",
          );
          const stop2 =
            background?.[jsonKeys.radialGradient]?.[jsonKeys.colors]?.[1]?.[
              jsonKeys.stop
            ] ?? "100%";

          bgColor = `radial-gradient(${shape} ${size} at ${posX} ${posY}, ${color1} ${stop1}, ${color2} ${stop2})`;
          break;
        }

        default:
          break;
      }

      if (componentName == "QRepeat") {
        jsxString +=
          " ".repeat(startingIndent + 2) + `tailwaindClasses="${tailwind}"\n`;
        jsxString += " ".repeat(startingIndent) + `>\n`; // Close opening tag
      } else {
        jsxString += " ".repeat(startingIndent + 2) + `bgColor="${bgColor}"\n`;
        jsxString += " ".repeat(startingIndent) + `>\n`; // Close opening tag
      }

      // Append children here...
    }
  }

  jsxString += " ".repeat(startingIndent) + `<${componentName}\n`;

  const escapeQuotes = (value) => {
    if (typeof value !== "string") return value;
    return value
      .replace(/"/g, "&quot;") // " -> &quot;
      .replace(/'/g, "&apos;"); // ' -> &apos;
  };

  props.forEach((prop) => {
    if (
      prop.value === undefined ||
      prop.value === "undefined" ||
      prop.value === null ||
      (typeof prop.value === "string" && prop.value.trim() === "")
    ) {
      return;
    }

    const indent = " ".repeat(startingIndent + 2);
    const isDimension = ["width", "height"].includes(prop.key);
    const isHeaderTextProp = isTextComponent && prop.key === "headerText";

    let valueFormat;
    if (isDimension && prop.value !== "") {
      valueFormat = `=${prop.value}`;
    } else if (isHeaderTextProp) {
      valueFormat = `="${escapeQuotes(prop.value)}"`;
    } else if (
      prop.key == "markers" ||
      prop.key == "centerMarkers" ||
      prop.key == "boundaryEnabled" ||
      prop.key == "isPolygonEnable" ||
      prop.key == "isCircleRadiusEnable" ||
      prop.key == "enableFullScreen" ||
      prop.key == "enableFullScreen" ||
      prop.key == "zoomControlsEnabled" ||
      prop.key == "zoom" ||
      prop.key == "errorSet" ||
      prop.key == "dataRepeat" ||
      prop.key == "style" ||
      prop.key == "headerText1" ||
      prop.key == "repeaterDefaultData" ||
      prop.key == "loading"
    ) {
      valueFormat = `={${prop.value}}`;
    } else {
      valueFormat = `="${prop.value}"`;
    }
    if (prop.key == "headerText1") {
      jsxString += `${indent}headerText${valueFormat}\n`;
    } else {
      jsxString += `${indent}${prop.key}${valueFormat}\n`;
    }
  });

  // Handle self-closing vs. non-self-closing components
  if (isSelfClosing) {
    jsxString += " ".repeat(startingIndent) + "/>\n"; // <Component ... />
    if (backgroundType == "linear" || backgroundType == "radial") {
      jsxString += " ".repeat(startingIndent) + `</QDiv>\n`;
    }
  } else {
    jsxString += " ".repeat(startingIndent) + ">\n"; // <Component ...>
  }

  // console.log("JSX String:", jsxString);
  if (writeToFile && fileName) {
    await readWriteFile.writeToFile(fileName, jsxString);
  }

  return jsxString;
};

async function getComponentNameByPageId(pageId) {
  const refComponent = components.find(
    (component) => Number(component.pageId) === Number(pageId),
  );
  return refComponent ? refComponent.componentName : "";
}

async function getElementNameByPageId(pageId) {
  const refElement = elements.find(
    (element) => Number(element.pageId) === Number(pageId),
  );
  return refElement ? refElement.componentName : "";
}

async function capitalizeFirst(str) {
  if (!str) return ""; // handle empty or null
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  props,
  /*actions,
  onLoadActions,
  actionObjects,
  insertAction,
  clearActionsForTag,
  getActionsArray,
  insertOnLoadAction,
  insertFormSubmitAction,
  clearOnLoadActionsForTag,
  clearFormSubmitForTag,
  getOnLoadActionsArray,
  getFormSubmitActionsArray,*/
  componentFrameWidth,
  componentFrameHeight,
  setParentId,
  getParentId,
  setParentIds,
  getParentIds,
  resetParentIds,
  hasMenuBar,
  getFont,
  componentProps,
  generateJSX,
  getComponentName,
  components,
  elements,
  getComponentNameByPageId,
  getElementNameByPageId,
  capitalizeFirst,
};
