const commonUtils = require("../../utility/common_utils");
const tailwaindJson = require("../../resource/css-tailwaind-mapper.json");

let valueProps = [];
let tailwaindClasses = "";

async function styleProps(styleJsonObject, styleDefaultJsonObject, widgetType) {
  valueProps = [];
  tailwaindClasses = "";
  await stylePropsDimenSion(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? ""
  );
  await stylePropsSpacing(styleJsonObject ?? "", styleDefaultJsonObject ?? "");
  await stylePropsPosition(styleJsonObject ?? "", styleDefaultJsonObject ?? "");
  await stylePropsBackground(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetType
  );
  await stylePropsBoxDecoration(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? ""
  );
  await stylePropStypography(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? ""
  );

  await stylePropsDisplay(styleJsonObject ?? "", styleDefaultJsonObject ?? "");
}

async function stylePropsDimenSion(styleJsonObject, styleDefaultJsonObject) {
  await stylePropsDimenSionWidth(styleJsonObject, styleDefaultJsonObject);
  await stylePropsDimenSionHeight(styleJsonObject, styleDefaultJsonObject);
  await stylePropsDimenSionOverflow(styleJsonObject, styleDefaultJsonObject);
}

async function stylePropsDimenSionWidth(
  styleJsonObject,
  styleDefaultJsonObject
) {
  let dimension = styleJsonObject.dimension ?? "";
  let defaultDimension = styleDefaultJsonObject.dimension ?? "";
  let withUnit = dimension?.width?.u ?? "";
  let valLeftMargin = `${styleJsonObject?.spacing?.margin?.left?.v ?? "0"}`;
  let valRightMargin = `${styleJsonObject?.spacing?.margin?.right?.v ?? "0"}`;

  if (
    (withUnit === "%" || withUnit === "vw") &&
    (valLeftMargin > 0 || valRightMargin > 0)
  ) {
    let valueWithUnit = await getValueWithUnit(
      dimension?.width ?? "",
      defaultDimension?.width ?? ""
    );
    if (valueWithUnit.length > 0) {
      let leftMargin =
        valLeftMargin > 0
          ? `${valLeftMargin}${styleJsonObject?.spacing?.margin?.left?.u}`
          : "";
      let rightMargin =
        valRightMargin > 0
          ? ` + ${valRightMargin}${styleJsonObject?.spacing?.margin?.right?.u}`
          : "";
      valueProps.push({
        key: "width",
        value: `\"calc(${valueWithUnit} - (${leftMargin}${rightMargin}))\"`,
      });
    }
  } else {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson.dimension,
      "width",
      "width",
      "width"
    );
  }
}

async function stylePropsDimenSionHeight(
  styleJsonObject,
  styleDefaultJsonObject
) {
  let dimension = styleJsonObject.dimension ?? "";
  let defaultDimension = styleDefaultJsonObject.dimension ?? "";
  let heightUnit = dimension?.height?.u ?? "";
  let valTopMargin = `${styleJsonObject?.spacing?.margin?.top?.v ?? "0"}`;
  let valBottomMargin = `${styleJsonObject?.spacing?.margin?.bottom?.v ?? "0"}`;

  if (
    (heightUnit === "%" || heightUnit === "vh") &&
    (valTopMargin > 0 || valBottomMargin > 0)
  ) {
    let valueWithUnit = await getValueWithUnit(
      dimension?.height ?? "",
      defaultDimension?.height ?? ""
    );
    if (valueWithUnit.length > 0) {
      let topMargin =
        valTopMargin > 0
          ? `${valTopMargin}${styleJsonObject?.spacing?.margin?.top?.u}`
          : "";
      let bottomMargin =
        valBottomMargin > 0
          ? ` + ${valBottomMargin}${styleJsonObject?.spacing?.margin?.bottom?.u}`
          : "";
      valueProps.push({
        key: "height",
        value: `\"calc(${valueWithUnit} - (${topMargin}${bottomMargin}))\"`,
      });
    }
  } else {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension,
      tailwaindJson.dimension,
      `height`,
      "height",
      "height"
    );
  }
}

async function stylePropsDimenSionOverflow(
  styleJsonObject,
  styleDefaultJsonObject
) {
  let dimension = styleJsonObject.dimension ?? "";
  let defaultDimension = styleDefaultJsonObject.dimension ?? "";
  let withUnit = dimension?.width?.u ?? "";
  let heightUnit = dimension?.height?.u ?? "";

  let overflowKey = dimension.overflow ?? defaultDimension.overflow ?? "";
  if (overflowKey.length > 0) {
    let overflowType =
      dimension.overflow.overflowType ??
      defaultDimension.overflow.overflowType ??
      "";
    if (overflowType.length > 0) {
      if (overflowKey === "overflow-xy") {
        let tailwaindResult = checkTailwaindKey(
          tailwaindJson.overflow,
          `overflowType`,
          `overflow: ${overflowType};`
        );
        if (tailwaindResult !== null) {
          tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
        } else {
        }
      } else if (overflowKey === "overflow-x") {
        let tailwaindResult = checkTailwaindKey(
          tailwaindJson.overflow.scroll,
          `overflowX`,
          `overflow-x: ${overflowType};`
        );
        if (tailwaindResult !== null) {
          tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
        } else {
        }
      } else if (overflowKey === "overflow-y") {
        let tailwaindResult = checkTailwaindKey(
          tailwaindJson.overflow.scroll,
          `overflowY`,
          `overflow-y: ${overflowType};`
        );
        if (tailwaindResult !== null) {
          tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
        } else {
        }
      } else {
      }
    } else {
    }
  } else {
  }
}

