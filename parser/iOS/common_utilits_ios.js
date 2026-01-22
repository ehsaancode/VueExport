const commonUtils = require("../../utility/common_utils");

async function componentSize(
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
  // let widthPadding = await (commonUtils.getPaddingMarginValue(jsonObject["padding"] ?? defaultJsonObject["padding"], jsonObject["paddingLeft"] ?? defaultJsonObject["paddingLeft"], jsonObject["paddingRight"] ?? defaultJsonObject["paddingRight"]));
  let widthMargin = await commonUtils.getPaddingMarginValue(
    jsonObject["margin"] ?? defaultJsonObject["margin"],
    jsonObject["marginLeft"] ?? defaultJsonObject["marginLeft"],
    jsonObject["marginRight"] ?? defaultJsonObject["marginRight"]
  );
  let widthPaddingMargin = widthMargin; // + widthPadding;// + parantWidthPaddingMargin;
  // let heightPadding = await (commonUtils.getPaddingMarginValue(jsonObject["padding"] ?? defaultJsonObject["padding"], jsonObject["paddingTop"] ?? defaultJsonObject["paddingTop"], jsonObject["paddingBottom"] ?? defaultJsonObject["paddingBottom"]));
  let heightMargin = await commonUtils.getPaddingMarginValue(
    jsonObject["margin"] ?? defaultJsonObject["margin"],
    jsonObject["marginTop"] ?? defaultJsonObject["marginTop"],
    jsonObject["marginBottom"] ?? defaultJsonObject["marginBottom"]
  );
  let heightPaddingMargin = heightMargin; // + heightPadding;// + parantHeightPaddingMargin;

  let widthType = jsonObject["widthType"] ?? defaultJsonObject["widthType"];
  let heightType = jsonObject["heightType"] ?? defaultJsonObject["heightType"];
  let size = "width: nil, height: nil";
  let mainCanvasJsonFile =
    "../.././created_files/common_private/main_canvas.json";
  const mainCanvasObject = require(mainCanvasJsonFile);

  if (
    widthType === "px" &&
    width > 0.0 &&
    heightType === "px" &&
    height > 0.0
  ) {
    frame = `width: ${width} - ${widthPaddingMargin}, height: ${height} - ${heightPaddingMargin}`;
  } else if (
    widthType !== "px" &&
    width > 0.0 &&
    heightType !== "px" &&
    height > 0.0
  ) {
    frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width})  - ${widthPaddingMargin}, height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height}) - ${heightPaddingMargin}`;
  } else if (
    widthType === "px" &&
    width > 0.0 &&
    heightType !== "px" &&
    height > 0.0
  ) {
    frame = `width: ${width} - ${widthPaddingMargin}, height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height}) - ${heightPaddingMargin}`;
  } else if (
    widthType !== "px" &&
    width > 0.0 &&
    heightType === "px" &&
    height > 0.0
  ) {
    frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width}) - ${widthPaddingMargin}, height: ${height} - ${heightPaddingMargin}`;
  } else if (widthType === "px" && width > 0.0) {
    frame = `width: ${width} - ${widthPaddingMargin}`;
  } else if (heightType === "px" && height > 0.0) {
    frame = `height: ${height} - ${heightPaddingMargin}`;
  } else if (widthType !== "px" && width > 0.0) {
    frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width}) - ${widthPaddingMargin}`;
  } else if (heightType !== "px" && height > 0.0) {
    frame = `height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height}) - ${heightPaddingMargin}`;
  } else {
  }

  if (widthPaddingMargin <= 0) {
    frame = frame.replace(` - ${widthPaddingMargin}`, "");
  }

  if (heightPaddingMargin <= 0) {
    frame = frame.replace(` - ${heightPaddingMargin}`, "");
  }
  return `CGSize(${frame})`;
}

async function componentFrame(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  parantMainAlignment,
  parantCrossAlignment,
  isWidthAutoNull,
  isHeightAutoNull,
  parantWidthPaddingMargin,
  parantHeightPaddingMargin,
  componentWidth = 0,
  componentHeight = 0
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
  // let widthPadding = await (commonUtils.getPaddingMarginValue(jsonObject["padding"] ?? defaultJsonObject["padding"], jsonObject["paddingLeft"] ?? defaultJsonObject["paddingLeft"], jsonObject["paddingRight"] ?? defaultJsonObject["paddingRight"]));
  let widthMargin = await commonUtils.getPaddingMarginValue(
    jsonObject["margin"] ?? defaultJsonObject["margin"],
    jsonObject["marginLeft"] ?? defaultJsonObject["marginLeft"],
    jsonObject["marginRight"] ?? defaultJsonObject["marginRight"]
  );
  let widthPaddingMargin = widthMargin; // + widthPadding;// + parantWidthPaddingMargin;
  // let heightPadding = await (commonUtils.getPaddingMarginValue(jsonObject["padding"] ?? defaultJsonObject["padding"], jsonObject["paddingTop"] ?? defaultJsonObject["paddingTop"], jsonObject["paddingBottom"] ?? defaultJsonObject["paddingBottom"]));
  let heightMargin = await commonUtils.getPaddingMarginValue(
    jsonObject["margin"] ?? defaultJsonObject["margin"],
    jsonObject["marginTop"] ?? defaultJsonObject["marginTop"],
    jsonObject["marginBottom"] ?? defaultJsonObject["marginBottom"]
  );
  let heightPaddingMargin = heightMargin; // + heightPadding;// + parantHeightPaddingMargin;

  let widthType = jsonObject["widthType"] ?? defaultJsonObject["widthType"];
  let heightType = jsonObject["heightType"] ?? defaultJsonObject["heightType"];
  let frame = "width: nil, height: nil";
  let mainCanvasJsonFile =
    "../.././created_files/common_private/main_canvas.json";
  const mainCanvasObject = require(mainCanvasJsonFile);

  if (
    widthType === "px" &&
    width > 0.0 &&
    heightType === "px" &&
    height > 0.0
  ) {
    frame = `width: ${width}, height: ${height}`;
  } else if (
    widthType !== "px" &&
    width > 0.0 &&
    heightType !== "px" &&
    height > 0.0
  ) {
    frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width})  - ${widthPaddingMargin}, height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height}) - ${heightPaddingMargin}`;
  } else if (
    widthType === "px" &&
    width > 0.0 &&
    heightType !== "px" &&
    height > 0.0
  ) {
    frame = `width: ${width}, height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height}) - ${heightPaddingMargin}`;
  } else if (
    widthType !== "px" &&
    width > 0.0 &&
    heightType === "px" &&
    height > 0.0
  ) {
    frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width}) - ${widthPaddingMargin}, height: ${height}`;
  } else if (widthType === "px" && width > 0.0) {
    frame = `width: ${width}`;
  } else if (heightType === "px" && height > 0.0) {
    frame = `height: ${height}`;
  } else if (widthType !== "px" && width > 0.0) {
    frame = `width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width}) - ${widthPaddingMargin}`;
  } else if (heightType !== "px" && height > 0.0) {
    frame = `height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height}) - ${heightPaddingMargin}`;
  } else {
  }

  if (widthPaddingMargin <= 0) {
    frame = frame.replace(` - ${widthPaddingMargin}`, "");
  }

  if (heightPaddingMargin <= 0) {
    frame = frame.replace(` - ${heightPaddingMargin}`, "");
  }

  if (parantMainAlignment === "align_left") {
    frame = frame + ", alignment: .leading";
  } else if (parantMainAlignment === "align_right") {
    frame = frame + ", alignment: .trailing";
  } else if (parantMainAlignment === "align_center") {
    frame = frame + ", alignment: .center";
  } else {
    frame = frame + ", alignment: .leading";
  }

  return frame;
}

async function componentWidth(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  parantMainAlignment,
  parantCrossAlignment,
  isWidthAutoNull,
  isHeightAutoNull,
  parantWidthPaddingMargin,
  parantHeightPaddingMargin,
  componentWidth = 0,
  componentHeight = 0
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
  let widthType = jsonObject["widthType"] ?? defaultJsonObject["widthType"];
  let finalWidth = "";
  let mainCanvasJsonFile =
    "../.././created_files/common_private/main_canvas.json";
  const mainCanvasObject = require(mainCanvasJsonFile);

  if (widthType === "px" && width > 0.0) {
    finalWidth = `${width}`;
  } else if (widthType !== "px" && width > 0.0) {
    finalWidth = `QUtility.convertedWidth(refaranceWidth: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenWidth"]
    )}, width: ${width})`;
  } else {
  }

  return finalWidth;
}

async function componentHeight(
  jsonObject,
  defaultJsonObject,
  parentWidth,
  parentHeight,
  parantMainAlignment,
  parantCrossAlignment,
  isWidthAutoNull,
  isHeightAutoNull,
  parantWidthPaddingMargin,
  parantHeightPaddingMargin,
  componentWidth = 0,
  componentHeight = 0
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
  let height = widthHeight.height;
  let heightType = jsonObject["heightType"] ?? defaultJsonObject["heightType"];
  let finalHeight = "";
  let mainCanvasJsonFile =
    "../.././created_files/common_private/main_canvas.json";
  const mainCanvasObject = require(mainCanvasJsonFile);

  if (heightType === "px" && height > 0.0) {
    finalHeight = `${height}`;
  } else if (heightType !== "px" && height > 0.0) {
    finalHeight = `height: QUtility.convertedHeight(refaranceHeight: ${commonUtils.nullCheckedFloatValue(
      mainCanvasObject["screenHeight"]
    )}, height: ${height})`;
  } else {
  }

  return finalHeight;
}

async function componentPadding(jsonObjects, defaultJsonObject) {
  let padding = (
    jsonObjects["padding"] ??
    defaultJsonObject["padding"] ??
    "0.0px"
  ).replace(/px$/, "");
  padding = !isNaN(parseFloat(padding)) ? padding : "0.0";
  let paddingLeft =
    padding > 0
      ? padding
      : (
          jsonObjects["paddingLeft"] ??
          defaultJsonObject["paddingLeft"] ??
          "0.0px"
        ).replace(/px$/, "");
  paddingLeft = !isNaN(parseFloat(paddingLeft)) ? paddingLeft : "0.0";
  let paddingTop =
    padding > 0
      ? padding
      : (
          jsonObjects["paddingTop"] ??
          defaultJsonObject["paddingTop"] ??
          "0.0px"
        ).replace(/px$/, "");
  paddingTop = !isNaN(parseFloat(paddingTop)) ? paddingTop : "0.0";
  let paddingRight =
    padding > 0
      ? padding
      : (
          jsonObjects["paddingRight"] ??
          defaultJsonObject["paddingRight"] ??
          "0.0px"
        ).replace(/px$/, "");
  paddingRight = !isNaN(parseFloat(paddingRight)) ? paddingRight : "0.0";
  let paddingBottom =
    padding > 0
      ? padding
      : (
          jsonObjects["paddingBottom"] ??
          defaultJsonObject["paddingBottom"] ??
          "0.0px"
        ).replace(/px$/, "");
  paddingBottom = !isNaN(parseFloat(paddingBottom)) ? paddingBottom : "0.0";

  return {
    paddingLeft: parseFloat(paddingLeft),
    paddingRight: parseFloat(paddingRight),
    paddingTop: parseFloat(paddingTop),
    paddingBottom: parseFloat(paddingBottom),
  };
}

async function componentMargin(jsonObjects, defaultJsonObject) {
  let margin = (
    jsonObjects["margin"] ??
    defaultJsonObject["margin"] ??
    "0.0px"
  ).replace(/px$/, "");
  let marginLeft =
    margin > 0
      ? margin
      : (
          jsonObjects["marginLeft"] ??
          defaultJsonObject["marginLeft"] ??
          "0.0"
        ).replace(/px$/, "");
  let marginTop =
    margin > 0
      ? margin
      : (
          jsonObjects["marginTop"] ??
          defaultJsonObject["marginTop"] ??
          "0.0"
        ).replace(/px$/, "");
  let marginRight =
    margin > 0
      ? margin
      : (
          jsonObjects["marginRight"] ??
          defaultJsonObject["marginRight"] ??
          "0.0"
        ).replace(/px$/, "");
  let marginBottom =
    margin > 0
      ? margin
      : (
          jsonObjects["marginBottom"] ??
          defaultJsonObject["marginBottom"] ??
          "0.0"
        ).replace(/px$/, "");

  return {
    marginLeft: parseFloat(marginLeft),
    marginRight: parseFloat(marginRight),
    marginTop: parseFloat(marginTop),
    marginBottom: parseFloat(marginBottom),
  };
}

async function customBorderView(jsonObjects) {
  let customBorderView = "";
  let borderBC = jsonObjects["borderBC"]; // borderBottomColor
  let borderBLR = commonUtils.removePxValue(jsonObjects["borderBLR"]); // borderBottomLeftRadius
  let borderBRR = commonUtils.removePxValue(jsonObjects["borderBRR"]); // borderBottomRightRadius
  let borderBW = commonUtils.removePxValue(jsonObjects["borderBW"]); // borderBottomWidth
  let borderBS = commonUtils.removePxValue(jsonObjects["borderBS"]); // borderBottomStyle

  let borderLC = jsonObjects["borderLC"]; // borderLeftColor
  let borderLW = commonUtils.removePxValue(jsonObjects["borderLW"]); // borderLeftWidth
  let borderLS = commonUtils.removePxValue(jsonObjects["borderLS"]); // borderLeftStyle

  let borderRC = jsonObjects["borderRC"]; // borderRightColor
  let borderRW = commonUtils.removePxValue(jsonObjects["borderRW"]); // borderRightWidth
  let borderRS = commonUtils.removePxValue(jsonObjects["borderRS"]); // borderRightStyle

  let borderTC = jsonObjects["borderTC"]; // borderTopColor
  let borderTLR = commonUtils.removePxValue(jsonObjects["borderTLR"]); //borderTopLeftRadius
  let borderTRR = commonUtils.removePxValue(jsonObjects["borderTRR"]); // borderTopRightRadius
  let borderTW = commonUtils.removePxValue(jsonObjects["borderTW"]); // borderTopWidth
  let borderTS = commonUtils.removePxValue(jsonObjects["borderTS"]); // borderTopStyle

  if (
    parseFloat(borderBLR) > 0.0 &&
    parseFloat(borderBRR) > 0.0 &&
    parseFloat(borderTLR) > 0.0 &&
    parseFloat(borderTLR) > 0.0 &&
    (borderBC != null ||
      borderBLR != null ||
      borderBRR != null ||
      borderBW != null ||
      borderBS != null ||
      borderLC != null ||
      borderLW != null ||
      borderLS != null ||
      borderRC != null ||
      borderRW != null ||
      borderRS != null ||
      borderTC != null ||
      borderTLR != null ||
      borderTRR != null ||
      borderTW != null ||
      borderTS != null)
  ) {
    customBorderView = customBorderView + "ZStack { \n";
    customBorderView =
      customBorderView +
      `CustomCorners(topLeft: ${borderTLR ?? 0}, topRight: ${
        borderTRR ?? 0
      }, bottomLeft: ${borderBLR ?? 0}, bottomRight: ${borderBRR ?? 0})\n`; // Bottom Border
    customBorderView =
      customBorderView +
      `    .stroke(QColor.hexToColor(hex:\"${borderBC ?? ""}\"), lineWidth: ${(
        borderBW ?? "0px"
      ).replace(/px$/, "")})\n`;
    customBorderView =
      customBorderView +
      `CustomCorners(topLeft: ${borderTLR ?? 0}, topRight: ${
        borderTRR ?? 0
      }, bottomLeft: ${borderBLR ?? 0}, bottomRight: ${borderBRR ?? 0})\n`; // Left Border
    customBorderView =
      customBorderView +
      `    .stroke(QColor.hexToColor(hex:\"${borderLC ?? ""}\"), lineWidth: ${(
        borderLW ?? "0px"
      ).replace(/px$/, "")})\n`;
    customBorderView =
      customBorderView +
      `CustomCorners(topLeft: ${borderTLR ?? 0}, topRight: ${
        borderTRR ?? 0
      }, bottomLeft: ${borderBLR ?? 0}, bottomRight: ${borderBRR ?? 0})\n`; // Top Border
    customBorderView =
      customBorderView +
      `    .stroke(QColor.hexToColor(hex:\"${borderTC ?? ""}\"), lineWidth: ${(
        borderTW ?? "0px"
      ).replace(/px$/, "")})\n`;
    customBorderView =
      customBorderView +
      `CustomCorners(topLeft: ${borderTLR ?? 0}, topRight: ${
        borderTRR ?? 0
      }, bottomLeft: ${borderBLR ?? 0}, bottomRight: ${borderBRR ?? 0})\n`; // Right Border
    customBorderView =
      customBorderView +
      `    .stroke(QColor.hexToColor(hex:\"${borderRC ?? ""}\"), lineWidth: ${(
        borderRW ?? "0px"
      ).replace(/px$/, "")})\n`;
    customBorderView = customBorderView + `}`;
  }
  return customBorderView;
}

async function componentCornerRadius(jsonObjects) {
  let cornerRadius = "";
  let borderTLR = parseFloat(jsonObjects["borderTLR"] ?? "0"); //borderTopLeftRadius
  let borderTRR = parseFloat(jsonObjects["borderTRR"] ?? "0"); // borderTopRightRadius
  let borderBLR = parseFloat(jsonObjects["borderBLR"] ?? "0"); // borderBottomLeftRadius
  let borderBRR = parseFloat(jsonObjects["borderBRR"] ?? "0"); // borderBottomRightRadius

  if (borderTLR > 0 || borderTRR > 0 || borderBLR > 0 || borderBRR > 0) {
    cornerRadius = `.clipShape(CustomCorners(topLeft: ${borderTLR}, topRight: ${borderTRR}, bottomLeft: ${borderBLR}, bottomRight: ${borderBRR}))\n`;
  }
  return cornerRadius;
}

async function componentShadow(jsonObjects) {
  let shadowSpreadRadius = parseFloat(
    (jsonObjects["shadowSpreadRadius"] ?? "0.0px").replace(/px$/, "")
  );
  let shadowBlurRadius = parseFloat(
    (jsonObjects["shadowBlurRadius"] ?? "0.0px").replace(/px$/, "")
  );
  let shadowOffsetX = parseFloat(
    (jsonObjects["shadowOffsetX"] ?? "0.0px").replace(/px$/, "")
  );
  let shadowOffsetY = parseFloat(
    (jsonObjects["shadowOffsetY"] ?? "0.0px").replace(/px$/, "")
  );
  let shadowColor = jsonObjects["shadowColor"] ?? "";

  if (
    shadowSpreadRadius > 0 ||
    shadowBlurRadius > 0 ||
    shadowOffsetX > 0 ||
    shadowOffsetY > 0 ||
    shadowColor.length > 0
  ) {
    return `.shadow(color: QColor.hexToColor(hex:\"${
      shadowColor ?? ""
    }\"), radius: ${
      shadowBlurRadius > 0 ? shadowBlurRadius : shadowSpreadRadius
    }, x: ${shadowOffsetX}, y: ${shadowOffsetY})\n`;
  } else {
    return "";
  }
}

async function componentStackPositioned(
  jsonObjects,
  startingColum,
  parentWidth,
  parentHeight
) {
  console.log(`positionedType: ${jsonObjects["positionedType"]}`);
  let positionedTop = parseFloat(jsonObjects["positionedTop"] ?? "0");
  let positionedBottom = parseFloat(jsonObjects["positionedBottom"] ?? "0");
  let positionedLeft = parseFloat(jsonObjects["positionedLeft"] ?? "0");
  let positionedRight = parseFloat(jsonObjects["positionedRight"] ?? "0");
  let positioned = "";
  if (
    positionedTop != 0 ||
    positionedBottom != 0 ||
    positionedLeft != 0 ||
    positionedRight != 0
  ) {
    if (positionedTop != 0 && positionedLeft != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)\n";
    } else if (positionedTop != 0 && positionedRight != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)\n";
    } else if (positionedBottom != 0 && positionedLeft != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)\n";
    } else if (positionedBottom != 0 && positionedRight != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)\n";
    } else if (positionedLeft != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)\n";
    } else if (positionedRight != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .trailing)\n";
    } else if (positionedTop != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)\n";
    } else if (positionedBottom != 0) {
      positioned =
        ".frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)\n";
    } else {
    }

    if (positionedTop != 0) {
      positioned =
        positioned +
        " ".repeat(startingColum) +
        `.padding(.top, ${positionedTop})\n`;
    }
    if (positionedBottom != 0) {
      positioned =
        positioned +
        " ".repeat(startingColum) +
        `.padding(.bottom, ${positionedBottom})\n`;
    }
    if (positionedLeft != 0) {
      positioned =
        positioned +
        " ".repeat(startingColum) +
        `.padding(.leading, ${positionedLeft})\n`;
    }
    if (positionedRight != 0) {
      positioned =
        positioned +
        " ".repeat(startingColum) +
        `.padding(.trailing, ${positionedRight})\n`;
    }
  }
  return positioned != undefined ? positioned : "";
}

async function componentBackground(
  startingColum,
  jsonObjects,
  defaultJsonObject,
  borderView,
  parentWidth,
  parentHeight,
  isWidthAutoNull,
  isHeightAutoNull
) {
  let background = "";
  let bgColor = jsonObjects["bgColor"] ?? "";
  background = background + `.background(ZStack {\n`;

  let bgImgUrl = jsonObjects["url"] ?? "";
  if (bgImgUrl?.length > 0) {
    let widthHeight = await commonUtils.getComponentWidthHeight(
      jsonObjects,
      defaultJsonObject,
      parentWidth,
      parentHeight,
      false,
      isWidthAutoNull,
      isHeightAutoNull
    );
    let width = widthHeight.width;
    let height = widthHeight.height;
    // let imageSize = await commonUtils.fetchImageResolution(bgImgUrl, commonUtils.screenSizeIphone().width, commonUtils.screenSizeIphone().height);
    let imgFinalSize = { width: width, height: height }; //{ width: width > 0 ? width : imageSize.width, height: height > 0 ? height : imageSize.height };
    background = background + " ".repeat(startingColum + 1) + "VStack { \n";
    background =
      background +
      " ".repeat(startingColum + 2) +
      `QCustomAsyncImageView(urlString: \"${bgImgUrl}\", imageSize: CGSize(width: QUtility.convertedWidth(refaranceWidth: ${
        commonUtils.screenSizeIphone().width
      }, width: ${imgFinalSize.width}), height: ${imgFinalSize.height})) \n`;
    background = background + " ".repeat(startingColum + 1) + "} \n";
    background =
      background +
      " ".repeat(startingColum + 1) +
      `.frame(width: QUtility.convertedWidth(refaranceWidth: ${
        commonUtils.screenSizeIphone().width
      }, width: ${imgFinalSize.width}), height: ${
        imgFinalSize.height > 0 ? imgFinalSize.height : "nil"
      }, alignment: .center) \n`;
  }

  background =
    background +
    " ".repeat(startingColum + 1) +
    `QColor.hexToColor(hex:\"${bgColor}\")\n`;
  background = background + " ".repeat(startingColum + 1) + `${borderView}\n`;
  background = background + " ".repeat(startingColum) + `})\n`;

  /*let bgImgUrl = jsonObjects["url"] ?? "";
     let widthHeight = await commonUtils.getComponentWidthHeight(jsonObjects, defaultJsonObject, parentWidth, parentHeight, false, isWidthAutoNull, isHeightAutoNull);
     let width = widthHeight.width;
     let height = widthHeight.height;
     let imageSize = { width: 0, height: 0 };
     console.log(`widthHeight: ${widthHeight.width} ${widthHeight.height}`);
     if (height > 0) {
          imageSize = { width: width, height: height };
     } else {
          imageSize = await commonUtils.fetchImageResolution(bgImgUrl, commonUtils.screenSizeIphone().width, commonUtils.screenSizeIphone().height);
     }
     background = background + ' '.repeat(startingColum) +  `.background(ZStack {\n`;
     if (bgImgUrl?.length > 0) {
          background = background + ' '.repeat(startingColum + 1) + "VStack { \n";
          background = background + ' '.repeat(startingColum + 2) + `QCustomAsyncImageView(urlString: \"${bgImgUrl}\", imageSize: CGSize(width: ${imageSize.width}, height: ${imageSize.height})) \n`;
          background = background + ' '.repeat(startingColum + 1) + "} \n";
          background = background + ' '.repeat(startingColum + 1) + `.frame(width: QUtility.convertedWidth(refaranceWidth: ${commonUtils.screenSizeIphone().width}, width: ${imageSize.width}), height: (${imageSize.height} * QUtility.convertedWidth(refaranceWidth: ${commonUtils.screenSizeIphone().width}, width: ${imageSize.width})) / ${commonUtils.screenSizeIphone().width}, alignment: .center) \n`;
     } else {
     }
     background = background + ' '.repeat(startingColum + 1) +  `QColor.hexToColor(hex:\"${bgColor}\")\n`;
     background = background + ' '.repeat(startingColum + 1) +  `${borderView}\n`;
     background = background + ' '.repeat(startingColum) +  `})\n`;
*/
  return background;
}

async function formatText(text) {
  if (text !== undefined) {
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
    return `\"\"\"\n${formattedText}\n\"\"\"`;
  } else {
    return '""';
  }
}

async function actionFilePath(appFilesPath) {
  return `${appFilesPath}/Action.swift`;
}

async function hasDrawerMenu(jsonObjects) {
  let objectType = await jsonObjects["type"];
  if (objectType == "QDrawer") {
    return "success";
  } else {
    let jsonObj = jsonObjects["children"];
    for (const index in jsonObj) {
      let json = jsonObj[index];
      let isDrawer = await hasDrawerMenu(json);
      if (isDrawer == "success") {
        return "success";
      } else {
      }
    }
  }
  return "failure";
}

module.exports = {
  componentSize,
  componentFrame,
  componentWidth,
  componentHeight,
  componentPadding,
  componentMargin,
  customBorderView,
  componentCornerRadius,
  componentShadow,
  componentStackPositioned,
  componentBackground,
  formatText,
  actionFilePath,
  hasDrawerMenu,
};
