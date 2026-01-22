const defaultTextValue = require("../Common/parse_default_text");
const commonUtils = require("../../utility/common_utils");
const readWriteFile = require("../../utility/read_write_file");
const parserSlugPage = require("./android_parser_slug_page");

String.prototype.stringPxToInt = function () {
  return parseInt(this.slice(0, -2));
};

async function formatText(text = "") {
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }

  const lines = text.split("\n");

  // Find the minimum indentation (ignoring empty lines)
  const minIndent = lines
    .filter((line) => line.trim().length > 0) // Ignore empty lines
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/); // Match leading spaces
      return match ? Math.min(min, match[1].length) : min;
    }, Infinity);

  // Remove leading indentation while keeping structure
  const formattedText = lines
    .map((line) => (line.trim().length > 0 ? line.slice(minIndent) : line)) // Adjust indentation
    .join("\n") // Join back into a multi-line string
    .trim(); // Trim blank lines

  // Wrap it properly as a Swift multi-line string
  return `\"\"\"${formattedText}\"\"\"`;
}

async function getPropertyValue(jsonObject, key, defaultJsonObject) {
  if (
    jsonObject &&
    jsonObject.hasOwnProperty(key) &&
    jsonObject[key] !== null &&
    jsonObject[key] !== "none"
  ) {
    return jsonObject[key];
  } else if (
    defaultJsonObject &&
    defaultJsonObject.hasOwnProperty(key) &&
    defaultJsonObject[key] !== null &&
    defaultJsonObject[key] !== "none"
  ) {
    return defaultJsonObject[key];
  } else {
    return null; // Default fallback value
  }
}

async function extractPadding(jsonObject, defaultJsonObject) {
  const result = {};

  const setIfExists = async (jsonKey, resultKey) => {
    const value = await getPropertyValue(
      jsonObject,
      jsonKey,
      defaultJsonObject
    );
    if (value !== null && value !== "none") {
      const intValue = value.stringPxToInt();
      if (intValue > 0) {
        result[resultKey] = intValue;
      }
    }
  };

  await setIfExists("paddingLeft", "paddingStart");
  await setIfExists("paddingRight", "paddingEnd");
  await setIfExists("paddingTop", "paddingTop");
  await setIfExists("paddingBottom", "paddingBottom");

  return result;
}

async function extractMargin(jsonObject, defaultJsonObject) {
  const result = {};

  const setIfExists = async (jsonKey, resultKey) => {
    const value = await getPropertyValue(
      jsonObject,
      jsonKey,
      defaultJsonObject
    );
    if (value !== null && value !== "none") {
      const intValue = value.stringPxToInt();
      if (intValue > 0) {
        result[resultKey] = intValue;
      }
    }
  };

  await setIfExists("marginLeft", "marginStart");
  await setIfExists("marginRight", "marginEnd");
  await setIfExists("marginTop", "marginTop");
  await setIfExists("marginBottom", "marginBottom");

  return result;
}

async function getTextPaddingValue(jsonObjects, key) {
  if (jsonObjects[key] != null && jsonObjects[key] !== "none") {
    return `${jsonObjects[key].stringPxToInt()}`;
  } else if (defaultTextValue.getTextDefaultValue(jsonObjects["type"])) {
    //, jsonObjects['design'], key) !== null
    return `${jsonObjects[key]}`;
  }
}

async function getFontWeight(jsonObjects, defaultJsonObject) {
  if (
    jsonObjects &&
    jsonObjects["fontWeight"] != null &&
    jsonObjects["fontWeight"] != "none"
  ) {
    return `${jsonObjects["fontWeight"]}`;
  }

  if (
    defaultJsonObject &&
    defaultJsonObject["type"] != null &&
    defaultJsonObject["type"] != "none" &&
    defaultJsonObject["type"] != ""
  ) {
    let fontWeight = await defaultTextValue.getDefaultValue(
      jsonObjects["type"],
      "fontWeight"
    );
    return fontWeight;
  }
  return `400`; // Default value if no match
}