async function stylePropsSpacing(styleJsonObject, styleDefaultJsonObject) {
  let spacing = styleJsonObject.spacing ?? "";
  let defaultSpacing = styleDefaultJsonObject.spacing ?? "";

  await stylePropsCheckAuto(
    spacing?.padding ?? "",
    defaultSpacing?.padding ?? "",
    tailwaindJson?.spacing?.padding,
    "top",
    "top",
    "paddingTop"
  );
  await stylePropsCheckAuto(
    spacing?.padding ?? "",
    defaultSpacing?.padding ?? "",
    tailwaindJson.spacing.padding,
    `right`,
    "right",
    "paddingRight"
  );
  await stylePropsCheckAuto(
    spacing?.padding ?? "",
    defaultSpacing?.padding ?? "",
    tailwaindJson.spacing.padding,
    `bottom`,
    "bottom",
    "paddingBottom"
  );
  await stylePropsCheckAuto(
    spacing?.padding ?? "",
    defaultSpacing?.padding ?? "",
    tailwaindJson.spacing.padding,
    `left`,
    "left",
    "paddingLeft"
  );
  await stylePropsCheckAuto(
    spacing?.margin ?? "",
    defaultSpacing?.margin ?? "",
    tailwaindJson.spacing.margin,
    `top`,
    "top",
    "marginTop"
  );
  await stylePropsCheckAuto(
    spacing?.margin ?? "",
    defaultSpacing?.margin ?? "",
    tailwaindJson.spacing.margin,
    `right`,
    "right",
    "marginRight"
  );
  await stylePropsCheckAuto(
    spacing?.margin ?? "",
    defaultSpacing?.margin ?? "",
    tailwaindJson.spacing.margin,
    `bottom`,
    "bottom",
    "marginBottom"
  );
  await stylePropsCheckAuto(
    spacing?.margin ?? "",
    defaultSpacing?.margin ?? "",
    tailwaindJson.spacing.margin,
    `left`,
    "left",
    "marginLeft"
  );
}

async function stylePropsPosition(styleJsonObject, styleDefaultJsonObject) {
  let position = styleJsonObject.position;
  let defaultPosition = styleDefaultJsonObject.position;

  // await stylePropsCheckTailwaindClass(
  //   position,
  //   defaultPosition ?? "",
  //   tailwaindJson.position,
  //   `positionType`,
  //   "positionType",
  //   "positionType"
  // );
  await stylePropsCheckAuto(
    position?.positionValue ?? "",
    defaultPosition?.positionValue ?? "",
    tailwaindJson.position,
    `positionValue`,
    "top",
    "positionedTop"
  );
  await stylePropsCheckAuto(
    position?.positionValue ?? "",
    defaultPosition?.positionValue ?? "",
    tailwaindJson.position,
    `positionValue`,
    "right",
    "positionedRight"
  );
  await stylePropsCheckAuto(
    position?.positionValue ?? "",
    defaultPosition?.positionValue ?? "",
    tailwaindJson.position,
    `positionValue`,
    "bottom",
    "positionedBottom"
  );
  await stylePropsCheckAuto(
    position?.positionValue ?? "",
    defaultPosition?.positionValue ?? "",
    tailwaindJson.position,
    `positionValue`,
    "left",
    "positionedLeft"
  );
}

