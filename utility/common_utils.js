// const fetch = require('node-fetch');
// const probe = require('probe-image-size');

// const environment = "Production";
const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const path = require("path");
const tableMetadata = require("../utility/table_metadata");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

let projectId = "0"; //627;
let pageId = "0"; //627;
let currentPage = "";
let platform = "";
let windowDevice = "D"; // "M"

let tableWidgetId = "";
let tableType = "";

const componentsRootPath = [];

function screenSizeIphone() {
  return { width: 1179, height: 2556 }; // iPhone 15
}

function screenSizeIpad() {
  return { width: 1536, height: 2048 }; // iPhone 15
}

function screenSizeAndroid() {
  return { width: 432, height: 890 };
}

function screenSizeDesktop() {
  return { width: 1536, height: 864 };
}

function nullCheckedFloatValue(value) {
  // const floatValue = parseFloat(value);
  // return isNaN(floatValue) ? null : floatValue;
  return value != null ? value : `0`;
}

function nullCheckedIntValue(value) {
  return value != null ? value : `0`;
}

function nullCheckedString(value) {
  return value != null ? value : "";
}

function removePxValue(value) {
  if (value != null && value.includes("px")) {
    return value.replace(/px$/, "");
  } else {
    return value != null && value != "none" && value != "None" ? value : `0.0`;
  }
}

async function fetchImageResolution(url, imgWidth, imgHeight) {
  /*try {
          const response = await fetch(url, { method: 'GET' });
          // Stream the response and extract dimensions
          const result = await probe(response.body);

          let width = '0.0';
          let height = '0.0';
          let mainCanvasJsonFile = '.././created_files/common_private/main_canvas.json';
          const mainCanvasObject = require(mainCanvasJsonFile);
          let canvasWidth = mainCanvasObject["width"];
          if(parseFloat(result.width) > parseFloat(canvasWidth)) {
               width = canvasWidth;
          } else {
               width = result.width;
          }

          if (width != null && parseFloat(width) > 0) {
               let imgRatio = parseFloat(result.height) / parseFloat(result.width);
               height = parseFloat(parseFloat(imgRatio) * parseFloat(width));
          } else {
               width = result.width;
               height = result.height;
          }

          return { width: width, height: height };
    } catch (error) {
        console.error('Error fetching image resolution:', error);
        throw error;
    }*/
  return { width: 0.0, height: 0.0 };
}