async function getTextAlign(jsonObjects, defaultJsonObject) {
  const mapAlignment = {
    align_left: "TextAlign.Start",
    align_center: "TextAlign.Center",
    align_right: "TextAlign.End",
  };

  // Check if `textAlign` is directly available in jsonObjects
  if (
    jsonObjects &&
    jsonObjects["textAlign"] &&
    jsonObjects["textAlign"] in mapAlignment
  ) {
    return mapAlignment[jsonObjects["textAlign"]];
  }

  // Fallback to default value from `commonDefault`
  if (
    defaultJsonObject &&
    defaultJsonObject["textAlign"] &&
    defaultJsonObject["textAlign"] in mapAlignment
  ) {
    return mapAlignment[defaultJsonObject["textAlign"]];
  }

  // Default value if no match
  return "TextAlign.Start";
}

async function getImageFit(jsonObjects, defaultJsonObject) {
  const mapAlignment = {
    cover: "ContentScale.Crop",
    contain: "ContentScale.Fit",
    fill: "ContentScale.FillBounds",
    fitHeight: "ContentScale.FillHeight",
    fitWidth: "ContentScale.FillWidth",
  };

  // Check if `textAlign` is directly available in jsonObjects
  if (jsonObjects["imageFit"] in mapAlignment) {
    return mapAlignment[jsonObjects["imageFit"]];
  }

  // Fallback to default value from `commonDefault`
  if (defaultJsonObject["imageFit"] in mapAlignment) {
    return mapAlignment[defaultJsonObject["imageFit"]];
  }

  // Default value if no match
  return "ContentScale.Fit";
}

async function extractBorderProperties(jsonObject) {
  const borderKeys = [
    "borderTLR",
    "borderTRR",
    "borderBLR",
    "borderBRR",
    "borderTW",
    "borderTC",
    "borderBW",
    "borderBC",
    "borderLW",
    "borderLC",
    "borderRW",
    "borderRC",
  ];

  return borderKeys.reduce((acc, key) => {
    if (
      jsonObject.hasOwnProperty(key) &&
      jsonObject[key] !== null &&
      jsonObject[key] !== "None"
    ) {
      acc[key] = jsonObject[key]; // Assign value if key exists and is not null
    }

    return acc;
  }, {});
}

async function componentFrame(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  isWidthAutoNull,
  isHeightAutoNull
) {
  let widthHeight = await commonUtils.getComponentWidthHeight(
    jsonObject,
    defaultJsonObject,
    parentWidth,
    parentHeight,
    false,
    isWidthAutoNull,
    isHeightAutoNull
  );
  let width = widthHeight.width;
  let height = widthHeight.height;

  let widthType =
    jsonObject?.["widthType"] ?? defaultJsonObject?.["widthType"] ?? "";
  let heightType =
    jsonObject?.["heightType"] ?? defaultJsonObject?.["heightType"] ?? "";
  let frame = `width = "0", \nheight = "0",`;
  let mainCanvasJsonFile =
    "../.././created_files/common_private/main_canvas.json";
  const mainCanvasObject = require(mainCanvasJsonFile);

  if (
    widthType === "px" &&
    width > 0.0 &&
    heightType === "px" &&
    height > 0.0
  ) {
    frame = `width = "${width}",\nheight = "${height}",`;
  } else if (
    widthType !== "px" &&
    width > 0.0 &&
    heightType !== "px" &&
    height > 0.0
  ) {
    frame = `width = convertedWidth(referenceWidth = ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}f, width = ${width}f).toString(),\nheight = convertedHeight(referenceHeight = ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}f, height = ${height}f).toString(),`;
  } else if (
    widthType === "px" &&
    width > 0.0 &&
    heightType !== "px" &&
    height > 0.0
  ) {
    frame = `width = "${width}", \nheight = convertedHeight(referenceHeight = ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}f, height = ${height}f).toString(),`;
  } else if (
    widthType !== "px" &&
    width > 0.0 &&
    heightType === "px" &&
    height > 0.0
  ) {
    frame = `width = convertedWidth(referenceWidth = ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}f, width = ${width}f).toString(), \nheight = "${height}",`;
  } else if (widthType === "px" && width > 0.0) {
    frame = `width = "${width}",`;
  } else if (heightType === "px" && height > 0.0) {
    frame = `height = "${height}",`;
  } else if (widthType !== "px" && width > 0.0) {
    frame = `width = convertedWidth(referenceWidth = ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}f, width = ${width}f).toString(),`;
  } else if (heightType !== "px" && height > 0.0) {
    frame = `height = convertedHeight(referenceHeight = ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}f, height = ${height}f).toString(),`;
  } else {
  }

  return frame;
}