async function stylePropsBackground(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetType
) {
  let background = styleJsonObject.background;
  let defaultBackground = styleDefaultJsonObject?.background;

  if (
    (widgetType == "QTextH1" ||
      widgetType == "QTextH2" ||
      widgetType == "QTextH3" ||
      widgetType == "QTextH4" ||
      widgetType == "QTextH5" ||
      widgetType == "QTextH6" ||
      widgetType == "Paragraph") &&
    (styleJsonObject?.typography?.text.foreground?.backgroundType == "linear" ||
      styleJsonObject?.typography?.text.foreground?.backgroundType == "radial")
  ) {
  } else {
    let backgroundType =
      background.backgroundType ?? defaultBackground?.backgroundType ?? "";
    switch (backgroundType) {
      case "solid": {
        valueProps.push({
          key: "bgColor",
          value:
            commonUtils.hexToRgba(background?.solid?.color) ??
            commonUtils.hexToRgba(defaultBackground?.solid?.color),
        });
        break;
      }
      case "linear": {
        let angle =
          background?.linearGradient?.angle ??
          defaultBackground?.linearGradient?.angle ??
          "";
        angle = angle ? `${angle.replace("°", "").trim()}deg,` : "to right,";
        let color1 = commonUtils.hexToRgba(
          background?.linearGradient?.colors[0]?.color ??
            defaultBackground?.linearGradient?.colors[0]?.color ??
            ""
        );
        let stop1 =
          background?.linearGradient?.colors[0]?.stop ??
          defaultBackground?.linearGradient?.colors[0]?.stop ??
          "";
        let color2 = commonUtils.hexToRgba(
          background?.linearGradient?.colors[1]?.color ??
            defaultBackground?.linearGradient?.colors[1]?.color ??
            ""
        );
        let stop2 =
          background.linearGradient.colors[1]?.stop ??
          defaultBackground?.linearGradient?.colors[1]?.stop ??
          "";
        valueProps.push({
          key: "bgColor",
          value: `linear-gradient(${angle} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
        });
        break;
      }
      case "radial": {
        let shape =
          background.radialGradient.shape ??
          defaultBackground?.radialGradient?.shape ??
          "";
        let color1 = commonUtils.hexToRgba(
          background.radialGradient.colors[0].color ??
            defaultBackground?.radialGradient?.colors[0]?.color ??
            ""
        );
        let stop1 =
          background.radialGradient.colors[0].stop ??
          defaultBackground?.radialGradient?.colors[0]?.stop ??
          "";
        let color2 = commonUtils.hexToRgba(
          background.radialGradient.colors[1].color ??
            defaultBackground?.radialGradient?.colors[1]?.color ??
            ""
        );
        let stop2 =
          background.radialGradient.colors[1].stop ??
          defaultBackground?.radialGradient?.colors[1]?.stop ??
          "";
        let size = await getValueWithUnit(
          background.radialGradient.size,
          defaultBackground?.radialGradient?.size
        );
        let posX = await getValueWithUnit(
          background.radialGradient.position.x,
          defaultBackground?.radialGradient?.position?.x
        );
        let posY = await getValueWithUnit(
          background.radialGradient.position.y,
          defaultBackground?.radialGradient?.position?.y
        );
        posY = posY ? `${posY},` : "";
        valueProps.push({
          key: "bgColor",
          value: `radial-gradient(${shape} ${size} at ${posX} ${posY} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
        });
        break;
      }
      case "media": {
        let bgUrl = background?.media?.url ?? defaultBackground?.media?.url ?? "";
        let backgroundRepeat =
          background?.media?.repeat ?? defaultBackground?.media?.repeat ?? "";
        let backgroundSize =
          background?.media?.size ?? defaultBackground?.media?.size ?? "";
        let seoAlt =
          background?.media?.seoAlt ?? defaultBackground?.media?.seoAlt ?? "";
        let seoTitle =
          background?.media?.seoTitle ?? defaultBackground?.media?.seoTitle ?? "";

        await stylePropsCheckTailwaindClass(
          background?.media ?? "",
          defaultBackground?.media ?? "",
          tailwaindJson?.background ?? "",
          "size",
          "size",
          "size"
        );

        await stylePropsCheckTailwaindClass(
          background?.media ?? "",
          defaultBackground?.media ?? "",
          tailwaindJson?.background ?? "",
          "repeat",
          "repeat",
          "repeat"
        );

        valueProps.push(
          {
            key: "bgUrl",
            value: `${bgUrl}`,
          },
          {
            key: "backgroundRepeat",
            value: backgroundRepeat,
          },
          {
            key: "backgroundSize",
            value: backgroundSize,
          },
          {
            key: "seoAlt",
            value: seoAlt,
          },
          {
            key: "seoTitle",
            value: seoTitle,
          }
        );

        break;
      }
      default:
        break;
    }
  }
}

async function stylePropsBoxDecoration(
  styleJsonObject,
  styleDefaultJsonObject
) {
  let boxDecoration = styleJsonObject.boxDecoration;
  let defaultBoxDecoration = styleDefaultJsonObject.boxDecoration ?? "";

  let boxDecorationBorder = boxDecoration?.border ?? "";
  let defaultBoxDecorationBorder = defaultBoxDecoration?.border;

  await stylePropsCheckTailwaindClass(
    boxDecorationBorder ?? "",
    defaultBoxDecorationBorder ?? "",
    tailwaindJson.boxDecoration.borderStyle,
    `top`,
    "top",
    "borderTS"
  );
  await stylePropsCheckTailwaindClass(
    boxDecorationBorder ?? "",
    defaultBoxDecorationBorder ?? "",
    tailwaindJson.boxDecoration.borderStyle,
    `right`,
    "right",
    "borderRS"
  );
  await stylePropsCheckTailwaindClass(
    boxDecorationBorder ?? "",
    defaultBoxDecorationBorder ?? "",
    tailwaindJson.boxDecoration.borderStyle,
    `bottom`,
    "bottom",
    "borderBS"
  );
  await stylePropsCheckTailwaindClass(
    boxDecorationBorder ?? "",
    defaultBoxDecorationBorder ?? "",
    tailwaindJson.boxDecoration.borderStyle,
    `left`,
    "left",
    "borderLS"
  );

  await stylePropsCheckAuto(
    boxDecorationBorder?.borderWidth ?? "",
    defaultBoxDecorationBorder?.borderWidth ?? "",
    tailwaindJson.boxDecoration.borderWidth,
    `top`,
    "top",
    "borderTW"
  );
  await stylePropsCheckAuto(
    boxDecorationBorder?.borderWidth ?? "",
    defaultBoxDecorationBorder?.borderWidth ?? "",
    tailwaindJson.boxDecoration.borderWidth,
    `right`,
    "right",
    "borderRW"
  );
  await stylePropsCheckAuto(
    boxDecorationBorder?.borderWidth ?? "",
    defaultBoxDecorationBorder?.borderWidth ?? "",
    tailwaindJson.boxDecoration.borderWidth,
    `bottom`,
    "bottom",
    "borderBW"
  );
  await stylePropsCheckAuto(
    boxDecorationBorder?.borderWidth ?? "",
    defaultBoxDecorationBorder?.borderWidth ?? "",
    tailwaindJson.boxDecoration.borderWidth,
    `left`,
    "left",
    "borderLW"
  );

  await stylePropsForColor(
    boxDecorationBorder?.borderColor ?? "",
    defaultBoxDecorationBorder?.borderColor ?? "",
    tailwaindJson.boxDecoration.borderColor,
    `top`,
    "top",
    "borderTC"
  );
  await stylePropsForColor(
    boxDecorationBorder?.borderColor ?? "",
    defaultBoxDecorationBorder?.borderColor ?? "",
    tailwaindJson.boxDecoration.borderColor,
    `right`,
    "right",
    "borderRC"
  );
  await stylePropsForColor(
    boxDecorationBorder?.borderColor ?? "",
    defaultBoxDecorationBorder?.borderColor ?? "",
    tailwaindJson.boxDecoration.borderColor,
    `bottom`,
    "bottom",
    "borderBC"
  );
  await stylePropsForColor(
    boxDecorationBorder?.borderColor ?? "",
    defaultBoxDecorationBorder?.borderColor ?? "",
    tailwaindJson.boxDecoration.borderColor,
    `left`,
    "left",
    "borderLC"
  );

  await stylePropsCheckAuto(
    boxDecorationBorder?.borderRadius ?? "",
    defaultBoxDecorationBorder?.borderRadius ?? "",
    tailwaindJson.boxDecoration.borderRadius,
    `topRight`,
    "topRight",
    "borderTRR"
  );
  await stylePropsCheckAuto(
    boxDecorationBorder?.borderRadius ?? "",
    defaultBoxDecorationBorder?.borderRadius ?? "",
    tailwaindJson.boxDecoration.borderRadius,
    `topLeft`,
    "topLeft",
    "borderTLR"
  );
  await stylePropsCheckAuto(
    boxDecorationBorder?.borderRadius ?? "",
    defaultBoxDecorationBorder?.borderRadius ?? "",
    tailwaindJson.boxDecoration.borderRadius,
    `bottomLeft`,
    "bottomLeft",
    "borderBLR"
  );
  await stylePropsCheckAuto(
    boxDecorationBorder?.borderRadius ?? "",
    defaultBoxDecorationBorder?.borderRadius ?? "",
    tailwaindJson.boxDecoration.borderRadius,
    `bottomRight`,
    "bottomRight",
    "borderBRR"
  );

  let boxDecorationBoxShadow = boxDecoration?.boxShadow ?? "";
  let defaultBoxDecorationBoxShadow = defaultBoxDecoration?.boxShadow ?? "";

  let offsetX = await getValueWithUnit(
    boxDecorationBoxShadow.offsetX,
    defaultBoxDecorationBoxShadow?.offsetX
  );
  let offsetY = await getValueWithUnit(
    boxDecorationBoxShadow.offsetY,
    defaultBoxDecorationBoxShadow?.offsetY
  );
  let blurRadius = await getValueWithUnit(
    boxDecorationBoxShadow.blurRadius,
    defaultBoxDecorationBoxShadow?.blurRadius
  );
  let spreadRadius = await getValueWithUnit(
    boxDecorationBoxShadow.spreadRadius,
    defaultBoxDecorationBoxShadow?.spreadRadius
  );
  let color = commonUtils.hexToRgba(
    boxDecorationBoxShadow.color ?? defaultBoxDecorationBoxShadow?.color
  );

  let shadowValue = `${offsetX ?? ""} ${offsetY ?? ""} ${blurRadius ?? ""} ${
    spreadRadius ?? ""
  } ${color ?? ""}`;
  valueProps.push({
    key: "boxShadow",
    value: shadowValue,
  });
}

async function stylePropStypography(styleJsonObject, styleDefaultJsonObject) {
  let typography = styleJsonObject.typography;
  let defaultTypography = styleDefaultJsonObject.typography;
  valueProps.push({
    key: "headerText",
    value: typography.text.value,
  });
  await stylePropsCheckTailwaindClass(
    typography.text,
    defaultTypography?.text ?? "",
    tailwaindJson.typography.text,
    `fontFamily`,
    "fontFamily",
    "fontFamily"
  );
  await stylePropsCheckAuto(
    typography.text,
    defaultTypography?.text ?? "",
    tailwaindJson.typography.text,
    `fontSize`,
    "fontSize",
    "fontSize"
  );
  await stylePropsCheckTailwaindClass(
    typography.text,
    defaultTypography?.text ?? "",
    tailwaindJson.typography.text,
    `fontWeight`,
    "fontWeight",
    "fontWeight"
  );
  await stylePropsColor(
    typography.text.foreground,
    defaultTypography?.text?.foreground ?? "",
    tailwaindJson.typography.text,
    `textColor`,
    "foreground"
  );

  /*props.push(
        {
            key: 'color',
            value: commonUtils.hexToRgba(typography.text.textColor) ??
                commonUtils.hexToRgba(defaultTypography.text.textColor),
        }
    )*/

  await stylePropsCheckTailwaindClass(
    typography?.text ?? "",
    defaultTypography?.text ?? "",
    tailwaindJson.typography.text,
    `textAlign`,
    "textAlign",
    "textAlign"
  );
  await stylePropsCheckTailwaindClass(
    typography?.text?.lineHeight ?? "",
    defaultTypography?.text?.lineHeight ?? "",
    tailwaindJson.typography.text,
    `lineHeight`,
    "v",
    "v"
  );
  await stylePropsCheckAuto(
    typography?.text ?? "",
    defaultTypography?.text ?? "",
    tailwaindJson.typography.text,
    `letterSpacing`,
    "letterSpacing",
    "letterSpacing"
  );
  await stylePropsCheckAuto(
    typography?.text ?? "",
    defaultTypography?.text ?? "",
    tailwaindJson.typography.text,
    `wordSpacing`,
    "wordSpacing",
    "wordSpacing"
  );

  await stylePropsCheckTailwaindClass(
    typography?.text?.textDecoration ?? "",
    defaultTypography?.text?.textDecoration ?? "",
    tailwaindJson.typography.text,
    `style`,
    "style",
    "style"
  );

  await stylePropsCheckTailwaindClass(
    typography?.text?.textDecoration ?? "",
    defaultTypography?.text?.textDecoration ?? "",
    tailwaindJson.typography.text.textDecoration,
    `line`,
    "line",
    "line"
  );

  await stylePropsCheckTailwaindClass(
    typography?.text?.textDecoration ?? "",
    defaultTypography?.text?.textDecoration ?? "",
    tailwaindJson.typography.text.textDecoration,
    `style`,
    "style",
    "style"
  );

  await stylePropsCheckTailwaindClass(
    typography?.text?.textDecoration ?? "",
    defaultTypography?.text?.textDecoration ?? "",
    tailwaindJson.typography.text.textDecoration,
    `color`,
    "color",
    "color"
  );

  await stylePropsCheckAuto(
    typography?.text?.textDecoration ?? "",
    defaultTypography?.text?.textDecoration ?? "",
    tailwaindJson.typography.text.textDecoration,
    `thick`,
    "thick",
    "thick"
  );

  await stylePropsCheckAuto(
    typography?.text?.textDecoration ?? "",
    defaultTypography?.text?.textDecoration ?? "",
    tailwaindJson.typography.text.textDecoration,
    `offset`,
    "offset",
    "offset"
  );

  await stylePropsCheckTailwaindClass(
    typography?.text?.more ?? "",
    defaultTypography?.text?.more ?? "",
    tailwaindJson.typography.text.more,
    `fontStyle`,
    "fontStyle",
    "fontStyle"
  );
  await stylePropsCheckTailwaindClass(
    typography?.text?.more ?? "",
    defaultTypography?.text?.more ?? "",
    tailwaindJson.typography.text.more,
    `fontVariant`,
    "fontVariant",
    "fontVariant"
  );
  await stylePropsCheckTailwaindClass(
   typography?.text?.more ?? "",
    defaultTypography?.text?.more ?? "",
    tailwaindJson.typography.text.more,
    `direction`,
    "direction",
    "direction"
  );
  await stylePropsCheckTailwaindClass(
   typography?.text?.more ?? "",
    defaultTypography?.text?.more ?? "",
    tailwaindJson.typography.text.more,
    `wordBreak`,
    "wordBreak",
    "wordBreak"
  );
  await stylePropsCheckTailwaindClass(
    typography?.text?.more ?? "",
    defaultTypography?.text?.more ?? "",
    tailwaindJson.typography.text.more,
    `lineBreak`,
    "lineBreak",
    "lineBreak"
  );
  await stylePropsCheckTailwaindClass(
   typography?.text?.more ?? "",
    defaultTypography?.text?.more ?? "",
    tailwaindJson.typography.text.more,
    `textOverflow`,
    "textOverflow",
    "textOverflow"
  );

  let offsetX = await getValueWithUnit(
    typography.text.more.textShadow.offsetX,
    defaultTypography?.text?.more?.textShadow?.offsetX ?? ""
  );
  let offsetY = await getValueWithUnit(
    typography.text.more.textShadow.offsetY,
    defaultTypography?.text?.more?.textShadow?.offsetY ?? ""
  );
  let blurRadius = await getValueWithUnit(
    typography.text.more.textShadow.blurRadius,
    defaultTypography?.text?.more?.textShadow?.blurRadius ?? ""
  );
  let spreadRadius = await getValueWithUnit(
    typography.text.more.textShadow.spreadRadius,
    defaultTypography?.text?.more?.textShadow?.spreadRadius ?? ""
  );
  let color = commonUtils.hexToRgba(
    typography.text.more.textShadow.color ??
      defaultTypography?.text?.more?.textShadow?.color ??
      ""
  );

  let shadowValue = `${offsetX ?? ""} ${offsetY ?? ""} ${blurRadius ?? ""} ${
    spreadRadius ?? ""
  } ${color ?? ""}`;
  if (shadowValue.trim().length > 0) {
    valueProps.push({
      key: "textShadow",
      value: `${offsetX ?? ""} ${offsetY ?? ""} ${blurRadius ?? ""} ${
        spreadRadius ?? ""
      } ${color ?? ""}`,
    });
  }
}

async function stylePropsDisplay(styleJsonObject, styleDefaultJsonObject) {
  let display = styleJsonObject.layout ?? "";
  let defaultDisplay = styleDefaultJsonObject.layout ?? "";
  await stylePropsCheckTailwaindClass(
    display,
    defaultDisplay,
    tailwaindJson.display,
    `displayType`,
    "displayType",
    "displayType"
  );

  if (display?.displayType == "Flex") {
    await stylePropsCheckTailwaindClass(
      display?.properties?.flex,
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      `flexDirection`,
      "flexDirection",
      "flexDirection"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flex ?? "",
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      `flexWrap`,
      "flexWrap",
      "flexWrap"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flex ?? "",
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      `justifyContent`,
      "justifyContent",
      "justifyContent"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flex ?? "",
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      `alignItems`,
      "alignItems",
      "alignItems"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flex ?? "",
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      `alignContent`,
      "alignContent",
      "alignContent"
    );

    await stylePropsCheckAuto(
      display?.properties?.flex ?? "",
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      "vSpace",
      "vSpace",
      "vSpace"
    );

    await stylePropsCheckAuto(
      display?.properties?.flex ?? "",
      defaultDisplay?.properties?.flex ?? "",
      tailwaindJson.display,
      "hSpace",
      "hSpace",
      "hSpace"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flexChild ?? "",
      defaultDisplay?.properties?.flexChild ?? "",
      tailwaindJson.display,
      `flexGrow`,
      "flexGrow",
      "flexGrow"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flexChild ?? "",
      defaultDisplay?.properties?.flexChild ?? "",
      tailwaindJson.display,
      `flexShrink`,
      "flexShrink",
      "flexShrink"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flexChild ?? "",
      defaultDisplay?.properties?.flexChild ?? "",
      tailwaindJson.display,
      `alignSelf`,
      "alignSelf",
      "alignSelf"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flexChild ?? "",
      defaultDisplay?.properties?.flexChild ?? "",
      tailwaindJson.display,
      `childAlign`,
      "childAlign",
      "childAlign"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.flexChild ?? "",
      defaultDisplay?.properties?.flexChild ?? "",
      tailwaindJson.display,
      `order`,
      "order",
      "order"
    );

    await stylePropsCheckAuto(
      display?.properties?.flexChild ?? "",
      defaultDisplay?.properties?.flexChild ?? "",
      tailwaindJson.display,
      "flexBasis",
      "flexBasis",
      "flexBasis"
    );
  }

  if (display?.displayType == "Grid") {
    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "rowCount",
      "rowCount",
      "rowCount"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "columnCount",
      "columnCount",
      "columnCount"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "gridDirection",
      "gridDirection",
      "gridDirection"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "justifyContent",
      "justifyContent",
      "justifyContent"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      `alignItems`,
      "alignItems",
      "alignItems"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      `alignContent`,
      "alignContent",
      "alignContent"
    );

    await stylePropsCheckAuto(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "vSpace",
      "vSpace",
      "vSpace"
    );

    await stylePropsCheckAuto(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "hSpace",
      "hSpace",
      "hSpace"
    );
    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "gridRowAlignment",
      "gridRowAlignment",
      "gridRowAlignment"
    );

    await stylePropsCheckTailwaindClass(
      display?.properties?.grid ?? "",
      defaultDisplay?.properties?.grid ?? "",
      tailwaindJson.display,
      "gridColumnAlignment",
      "gridColumnAlignment",
      "gridColumnAlignment"
    );
  }
}