async function getComponentWidthHeight(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  isPaddingMargin,
  isWidthAutoNull,
  isHeightAutoNull
) {
  try {
    // console.log(`parentWidth: ${parentWidth} parentHeight: ${parentHeight}`);
    let mainCanvasJsonFile =
      ".././created_files/common_private/main_canvas.json";
    const mainCanvasObject = require(mainCanvasJsonFile);

    // Ensure jsonObject and defaultJsonObject exist
    jsonObject = jsonObject || {};
    defaultJsonObject = defaultJsonObject || {};

    // Fallbacks for padding/margin to prevent 'undefined' errors
    let padding = jsonObject["padding"] ?? defaultJsonObject["padding"] ?? 0;
    let paddingLeft =
      jsonObject["paddingLeft"] ?? defaultJsonObject["paddingLeft"] ?? 0;
    let paddingRight =
      jsonObject["paddingRight"] ?? defaultJsonObject["paddingRight"] ?? 0;
    let margin = jsonObject["margin"] ?? defaultJsonObject["margin"] ?? 0;
    let marginLeft =
      jsonObject["marginLeft"] ?? defaultJsonObject["marginLeft"] ?? 0;
    let marginRight =
      jsonObject["marginRight"] ?? defaultJsonObject["marginRight"] ?? 0;

    let width = await calculateHeightWidth(
      parentWidth,
      jsonObject?.["widthType"] ?? defaultJsonObject?.["widthType"] ?? "",
      jsonObject?.["width"],
      jsonObject?.["widthPercent"] ?? defaultJsonObject?.["widthPercent"] ?? "",
      isWidthAutoNull,
      isPaddingMargin
        ? await getPaddingMarginValue(padding, paddingLeft, paddingRight)
        : 0,
      isPaddingMargin
        ? await getPaddingMarginValue(margin, marginLeft, marginRight)
        : 0,
      // isPaddingMargin === true ? await (getPaddingMarginValue(jsonObject["padding"] ?? defaultJsonObject["padding"], jsonObject["paddingLeft"] ?? defaultJsonObject["paddingLeft"], jsonObject["paddingRight"] ?? defaultJsonObject["paddingRight"])) : 0,
      // isPaddingMargin === true ? await (getPaddingMarginValue(jsonObject["margin"] ?? defaultJsonObject["margin"], jsonObject["marginLeft"] ?? defaultJsonObject["marginLeft"], jsonObject["marginRight"] ?? defaultJsonObject["marginRight"])) : 0,
      mainCanvasObject["screenHeight"],
      mainCanvasObject["screenWidth"]
    );

    // console.log(`Height type: ${jsonObject["heightType"] ?? defaultJsonObject["heightType"]}`);
    // console.log(`heightPercent: ${jsonObject["heightPercent"] ?? defaultJsonObject["heightPercent"]}`);
    let height = 0.0;
    height = await calculateHeightWidth(
      await parentHeight,
      await (jsonObject["heightType"] ?? defaultJsonObject["heightType"]),
      await jsonObject["height"],
      await (jsonObject["heightPercent"] ?? defaultJsonObject["heightPercent"]),
      isHeightAutoNull,
      isPaddingMargin === true
        ? await getPaddingMarginValue(
            jsonObject["padding"] ?? defaultJsonObject["padding"],
            jsonObject["paddingTop"] ?? defaultJsonObject["paddingTop"],
            jsonObject["paddingBottom"] ?? defaultJsonObject["paddingBottom"]
          )
        : 0,
      isPaddingMargin === true
        ? await getPaddingMarginValue(
            jsonObject["margin"] ?? defaultJsonObject["margin"],
            jsonObject["marginTop"] ?? defaultJsonObject["marginTop"],
            jsonObject["marginBottom"] ?? defaultJsonObject["marginBottom"]
          )
        : 0,
      await mainCanvasObject["screenHeight"],
      await mainCanvasObject["screenWidth"]
    );

    /*if(jsonObject["height"] > 0.0) {
               height = await calculateHeightWidth(
                    await (parentHeight),
                    await (jsonObject["heightType"] ?? defaultJsonObject["heightType"]),
                    await (jsonObject["height"]),
                    await (jsonObject["heightPercent"] ?? defaultJsonObject["heightPercent"]),
                    isHeightAutoNull,
                    isPaddingMargin === true ? await (getPaddingMarginValue(jsonObject["padding"] ?? defaultJsonObject["padding"], jsonObject["paddingTop"] ?? defaultJsonObject["paddingTop"], jsonObject["paddingBottom"] ?? defaultJsonObject["paddingBottom"])) : 0,
                    isPaddingMargin === true ? await (getPaddingMarginValue(jsonObject["margin"] ?? defaultJsonObject["margin"], jsonObject["marginTop"] ?? defaultJsonObject["marginTop"], jsonObject["marginBottom"] ?? defaultJsonObject["marginBottom"])) : 0,
                    await (mainCanvasObject["screenHeight"]),
                    await (mainCanvasObject["screenWidth"])
               );
          } else {

          }*/
    return { width: width, height: height };
  } catch (error) {
    console.error("Error fetching component width height:", error);
    throw error;
  }
}