async function extractShadow(jsonObjects, defaultJsonObject) {
  const result = {};

  const setIfExists = async (jsonKey, resultKey) => {
    const value = await getPropertyValue(
      jsonObjects,
      jsonKey,
      defaultJsonObject
    );
    if (value !== null && value !== "none") {
      const intValue = value.stringPxToInt();
      if (intValue > 0) {
        result[resultKey] = intValue;
      }
    }
  };

  await setIfExists("shadowOffsetX", "shadowOffsetX");
  await setIfExists("shadowOffsetY", "shadowOffsetY");
  await setIfExists("shadowSpreadRadius", "shadowSpreadRadius");
  await setIfExists("shadowBlurRadius", "shadowBlurRadius");
  await setIfExists("shadowColor", "shadowColor");

  return result;

  // if ((jsonObjects['shadowOffsetX'] != null && jsonObjects['shadowOffsetX'] != "none") ||
  //     (jsonObjects['shadowOffsetY'] != null && jsonObjects['shadowOffsetY'] != "none") ||
  //     (jsonObjects['shadowSpreadRadius'] != null && jsonObjects['shadowSpreadRadius'] != "none") ||
  //     (jsonObjects['shadowBlurRadius'] != null && jsonObjects['shadowBlurRadius'] != "none") ||
  //     (jsonObjects['shadowColor'] != null && jsonObjects['shadowColor'] != "none")) {
  //         return shadowObject = {
  //             shadowOffsetX: `${jsonObjects['shadowOffsetX'] ?? "0px"}`,
  //             shadowOffsetY: `${jsonObjects['shadowOffsetY'] ?? "0px"}`,
  //             shadowSpreadRadius: `${jsonObjects['shadowSpreadRadius'] ?? "0px"}`,
  //             shadowBlurRadius: `${jsonObjects['shadowBlurRadius'] ?? "0px"}`,
  //             shadowColor: `${jsonObjects['shadowColor'] ?? "#00000000"}`
  //         };
  // }

  // return shadowObject = {
  //     shadowOffsetX: "0px",
  //     shadowOffsetY: "0px",
  //     shadowSpreadRadius: "0px",
  //     shadowBlurRadius: "0px",
  //     shadowColor: "#00000000"
  // };
}

function getFormattedAnimationsData(id, animationsData, startingColumn) {
  if (!Array.isArray(animationsData) || animationsData.length === 0) return "";

  const indent = (level) => " ".repeat(level);

  // Generate animation data list
  const animations = animationsData
    .map(
      (animation) =>
        indent(startingColumn + 2) +
        `AnimationData(\n` +
        indent(startingColumn + 3) +
        `visible = isVisible["${id}"] == true,\n` +
        indent(startingColumn + 3) +
        `isAnimationP = ${animation.isAnimationP === "true"},\n` +
        indent(startingColumn + 3) +
        `animationEasing = "${animation.animationEasing}",\n` +
        indent(startingColumn + 3) +
        `animationDirection = "${animation.animationDirection}",\n` +
        indent(startingColumn + 3) +
        `animationType = "${animation.animationType}",\n` +
        indent(startingColumn + 3) +
        `animationIterations = "${animation.animationIterations}",\n` +
        indent(startingColumn + 3) +
        `animationDelay = ${animation.animationDelay},\n` +
        indent(startingColumn + 3) +
        `animationDuration = ${animation.animationDuration},\n` +
        indent(startingColumn + 2) +
        `),\n`
    )
    .join("");

  // Final composed string
  return (
    indent(startingColumn + 1) +
    `visibilityChanged = {\n` +
    indent(startingColumn + 2) +
    `isVisible["${id}"] = it` +
    indent(startingColumn + 1) +
    `},\n` +
    indent(startingColumn + 1) +
    `animationData = listOf(\n` +
    animations +
    indent(startingColumn + 1) +
    `),\n`
  );
}