async function stylePropsColor(
  styleJsonObject,
  styleDefaultJsonObject,
  tailwaindMapperJson,
  tailwaindCategory,
  propsKey
) {
  let backgroundType =
    styleJsonObject.backgroundType ??
    styleDefaultJsonObject?.backgroundType ??
    "";
  switch (backgroundType) {
    case "solid": {
      await stylePropsForColor(
        styleJsonObject.solid,
        styleDefaultJsonObject?.solid,
        tailwaindMapperJson,
        tailwaindCategory,
        "color",
        propsKey
      );
      break;
    }
    case "linear": {
      let angle =
        styleJsonObject.linearGradient.angle ??
        styleDefaultJsonObject?.linearGradient?.angle ??
        "";
      // angle = angle ? `${angle},` : "to right,";
      angle = angle ? `${angle.replace("°", "").trim()}deg,` : "to right,";

      let color1 = commonUtils.hexToRgba(
        styleJsonObject.linearGradient.colors[0].color ??
          styleDefaultJsonObject?.linearGradient?.colors[0]?.color ??
          ""
      );
      let stop1 =
        styleJsonObject.linearGradient.colors[0].stop ??
        styleDefaultJsonObject?.linearGradient?.colors[0]?.stop ??
        "";
      let color2 = commonUtils.hexToRgba(
        styleJsonObject.linearGradient.colors[1].color ??
          styleDefaultJsonObject?.linearGradient?.colors[1]?.color ??
          ""
      );
      let stop2 =
        styleJsonObject.linearGradient.colors[1].stop ??
        styleDefaultJsonObject?.linearGradient?.colors[1]?.stop ??
        "";
      valueProps.push({
        key: propsKey,
        value: `linear-gradient(${angle} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }
    case "radial": {
      let shape =
        styleJsonObject.radialGradient.shape ??
        styleDefaultJsonObject?.radialGradient?.shape ??
        "";
      let color1 = commonUtils.hexToRgba(
        styleJsonObject.radialGradient.colors[0].color ??
          styleDefaultJsonObject?.radialGradient?.colors[0]?.color ??
          ""
      );
      let stop1 =
        styleJsonObject.radialGradient.colors[0].stop ??
        styleDefaultJsonObject?.radialGradient?.colors[0]?.stop ??
        "";
      let color2 = commonUtils.hexToRgba(
        styleJsonObject.radialGradient.colors[1].color ??
          styleDefaultJsonObject?.radialGradient?.colors[1]?.color ??
          ""
      );
      let stop2 =
        styleJsonObject.radialGradient.colors[1].stop ??
        styleDefaultJsonObject?.radialGradient?.colors[1]?.stop ??
        "";
      let size = await getValueWithUnit(
        styleJsonObject.radialGradient.size,
        styleDefaultJsonObject?.radialGradient?.size
      );
      let posX = await getValueWithUnit(
        styleJsonObject.radialGradient.position.x,
        styleDefaultJsonObject?.radialGradient?.position?.x
      );
      let posY = await getValueWithUnit(
        styleJsonObject.radialGradient.position.y,
        styleDefaultJsonObject?.radialGradient?.position?.y
      );
      posY = posY ? `${posY},` : "";
      valueProps.push({
        key: propsKey,
        value: `radial-gradient(${shape} ${size} at ${posX} ${posY} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }
    case "media": {
      let bgUrl =
        styleJsonObject.media.url ?? styleDefaultJsonObject?.media?.url ?? "";
      let backgroundRepeat =
        styleJsonObject.media.repeat ??
        styleDefaultJsonObject?.media?.repeat ??
        "";
      let backgroundSize =
        styleJsonObject.media.size ?? styleDefaultJsonObject?.media?.size ?? "";
      let seoAlt =
        styleJsonObject.media.seoAlt ??
        styleDefaultJsonObject?.media?.seoAlt ??
        "";
      let seoTitle =
        styleJsonObject.media.seoTitle ??
        styleDefaultJsonObject?.media?.seoTitle ??
        "";

      await stylePropsCheckTailwaindClass(
        styleJsonObject?.media,
        styleDefaultJsonObject?.media ?? "",
        tailwaindJson.background,
        "size",
        "size",
        "size"
      );

      await stylePropsCheckTailwaindClass(
        styleJsonObject?.media,
        styleDefaultJsonObject?.media ?? "",
        tailwaindJson.background,
        "repeat",
        "repeat",
        "repeat"
      );

      valueProps.push(
        {
          key: "bgUrl",
          value: `${bgUrl}`,
        },
        {
          key: "backgroundRepeat",
          value: backgroundRepeat,
        },
        {
          key: "backgroundSize",
          value: backgroundSize,
        },
        {
          key: "seoAlt",
          value: seoAlt,
        },
        {
          key: "seoTitle",
          value: seoTitle,
        }
      );

      break;
    }
    default:
      break;
  }
}

async function stylePropsCheckTailwaindClass(
  propsJson,
  propsDefaultJson,
  tailwaindMapperJson,
  tailwaindCategory,
  key,
  propsKey
) {
  let value = "";
  if ((propsJson[key] ?? "").length > 0) {
    value = propsJson[key];
  } else if ((propsDefaultJson[key] ?? "").length > 0) {
    value = propsDefaultJson[key];
  } else {
  }

  if (value.length > 0) {
    let tailwaindResult = checkTailwaindKey(
      tailwaindMapperJson,
      tailwaindCategory,
      `${key}:${value};`
    );

    if (tailwaindResult !== null) {
      if (tailwaindResult.includes("{v}{u}")) {
        tailwaindClasses =
          tailwaindClasses + tailwaindResult.replace("{v}{u}", value) + ` `;
      } else if (tailwaindResult.includes("{v}")) {
        tailwaindClasses =
          tailwaindClasses + tailwaindResult.replace("{v}", value) + ` `;
      } else {
        tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
      }
    } else {
      tailwaindResult = checkTailwaindKey(
        tailwaindMapperJson,
        tailwaindCategory,
        value
      );
      if (tailwaindResult !== null) {
        if (tailwaindResult.includes("{v}{u}")) {
          tailwaindClasses =
            tailwaindClasses + tailwaindResult.replace("{v}{u}", value) + ` `;
        } else if (tailwaindResult.includes("{v}")) {
          tailwaindClasses =
            tailwaindClasses + tailwaindResult.replace("{v}", value) + ` `;
        } else {
          tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
        }
      } else {
        tailwaindResult = checkTailwaindKey(
          tailwaindMapperJson,
          tailwaindCategory,
          `custom`
        );
        if (tailwaindResult !== null) {
          if (tailwaindResult.includes("{v}{u}")) {
            tailwaindClasses =
              tailwaindClasses + tailwaindResult.replace("{v}{u}", value) + ` `;
          } else if (tailwaindResult.includes("{v}")) {
            tailwaindClasses =
              tailwaindClasses + tailwaindResult.replace("{v}", value) + ` `;
          } else {
            tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
          }
        } else {
          valueProps.push({
            key: propsKey,
            value: `${propsDefaultJson[key]}`,
          });
        }
      }
    }
  }
}

async function stylePropsForColor(
  propsJson,
  propsDefaultJson,
  tailwaindMapperJson,
  tailwaindCategory,
  key,
  propsKey
) {
  let value = "";
  if ((propsJson[key] ?? "").length > 0) {
    value = propsJson[key];
  } else if ((propsDefaultJson[key] ?? "").length > 0) {
    value = propsDefaultJson[key];
  } else {
  }
  if (value.length > 0) {
    value = commonUtils.removeTransparencyFromHexCode(value);
    let tailwaindResult = checkTailwaindKey(
      tailwaindMapperJson,
      tailwaindCategory,
      `${key}:${value};`
    );
    if (tailwaindResult !== null) {
      if (tailwaindResult.includes("{v}{u}")) {
        tailwaindClasses =
          tailwaindClasses + tailwaindResult.replace("{v}{u}", value) + ` `;
      } else if (tailwaindResult.includes("{v}")) {
        tailwaindClasses =
          tailwaindClasses + tailwaindResult.replace("{v}", value) + ` `;
      } else {
        tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
      }
    } else {
      tailwaindResult = checkTailwaindKey(
        tailwaindMapperJson,
        tailwaindCategory,
        value
      );
      if (tailwaindResult !== null) {
        if (tailwaindResult.includes("{v}{u}")) {
          tailwaindClasses =
            tailwaindClasses + tailwaindResult.replace("{v}{u}", value) + ` `;
        } else if (tailwaindResult.includes("{v}")) {
          tailwaindClasses =
            tailwaindClasses + tailwaindResult.replace("{v}", value) + ` `;
        } else {
          tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
        }
      } else {
        tailwaindResult = checkTailwaindKey(
          tailwaindMapperJson,
          tailwaindCategory,
          `custom`
        );
        if (tailwaindResult !== null) {
          if (tailwaindResult.includes("{v}{u}")) {
            tailwaindClasses =
              tailwaindClasses + tailwaindResult.replace("{v}{u}", value) + ` `;
          } else if (tailwaindResult.includes("{v}")) {
            tailwaindClasses =
              tailwaindClasses + tailwaindResult.replace("{v}", value) + ` `;
          } else {
            tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
          }
        } else {
          valueProps.push({
            key: propsKey,
            value: `${propsDefaultJson[key]}`,
          });
        }
      }
    }
  }
}

async function stylePropsCheckAuto(
  propsJson,
  propsDefaultJson,
  tailwaindMapperJson,
  tailwaindCategory,
  key,
  propsKey
) {
  let valueWithUnit = await getValueWithUnit(
    propsJson[key] ?? "",
    propsDefaultJson ? propsDefaultJson[key] : ""
  );
  if (valueWithUnit.length > 0) {
    let tailwaindResult = checkTailwaindKey(
      tailwaindMapperJson,
      tailwaindCategory,
      `${key}:${valueWithUnit};`
    );
    if (tailwaindResult !== null) {
      if (tailwaindResult.includes("{v}{u}")) {
        tailwaindClasses =
          tailwaindClasses +
          tailwaindResult.replace("{v}{u}", valueWithUnit) +
          ` `;
      } else {
        tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
      }
    } else {
      tailwaindResult = checkTailwaindKey(
        tailwaindMapperJson,
        tailwaindCategory,
        key
      );
      if (tailwaindResult !== null) {
        if (tailwaindResult.includes("{v}{u}")) {
          tailwaindClasses =
            tailwaindClasses +
            tailwaindResult.replace("{v}{u}", valueWithUnit) +
            ` `;
        } else {
          tailwaindClasses = tailwaindClasses + `${tailwaindResult} `;
        }
      } else {
        tailwaindResult = checkTailwaindKey(
          tailwaindMapperJson,
          tailwaindCategory,
          `custom`
        );
        if (tailwaindResult !== null) {
          tailwaindClasses =
            tailwaindClasses +
            tailwaindResult.replace("{v}{u}", valueWithUnit) +
            ` `;
        } else {
          valueProps.push({
            key: propsKey,
            value: `${valueWithUnit}`,
          });
        }
      }
    }
  }
}

async function getValueWithUnit(propsJson, propsDefaultJson) {
  let valueWithUnit = "";
  if ((propsJson?.v ?? propsDefaultJson?.v ?? "").length > 0) {
    if ((propsJson?.u ?? "").length > 0) {
      if (propsJson?.u !== "auto") {
        valueWithUnit = `${propsJson?.v ?? propsDefaultJson?.v ?? ""}${
          propsJson?.u
        }`;
      } else {
        valueWithUnit = `${propsJson.u}`;
      }
    } else if ((propsDefaultJson?.u ?? "").length > 0) {
      if (propsDefaultJson?.u !== "auto") {
        valueWithUnit = `${propsJson?.v ?? propsDefaultJson?.v ?? ""}${
          propsDefaultJson?.u
        }`;
      } else {
        valueWithUnit = `${propsDefaultJson?.u}`;
      }
    } else {
    }
  }
  return valueWithUnit;
}

const checkTailwaindKey = (tailwaindMapperJson, category, key) => {
  const categoryData = tailwaindMapperJson[category];
  if (categoryData && key in categoryData) {
    return categoryData[key]; // return the value
  } else {
    return null; // or undefined, or a fallback string
  }
};

async function getTailwaindClasses() {
  return tailwaindClasses;
}

async function getStyleProps() {
  return valueProps;
}

module.exports = {
  valueProps,
  tailwaindClasses,
  styleProps,
  getStyleProps,
  getTailwaindClasses,
};