async function calculateHeightWidth(
  parentHeightWidthValue,
  heightWidthType,
  value,
  percent,
  isAutoNull = false,
  padding,
  margin,
  screenHeight,
  screenWidth
) {
  // console.log(`heightWidthType: ${heightWidthType} percent: ${percent} screenHeight: ${screenHeight}`);
  try {
    if (heightWidthType === "auto") {
      if (isAutoNull) {
        return null;
      }
      const result = parseFloat(parentHeightWidthValue);
      const finalResult = result - (margin + padding);
      const lastResult = finalResult < 0 ? result : finalResult;
      return lastResult > 0 ? lastResult : null;
    } else if (heightWidthType === "vw" && percent) {
      // depend on screen width
      const totalWidth = parseFloat(screenWidth);
      const percentage = parseFloat(percent.replace("%", "").trim());
      const result = await calculatePercentage(totalWidth, percentage);
      const finalResult = result - (padding + margin);
      return finalResult > 0 ? finalResult : null;
    } else if (heightWidthType === "vh" && percent) {
      // console.log('heightWidthType', heightWidthType)
      // console.log('percent', percent)

      // console.log('screenHeight', screenHeight)

      // depend on screen height
      const totalHeight = parseFloat(screenHeight);
      const percentage = parseFloat(percent?.replace("%", "").trim());
      const result = await calculatePercentage(totalHeight, percentage);
      return result > 0 ? result : null;
    } else if (heightWidthType === "percent" && percent) {
      // depend on perent size
      const parentWidthHeight = parseFloat(parentHeightWidthValue);
      // console.log('parentWidthHeight', parentWidthHeight)
      //  console.log(`percent: ${percent}`);
      const percentage = parseFloat(percent.replace("%", "").trim());
      const result = await calculatePercentage(parentWidthHeight, percentage);
      // console.log(`result: ${result}`);
      const finalResult = result - (padding + margin);
      //  console.log(`finalResult: ${finalResult}`);
      const lastResult = finalResult > 0 ? finalResult : result;
      //console.log(`parentHeightWidthValue: ${parentHeightWidthValue} || percentage: ${percent} || finalResult: ${finalResult} || lastResult: ${lastResult}`);
      return lastResult > 0 ? lastResult : null;
    } else if (heightWidthType === "px") {
      // fixed
      const result = parseFloat(value?.replace("%", "") ?? 0);
      return result > 0 ? result : null;
    } else {
      if (isAutoNull) {
        return null;
      }
      const result = parseFloat(parentHeightWidthValue);
      const finalResult = result - (margin + padding);
      const lastResult = finalResult < 0 ? result : finalResult;
      return lastResult > 0 ? lastResult : null;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

async function calculatePercentage(value, percent) {
  // console.log(`+++++++++++++++ calculatePercentage: value: ${value}  percent: ${percent}  result: ${(value * percent) / 100.0}`);
  return (value * percent) / 100.0;
}

async function getPaddingMarginValue(all, value1, value2) {
  let paddingMargin = 0.0;
  try {
    if (all != null && all != "none") {
      paddingMargin = parseFloat(all) * 2;
    } else if (
      value1 != null &&
      value1 != "none" &&
      value2 != null &&
      value2 != "none"
    ) {
      paddingMargin = parseFloat(value1) + parseFloat(value2);
    } else if (value1 != null && value1 != "none") {
      paddingMargin = parseFloat(value1);
    } else if (value2 != null && value2 != "none") {
      paddingMargin = parseFloat(value2);
    } else {
      paddingMargin = 0.0;
    }
  } catch (error) {
    console.error(error);
  }

  if (
    paddingMargin !== null &&
    paddingMargin !== "none" &&
    paddingMargin !== undefined &&
    !isNaN(parseFloat(paddingMargin))
  ) {
    return paddingMargin;
  } else {
    return 0.0;
  }
}

// Utility function to convert Hex color to RGBA
function hexToRgba(hex) {
  if (
    !hex ||
    typeof hex !== "string" ||
    !/^#?([a-fA-F\d]{6}|[a-fA-F\d]{8})$/.test(hex)
  ) {
    //  console.warn("Invalid hex value");
    return null;
  }

  hex = hex.startsWith("#") ? hex.slice(1) : hex;

  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  // Extract alpha if present (8 characters hex)
  if (hex.length === 8) {
    a = parseInt(hex.slice(0, 2), 16) / 255;
    hex = hex.slice(2);
  }

  // Extract RGB values
  r = parseInt(hex.slice(0, 2), 16);
  g = parseInt(hex.slice(2, 4), 16);
  b = parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

function removeTransparencyFromHexCode(hexCode) {
  // Ensure the hex code starts with '#' and has 9 characters (including #)
  // console.log(`*************** hexCode: ${hexCode}`);
  if (!hexCode.startsWith("#") || hexCode.length !== 9) {
    return hexCode;
  } else {
    const aa = hexCode.substring(1, 3); // Alpha
    const rr = hexCode.substring(3, 5); // Red
    const gg = hexCode.substring(5, 7); // Green
    const bb = hexCode.substring(7, 9); // Blue

    // console.log(`*************** hexCode: #${rr}${gg}${bb}${aa}`);
    // Reorder to #RRGGBBAA
    return `#${rr}${gg}${bb}${aa}`; //.toLowerCase();
    // return "#" + hexCode.slice(3, 9);
  }
}

// Reusable SEO value object
const seoContentValue = {
  site_name: "",
  page_favicon:
    "https://imgcdn.kuick.com/cms-designer/redoq-main/kuick_fav.png",
  page_name: "Home",
  page_title: "kuick Studio",
  page_description: "kuick Studio",
  page_image: "",
  page_keyword: "kuick Studio.",
};

async function isSVGImage(imgURL) {
  const imgURLArray = imgURL.split(".");
  const finalImageType = imgURLArray.pop();
  return finalImageType.toLowerCase() === "svg";
}

async function hasDrawerMenu(jsonObjects) {
  let objectType = await jsonObjects["type"];
  if (objectType == "QDrawer") {
    return { status: "success", object: jsonObjects };
  } else {
    let jsonObj = jsonObjects["children"];
    for (const index in jsonObj) {
      let json = jsonObj[index];
      let isDrawer = await hasDrawerMenu(json);
      if (isDrawer.status == "success") {
        return isDrawer;
      } else {
      }
    }
  }
  return { status: "failure", object: {} };
}

async function hasHeaderBar(jsonObjects) {
  let objectType = await jsonObjects["type"];
  if (objectType == "QHeaderBar") {
    return { status: "success", object: jsonObjects };
  } else {
    let jsonObj = jsonObjects["children"];
    for (const index in jsonObj) {
      let json = jsonObj[index];
      let isHeader = await hasHeaderBar(json);
      if (isHeader.status == "success") {
        return isHeader;
      } else {
      }
    }
  }
  return { status: "failure", object: {} };
}

async function hasBottomMenu(jsonObjects) {
  let objectType = await jsonObjects["type"];
  if (objectType == "QBottomMenu") {
    return { status: "success", object: jsonObjects };
  } else {
    let jsonObj = jsonObjects["children"];
    for (const index in jsonObj) {
      let json = jsonObj[index];
      let isBottomMenu = await hasBottomMenu(json);
      if (isBottomMenu.status == "success") {
        return isBottomMenu;
      } else {
      }
    }
  }
  return { status: "failure", object: {} };
}

async function hasFloatingButton(jsonObjects) {
  let objectType = await jsonObjects["type"];
  if (objectType == "QFloatingButton") {
    return { status: "success", object: jsonObjects };
  } else {
    let jsonObj = jsonObjects["children"];
    for (const index in jsonObj) {
      let json = jsonObj[index];
      let isFloatingButton = await hasFloatingButton(json);
      if (isFloatingButton.status == "success") {
        return isFloatingButton;
      } else {
      }
    }
  }
  return { status: "failure", object: {} };
}

function toPascalCase(input) {
  input = input.replace(" ", "_");
  input = input.replace(/-/g, "_");
  return (
    input
      // split on any sequence of non-alphanumeric characters OR before uppercase
      .split(/[^a-zA-Z0-9]+|(?=[A-Z])/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  );
}

async function themeVariable(
  projectId,
  pageId,
  widgetID,
  themeKey,
  themeCategory,
  includeDeviceType = true
) {
  const subProjectPath = String(projectId);
  const pageIdStr = String(pageId);
  let deviceType = "";
  if (windowDevice === "D") {
    deviceType = "desktop";
  } else if (windowDevice === "M") {
    deviceType = "mobile";
  } else {
  }

  let themeVariable = "";
  try {
    let themeVariableId = "";
    let jsonPath = path.join(
      reactProjectPath,
      subProjectPath,
      "jsons",
      `mapper_${pageIdStr}.json`
    );
    // console.log(`themeVariable jsonPath: ${jsonPath}`);
    if ((await readWriteFile.fileExists(jsonPath)) == true) {
      // console.log(`themeVariable file have}`);
      await delete require.cache[require.resolve(jsonPath)];
      const objects = require(jsonPath); // Synchronous require for simplicity
      let widgetsObject = objects?.data?.action_mapper_Json?.widgets;
      let widgetObject = widgetsObject?.[`${widgetID}`] ?? "";
      // console.log(`widgetObject: ${JSON.stringify(widgetsObject)}`);
      if (widgetObject !== "") {
        const themeObj = widgetObject?.theme ?? "";
        if (themeObj !== "") {
          let widgetTheme = themeObj[themeKey] ?? "";
          if (widgetTheme !== "") {
              // console.log(`widgetObject: ${JSON.stringify(widgetTheme)}`);

            themeVariableId = widgetTheme?.cms_project_theme_variable_Id ?? "";
          }
        }
      }

      let themeJsonPath = path.join(
        reactProjectPath,
        subProjectPath,
        "jsons",
        `theme.json`
      );
      if ((await readWriteFile.fileExists(themeJsonPath)) == true) {
        await delete require.cache[require.resolve(themeJsonPath)];
        const themeObjects = require(themeJsonPath);

        const matchingTheme = themeObjects.theme.find((theme) => {
          const themeTitle = removeSpacesAndspecialChars(
            theme.cms_project_theme_variable_Title
          );
          const catogory = theme.variables[themeCategory] ?? "";
          if (catogory !== "" && themeVariableId !== "") {
            const categoryValues =
              catogory.find(
                (v) =>
                  v.cms_project_theme_variable_Id == String(themeVariableId)
              ) ?? {};

            if (categoryValues.cms_project_theme_variable_Title) {
              const themeVariableTitle = removeSpacesAndspecialChars(
                categoryValues.cms_project_theme_variable_Title
              );
              // console.log("themeVariableTitle123", themeVariableTitle);
              if (includeDeviceType === true) {
                themeVariable = `--${themeVariableTitle}-${deviceType}`;
              } else {
                themeVariable = `--${themeVariableTitle}`;
              }
              return true; // Found a match
            }
          }
          return false;
        });
        return matchingTheme ? themeVariable : ""; // Return computed themeVariable or empty string
      } else {
        return "";
      }
    } else {
      return "";
    }
  } catch (error) {
    console.error(`Error in themeVariable:`, error.message);
    return "";
  }
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

async function tableWidgetInfo(jsonObject) {
  const metadata = tableMetadata.getInstance();
  tableWidgetId = String(jsonObject?.id ?? "");
  metadata.tableWidgetId = String(jsonObject?.id ?? "");
  console.log("tableWidgetId", tableWidgetId);
  tableType = String(
    jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.table
      ?.tableType ?? ""
  );
  metadata.tableType = String(
    jsonObject?.widgetDefaultData?.style?.widgetSpecialStyle?.table
      ?.tableType ?? ""
  );
  console.log("tableType", tableType);
}

// Utility: ensure a string starts with "#"
async function ensureHash(value = "") {
  // If null, undefined, or empty, return empty string
  if (value == null || value === "") return "";

  // If value is an object, process each key recursively
  if (typeof value === "object" && !Array.isArray(value)) {
    const result = {};
    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      const v = String(value[key] || "").trim();
      result[key] = v ? (v.startsWith("#") ? v : "#" + v) : "";
    }
    return result;
  }

  // For string or other types, convert safely to string
  const str = String(value || "").trim();

  if (!str) return "";

  return str.startsWith("#") ? str : "#" + str;
}

function removeSpacesAndspecialChars(params) {
  const paramsVariable = params.replace(/\s/g, "").toLowerCase();
  // params.replace(/[^a-zA-Z0-9]+/g, "_")  // replace spaces & special chars with _
  // .toLowerCase();
  return paramsVariable;
}

module.exports = {
  screenSizeIphone,
  screenSizeIpad,
  screenSizeAndroid,
  screenSizeDesktop,
  projectId,
  pageId,
  currentPage,
  platform,
  componentsRootPath,
  nullCheckedFloatValue,
  nullCheckedIntValue,
  nullCheckedString,
  removePxValue,
  fetchImageResolution,
  getComponentWidthHeight,
  calculateHeightWidth,
  windowDevice,
  getPaddingMarginValue,
  isSVGImage,
  hasDrawerMenu,
  hasHeaderBar,
  hasBottomMenu,
  hasFloatingButton,
  hexToRgba,
  removeTransparencyFromHexCode,
  seoContentValue,
  isSVGImage,
  toPascalCase,
  themeVariable,
  getNestedValue,
  tableWidgetInfo,
  tableWidgetId,
  tableType,
  ensureHash,
  removeSpacesAndspecialChars,
};