async function handleOnClickNavigation(jsonObjects, startingColum) {
  const onClickObject = jsonObjects["onClick"];
  let onClickContent = "";
  if (onClickObject?.action === "Navigate to" && onClickObject?.destination) {
    const destination = onClickObject.destination.trim();
    const destinationFileName = destination.replace(/-/g, "_");

    const pascalCaseName = commonUtils.toPascalCase(destinationFileName);
    const filePath = `../../created_files/pages/${destination}_${commonUtils.windowDevice}.json`;

    await parserSlugPage.downloadPageContentForSlug(
      filePath,
      pascalCaseName,
      destination
    );
    onClickContent =
      " ".repeat(startingColum + 1) +
      "onClick = {\n" +
      " ".repeat(startingColum + 3) +
      `CustomState.isLeftDrawerOpen.value = false\n` +
      " ".repeat(startingColum + 3) +
      `navController.navigate("${destinationFileName}")\n` +
      " ".repeat(startingColum + 1) +
      "}\n";

    //await readWriteFile.writeToFile(fileName, onClickContent);
  } else if (onClickObject?.action === "Back") {
    onClickContent =
      " ".repeat(startingColum + 1) +
      "onClick = {\n" +
      " ".repeat(startingColum + 3) +
      `navController.navigateUp()\n` +
      " ".repeat(startingColum + 1) +
      "}\n";
  }
  return onClickContent; // or undefined if nothing is found
}

async function writeComposableBody(fileName) {
  return (
    "package com.redoq.appbuilder.ui.screen.bottom \n\n" +
    "import androidx.compose.foundation.*\n" +
    "import androidx.compose.runtime.*\n" +
    "import androidx.compose.ui.*\n" +
    "import androidx.compose.ui.graphics.*\n" +
    "import androidx.compose.ui.layout.*\n" +
    "import androidx.compose.ui.text.font.*\n" +
    "import androidx.compose.ui.text.style.*\n" +
    "import com.redoq.mylibrary.*\n" +
    "import androidx.compose.animation.*\n" +
    "import androidx.compose.foundation.layout.*\n" +
    "import androidx.compose.ui.unit.*\n" +
    "import androidx.compose.foundation.shape.*\n" +
    "import androidx.compose.ui.res.* \n" +
    "import androidx.navigation.* \n" +
    "import com.redoq.appbuilder.R \n" +
    "import com.redoq.mylibrary.utils.*\n\n\n" +
    "@Composable \n" +
    `fun ${fileName}ContainBody (\n` +
    " ".repeat(3) +
    `navController:NavHostController\n` +
    `) { \n` +
    " ".repeat(1) +
    "val textFieldStates = rememberTextFieldState()\n" +
    " ".repeat(1) +
    "val scrollState = rememberScrollState()\n" +
    " ".repeat(1) +
    "val isVisible = rememberAnimationState()\n\n" +
    " ".repeat(1) +
    "Column ( \n" +
    " ".repeat(2) +
    "modifier = Modifier \n" +
    " ".repeat(3) +
    ".fillMaxSize()\n" +
    " ".repeat(3) +
    ".verticalScroll(state = scrollState)\n" +
    " ".repeat(2) +
    "){ \n"
  );
}

async function componentLayoutProperties(styleJsonObject) {
  const layout = styleJsonObject?.layout ?? "";
  let properties = layout?.properties?.flex ?? "";

  const alignItems = properties?.alignItems ?? "";
  const justifyContent = properties?.justifyContent ?? "";
  const flexDirection = properties?.flexDirection ?? "";

  const flexWrap = properties?.flexWrap ?? "";
  const flexWrapTitle = properties?.flexWrapTitle ?? "";

  //vSpace and hSpace
  const vSpace = properties?.vSpace?.v ?? "";
  const hSpace = properties?.hSpace?.v ?? "";

  return {
    alignItems: alignItems,
    justifyContent: justifyContent,
    flexDirection: flexDirection,
    flexWrap: flexWrap,
    flexWrapTitle: flexWrapTitle,
    vSpace: vSpace,
    hSpace: hSpace
  }

}

async function componentDimension(styleJsonObject) {
  let dimension = styleJsonObject?.dimension ?? "";
  let width = "";
  let height = "";
  if (dimension?.width?.u === "px") {
    width = `${dimension?.width?.v ?? "0"}.dp`;
  } else if (dimension?.width?.u === "%") {
    width = `parentWidth * ${(dimension?.width?.v ?? "0") / 100}f`;
  } else if (dimension?.width?.u === "vw") {
    width = `getFullWidth() * ${(dimension?.width?.v ?? "0") / 100}f`;
  } else {
  }

  if (dimension?.height?.u === "px") {
    height = `${dimension?.height?.v ?? "0"}.dp`;
  } else if (dimension?.height?.u === "%") {
    height = `parentHeight * ${(dimension?.height?.v ?? "1") / 100}f`;
  } else if (dimension?.height?.u === "vh") {
    height = `getFullHeight() * ${(dimension?.height?.v ?? "0") / 100}f`;
  } else {
  }
  // console.log(`height - ${height} || width - ${width}`)
  return { width: width, height: height };
}

async function componentPadding(styleJsonObject) {
  let padding = styleJsonObject?.spacing?.padding ?? "";
  let paddingTop = "";
  let paddingRight = "";
  let paddingBottom = "";
  let paddingLeft = "";
  if (padding?.top?.u === "px") {
    paddingTop = `${padding?.top?.v ?? "0"}`;
  } else if (padding?.top?.u === "%") {
    paddingTop = `maxHeight * ${(padding?.top?.v ?? "0") / 100}`;
  } else if (padding?.top?.u === "vw") {
    paddingTop = `getFullHeight() * ${(padding?.top?.v ?? "0") / 100}`;
  } else {
  }

  if (padding?.right?.u === "px") {
    paddingRight = `${padding?.right?.v ?? "0"}`;
  } else if (padding?.right?.u === "%") {
    paddingRight = `maxWidth * ${(padding?.right?.v ?? "0") / 100}`;
  } else if (padding?.right?.u === "vw") {
    paddingRight = `getFullWidth() * ${(padding?.right?.v ?? "0") / 100}`;
  } else {
  }

  if (padding?.bottom?.u === "px") {
    paddingBottom = `${padding?.bottom?.v ?? "0"}`;
  } else if (padding?.bottom?.u === "%") {
    paddingBottom = `maxHeight * ${(padding?.bottom?.v ?? "0") / 100}`;
  } else if (padding?.bottom?.u === "vw") {
    paddingBottom = `getFullHeight() * ${(padding?.bottom?.v ?? "0") / 100}`;
  } else {
  }

  if (padding?.left?.u === "px") {
    paddingLeft = `${padding?.left?.v ?? "0"}`;
  } else if (padding?.left?.u === "%") {
    paddingLeft = `maxWidth * ${(padding?.left?.v ?? "0") / 100}`;
  } else if (padding?.left?.u === "vw") {
    paddingLeft = `getFullWidth() * ${(padding?.left?.v ?? "0") / 100}`;
  } else {
  }

  return {
    top: paddingTop,
    right: paddingRight,
    bottom: paddingBottom,
    left: paddingLeft,
  };
}

async function componentMargin(styleJsonObject) {
  let margin = styleJsonObject?.spacing?.margin ?? "";
  let marginTop = "";
  let marginRight = "";
  let marginBottom = "";
  let marginLeft = "";
  if (margin?.top?.u === "px") {
    marginTop = `${margin?.top?.v ?? "0"}`;
  } else if (margin?.top?.u === "%") {
    marginTop = `maxHeight * ${(margin?.top?.v ?? "0") / 100}`;
  } else if (margin?.top?.u === "vw") {
    marginTop = `getFullHeight() * ${(margin?.top?.v ?? "0") / 100}`;
  } else {
  }

  if (margin?.right?.u === "px") {
    marginRight = `${margin?.right?.v ?? "0"}`;
  } else if (margin?.right?.u === "%") {
    marginRight = `maxWidth * ${(margin?.right?.v ?? "0") / 100}`;
  } else if (margin?.right?.u === "vw") {
    marginRight = `getFullWidth() * ${(margin?.right?.v ?? "0") / 100}`;
  } else {
  }

  if (margin?.bottom?.u === "px") {
    marginBottom = `${margin?.bottom?.v ?? "0"}`;
  } else if (margin?.bottom?.u === "%") {
    marginBottom = `maxHeight * ${(margin?.bottom?.v ?? "0") / 100}`;
  } else if (margin?.bottom?.u === "vw") {
    marginBottom = `getFullHeight() * ${(margin?.bottom?.v ?? "0") / 100}`;
  } else {
  }

  if (margin?.left?.u === "px") {
    marginLeft = `${margin?.left?.v ?? "0"}`;
  } else if (margin?.left?.u === "%") {
    marginLeft = `maxWidth * ${(margin?.left?.v ?? "0") / 100}`;
  } else if (margin?.left?.u === "vw") {
    marginLeft = `getFullWidth() * ${(margin?.left?.v ?? "0") / 100}`;
  } else {
  }

  return {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };
}

async function componentBackgroundColor(styleJsonObject) {
  let background = styleJsonObject?.background ?? {};
  const bgType = background?.backgroundType ?? "";

  const bgColor = background?.solid?.color ?? "";
  const linearGradientAngle = (background?.linearGradient?.angle ?? "").replace("°", "");
  const radialGradientShape = background?.radialGradient?.shape ?? "";

  let gradientColorList = `listOf(`;
  let gradientColors =
    bgType === "linear"
      ? background?.linearGradient?.colors ?? ""
      : bgType === "radial"
        ? background?.radialGradient?.colors ?? ""
        : "";

  if (gradientColors.length > 0) {
    for (const index in gradientColors) {
      const gradientColor = gradientColors[index] ?? {};
      gradientColorList += `"${gradientColor.color ?? "#FF000000"}:${gradientColor.stop ?? "0"}",`;
    }
    gradientColorList = gradientColorList.replace(/,$/, ""); // remove last comma
    gradientColorList += `)`; // close listOf
  } else {
    gradientColorList = `listOf()`;
  }

  const mapImageFit = {
    cover: `ContentScale.Crop`,
    contain: `ContentScale.Fit`,
    fill: `ContentScale.FillBounds`,
    fitHeight: `ContentScale.FillHeight`,
    fitWidth: `ContentScale.FillWidth`,
  };

  const bgUrl = background?.media?.url ?? "";
  const size = background?.media?.size ?? "";
  let imageFit = "";
  if (size !== null && size !== "") {
    imageFit = mapImageFit[size];
  } else {
    imageFit = mapImageFit["contain"];
  }

  return {
    bgType: bgType,
    bgColor: bgColor,
    linearGradientAngle: linearGradientAngle,
    radialGradientShape: radialGradientShape,
    gradientColorList: gradientColorList,
    bgUrl: bgUrl,
    imageFit: imageFit
  };
}

async function componentBorder(styleJsonObject) {
  let border = styleJsonObject?.boxDecoration?.border ?? {};

  const topBorderColor = border?.borderColor?.top ?? "";
  const bottomBorderColor = border?.borderColor?.bottom ?? "";
  const leftBorderColor = border?.borderColor?.left ?? "";
  const rightBorderColor = border?.borderColor?.right ?? "";

  const topLeftBorderRadius = border?.borderRadius?.topLeft?.v ?? ""
  const topRightBorderRadius = border?.borderRadius?.topRight?.v ?? ""
  const bottomLeftBorderRadius = border?.borderRadius?.bottomLeft?.v ?? ""
  const bottomRightBorderRadius = border?.borderRadius?.bottomRight?.v ?? ""


  const topBorderWidth = border?.borderWidth?.top?.v ?? ""
  const bottomBorderWidth = border?.borderWidth?.bottom?.v ?? ""
  const leftBorderWidth = border?.borderWidth?.left?.v ?? ""
  const rightBorderWidth = border?.borderWidth?.right?.v ?? ""

  return {
    borderTC: topBorderColor,
    borderBC: bottomBorderColor,
    borderLC: leftBorderColor,
    borderRC: rightBorderColor,
    borderTW: topBorderWidth,
    borderBW: bottomBorderWidth,
    borderLW: leftBorderWidth,
    borderRW: rightBorderWidth,
    borderTLR: topLeftBorderRadius,
    borderTRR: topRightBorderRadius,
    borderBLR: bottomLeftBorderRadius,
    borderBRR: bottomRightBorderRadius
  }
}

async function componentTypography(styleJsonObject) {
  const mapAlignment = {
    left: "TextAlign.Start",
    center: "TextAlign.Center",
    right: "TextAlign.End",
    justify: "TextAlign.Justify",
  };
  const mapFontStyle = {
    italicize: "FontStyle.Italic",
    ragular: "FontStyle.Normal"
  };

  const textTypography = styleJsonObject?.typography?.text ?? {};

  const text = textTypography?.value ?? "";
  const fontFamily = textTypography?.fontFamily ?? "Arial";
  const fontWeight = textTypography?.fontWeight ?? "400";
  const fontSize = textTypography?.fontSize?.v ?? "16"
  const fontStyle = mapFontStyle[textTypography?.more?.fontStyle ?? "ragular"];
  const fontVariant = textTypography?.more?.fontVariant ?? "";
  const lineHeight = textTypography?.lineHeight?.v ?? "";
  const alignment = mapAlignment[textTypography?.textAlign ?? "left"];

  const foreground = textTypography?.foreground ?? {};
  const foregroundType = foreground?.backgroundType ?? "solid";
  const solidColor = foreground?.solid?.color ?? "#FF000000";

  return {
    text: text, //transformTextVariant(text, fontVariant),
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontSize: fontSize,
    textAlign: alignment,
    fontStyle: fontStyle,
    lineHeight: lineHeight,
    fontVariant: fontVariant,
    solidColor: solidColor,
    foregroundType: foregroundType,
  }
}

function transformTextVariant(text = "", variant = "") {
  switch (variant.toLowerCase()) {
    case "camelcase":
      return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    default:
      return text;
  }
}

module.exports = {
  formatText,
  getTextPaddingValue,
  getPropertyValue,
  extractPadding,
  extractMargin,
  getFontWeight,
  getImageFit,
  getTextAlign,
  extractBorderProperties,
  componentFrame,
  extractShadow,
  getFormattedAnimationsData,
  handleOnClickNavigation,
  writeComposableBody,
  componentLayoutProperties,
  componentDimension,
  componentPadding,
  componentMargin,
  componentBackgroundColor,
  componentBorder,
  componentTypography
};
