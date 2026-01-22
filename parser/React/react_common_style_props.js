const commonUtils = require("../../utility/common_utils");
const tailwaindJson = require("../../resource/css-tailwaind-mapper.json");
const reactUtilits = require("../../parser/React/common_utilits_react");
// const { ensureHash } = require("../../parser/React/common_utilits_react.js");


let valueProps = [];
let tailwaindClasses = "";

async function styleProps(styleJsonObject, styleDefaultJsonObject, widgetType) {
  valueProps = [];
  tailwaindClasses = "";

    await stylePropsCursor(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
      ""
  );

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
  await stylePropsDisplay(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetType
  );
}

async function stylePropsCursor(styleJsonObject, styleDefaultJsonObject, widgetId) {

   const cursor = styleJsonObject?.cursor ?? "";
  const defaultCursor = styleDefaultJsonObject?.cursor ?? "";


  await stylePropsCheckTailwaindClass(
    cursor,
    defaultCursor,
    tailwaindJson?.cursor ?? "",
    "cursorType",
    "cursorType",
    "cursorType"
  );

}

async function stylePropsDimenSion(styleJsonObject, styleDefaultJsonObject) {
  await stylePropsDimenSionWidth(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? ""
  );
  await stylePropsDimenSionHeight(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? ""
  );
  await stylePropsDimenSionOverflow(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? ""
  );
}

async function stylePropsDimenSionWidth(
  styleJsonObject,
  styleDefaultJsonObject
) {
  const dimension = styleJsonObject?.dimension ?? "";
  const defaultDimension = styleDefaultJsonObject?.dimension ?? "";
  const withUnit = dimension?.width?.u ?? "";

  const valLeftMargin = `${styleJsonObject?.spacing?.margin?.left?.v ?? "0"}`;
  const valRightMargin = `${styleJsonObject?.spacing?.margin?.right?.v ?? "0"}`;

  if (dimension?.minWidth?.v != "auto") {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
      "minWidth",
      "minWidth",
      "minWidth"
    );
  }

  if (dimension?.maxWidth?.v != "auto") {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
      "maxWidth",
      "maxWidth",
      "maxWidth"
    );
  }

  if (
    (withUnit === "%" || withUnit === "vw") &&
    (valLeftMargin > 0 || valRightMargin > 0)
  ) {
    const valueWithUnit = await getValueWithUnit(
      dimension?.width ?? "",
      defaultDimension?.width ?? ""
    );

    if (valueWithUnit.length > 0) {
      const leftMargin =
        valLeftMargin > 0
          ? `${valLeftMargin}${styleJsonObject?.spacing?.margin?.left?.u ?? ""}`
          : "";
      const rightMargin =
        valRightMargin > 0
          ? ` + ${valRightMargin}${
              styleJsonObject?.spacing?.margin?.right?.u ?? ""
            }`
          : "";

      valueProps.push({
        key: "widthCommon",
        value: `"calc(${valueWithUnit} - (${leftMargin}${rightMargin}))"`,
      });
    }
  } else {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
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
  const dimension = styleJsonObject?.dimension ?? "";
  const defaultDimension = styleDefaultJsonObject?.dimension ?? "";
  const heightUnit = dimension?.height?.u ?? "";

  const valTopMargin = `${styleJsonObject?.spacing?.margin?.top?.v ?? "0"}`;
  const valBottomMargin = `${
    styleJsonObject?.spacing?.margin?.bottom?.v ?? "0"
  }`;

  if (dimension?.minHeight?.v != "auto") {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
      "minHeight",
      "minHeight",
      "minHeight"
    );
  }

  if (dimension?.maxHeight?.v != "auto") {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
      "maxHeight",
      "maxHeight",
      "maxHeight"
    );
  }

  if (
    (heightUnit === "%" || heightUnit === "vh") &&
    (valTopMargin > 0 || valBottomMargin > 0)
  ) {
    const valueWithUnit = await getValueWithUnit(
      dimension?.height ?? "",
      defaultDimension?.height ?? ""
    );

    if (valueWithUnit.length > 0) {
      const topMargin =
        valTopMargin > 0
          ? `${valTopMargin}${styleJsonObject?.spacing?.margin?.top?.u ?? ""}`
          : "";
      const bottomMargin =
        valBottomMargin > 0
          ? ` + ${valBottomMargin}${
              styleJsonObject?.spacing?.margin?.bottom?.u ?? ""
            }`
          : "";

      valueProps.push({
        key: "heightCommon",
        value: `"calc(${valueWithUnit} - (${topMargin}${bottomMargin}))"`,
      });
    }
  } else {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
      "height",
      "height",
      "height"
    );
  }
}

async function stylePropsDimenSionOverflow(
  styleJsonObject,
  styleDefaultJsonObject
) {
  const dimension = styleJsonObject?.dimension ?? "";
  const defaultDimension = styleDefaultJsonObject?.dimension ?? "";

  const withUnit = dimension?.width?.u ?? "";
  const heightUnit = dimension?.height?.u ?? "";

  const overflowKey = dimension?.overflow ?? defaultDimension?.overflow ?? "";

  if (overflowKey?.length > 0) {
    const overflowType =
      dimension?.overflow?.overflowType ??
      defaultDimension?.overflow?.overflowType ??
      "";

    if (overflowType?.length > 0) {
      let tailwaindResult = null;

      if (overflowKey === "overflow-xy") {
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.overflow ?? "",
          "overflowType",
          `overflow: ${overflowType};`
        );
      } else if (overflowKey === "overflow-x") {
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.overflow?.scroll ?? "",
          "overflowX",
          `overflow-x: ${overflowType};`
        );
      } else if (overflowKey === "overflow-y") {
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.overflow?.scroll ?? "",
          "overflowY",
          `overflow-y: ${overflowType};`
        );
      }

      if (tailwaindResult !== null) {
        tailwaindClasses += `${tailwaindResult} `;
      }
    }
  }
}

async function stylePropsSpacing(styleJsonObject, styleDefaultJsonObject) {
  const spacing = styleJsonObject?.spacing ?? "";
  const defaultSpacing = styleDefaultJsonObject?.spacing ?? "";

  const padding = spacing?.padding ?? "";
  const defaultPadding = defaultSpacing?.padding ?? "";
  const margin = spacing?.margin ?? "";
  const defaultMargin = defaultSpacing?.margin ?? "";

  await stylePropsCheckAuto(
    padding,
    defaultPadding,
    tailwaindJson?.spacing?.padding,
    "top",
    "top",
    "paddingTop"
  );
  await stylePropsCheckAuto(
    padding,
    defaultPadding,
    tailwaindJson?.spacing?.padding,
    "right",
    "right",
    "paddingRight"
  );
  await stylePropsCheckAuto(
    padding,
    defaultPadding,
    tailwaindJson?.spacing?.padding,
    "bottom",
    "bottom",
    "paddingBottom"
  );
  await stylePropsCheckAuto(
    padding,
    defaultPadding,
    tailwaindJson?.spacing?.padding,
    "left",
    "left",
    "paddingLeft"
  );

  await stylePropsCheckAuto(
    margin,
    defaultMargin,
    tailwaindJson?.spacing?.margin,
    "top",
    "top",
    "marginTop"
  );
  await stylePropsCheckAuto(
    margin,
    defaultMargin,
    tailwaindJson?.spacing?.margin,
    "right",
    "right",
    "marginRight"
  );
  await stylePropsCheckAuto(
    margin,
    defaultMargin,
    tailwaindJson?.spacing?.margin,
    "bottom",
    "bottom",
    "marginBottom"
  );
  await stylePropsCheckAuto(
    margin,
    defaultMargin,
    tailwaindJson?.spacing?.margin,
    "left",
    "left",
    "marginLeft"
  );
}

async function stylePropsPosition(styleJsonObject, styleDefaultJsonObject) {
  const position = styleJsonObject?.position ?? "";
  const defaultPosition = styleDefaultJsonObject?.position ?? "";

  const positionValue = position?.positionValue ?? "";
  const defaultPositionValue = defaultPosition?.positionValue ?? "";

  const positionType = position?.positionType ?? "";
  const defaultPositionType = defaultPosition?.positionType ?? "";

  await stylePropsCheckTailwaindClass(
    position,
    defaultPosition,
    tailwaindJson?.position ?? "",
    "positionType",
    "positionType",
    "positionType"
  );

  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "top",
    "positionedTop"
  );
  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "right",
    "positionedRight"
  );
  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "bottom",
    "positionedBottom"
  );
  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "left",
    "positionedLeft"
  );
}

async function stylePropsBackground(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetType
) {
  const background = styleJsonObject?.background ?? "";
  const defaultBackground = styleDefaultJsonObject?.background ?? "";

  const typographyBgType =
    styleJsonObject?.typography?.text?.foreground?.backgroundType ?? "";

  if (
    [
      "QTextH1",
      "QTextH2",
      "QTextH3",
      "QTextH4",
      "QTextH5",
      "QTextH6",
      "Paragraph",
    ].includes(widgetType) &&
    (typographyBgType === "linear" || typographyBgType === "radial")
  ) {
    return;
  }

  const backgroundType = background?.backgroundType ?? "";

  switch (backgroundType) {
    case "solid": {
      valueProps.push({
        key: "bgColorCommon",
        value:
          commonUtils.hexToRgba(background?.solid?.color ?? "") ??
          commonUtils.hexToRgba(defaultBackground?.solid?.color ?? ""),
      });
      break;
    }

    case "linear": {
      let angle =
        background?.linearGradient?.angle ??
        defaultBackground?.linearGradient?.angle ??
        "";
      angle = angle ? `${angle.replace("°", "").trim()}deg,` : "to right,";

      const color1 = commonUtils.hexToRgba(
        background?.linearGradient?.colors?.[0]?.color ??
          defaultBackground?.linearGradient?.colors?.[0]?.color ??
          ""
      );
      const stop1 =
        background?.linearGradient?.colors?.[0]?.stop ??
        defaultBackground?.linearGradient?.colors?.[0]?.stop ??
        "";

      const color2 = commonUtils.hexToRgba(
        background?.linearGradient?.colors?.[1]?.color ??
          defaultBackground?.linearGradient?.colors?.[1]?.color ??
          ""
      );
      const stop2 =
        background?.linearGradient?.colors?.[1]?.stop ??
        defaultBackground?.linearGradient?.colors?.[1]?.stop ??
        "";

      valueProps.push({
        key: "bgColorCommon",
        value: `linear-gradient(${angle} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }

    case "radial": {
      const shape =
        background?.radialGradient?.shape ??
        defaultBackground?.radialGradient?.shape ??
        "";

      const color1 = commonUtils.hexToRgba(
        background?.radialGradient?.colors?.[0]?.color ??
          defaultBackground?.radialGradient?.colors?.[0]?.color ??
          ""
      );
      const stop1 =
        background?.radialGradient?.colors?.[0]?.stop ??
        defaultBackground?.radialGradient?.colors?.[0]?.stop ??
        "";

      const color2 = commonUtils.hexToRgba(
        background?.radialGradient?.colors?.[1]?.color ??
          defaultBackground?.radialGradient?.colors?.[1]?.color ??
          ""
      );
      const stop2 =
        background?.radialGradient?.colors?.[1]?.stop ??
        defaultBackground?.radialGradient?.colors?.[1]?.stop ??
        "";

      const size = await getValueWithUnit(
        background?.radialGradient?.size ?? "",
        defaultBackground?.radialGradient?.size ?? ""
      );
      const posX = await getValueWithUnit(
        background?.radialGradient?.position?.x ?? "",
        defaultBackground?.radialGradient?.position?.x ?? ""
      );
      let posY = await getValueWithUnit(
        background?.radialGradient?.position?.y ?? "",
        defaultBackground?.radialGradient?.position?.y ?? ""
      );
      posY = posY ? `${posY},` : "";

      valueProps.push({
        key: "bgColorCommon",
        value: `radial-gradient(${shape} ${size} at ${posX} ${posY} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }

    case "media": {
      if (typeof background === "object" && background?.media) {
        const media = background?.media ?? "";
        const defaultMedia = defaultBackground?.media ?? "";

        const bgUrl = media?.url ?? "";
        const backgroundRepeat = media?.repeat ?? "";
        const backgroundSize = media?.size ?? "";
        const seoAlt = media?.seoAlt ?? "";
        const seoTitle = media?.seoTitle ?? "";

        await stylePropsCheckTailwaindClass(
          media,
          defaultMedia,
          tailwaindJson?.background ?? "",
          "size",
          "size",
          "size"
        );
        if (backgroundRepeat) {
          await stylePropsCheckTailwaindClass(
            media,
            defaultMedia,
            tailwaindJson?.background ?? "",
            "repeat",
            "repeat",
            "repeat"
          );
        }
        valueProps.push(
          { key: "bgUrlCommon", value: `${bgUrl}` },
          { key: "backgroundRepeatCommon", value: backgroundRepeat },
          { key: "backgroundSizeCommon", value: backgroundSize },
          { key: "seoAltCommon", value: seoAlt },
          { key: "seoTitleCommon", value: seoTitle }
        );
      }
      break;
    }

    default: {
      if (typeof background === "object" && background?.media) {
        const media = background?.media ?? "";
        const defaultMedia = defaultBackground?.media ?? "";

        const bgUrl = media?.url ?? "";
        if (bgUrl.length > 0) {
          const backgroundRepeat = media?.repeat ?? "";
          const backgroundSize = media?.size ?? "";
          const seoAlt = media?.seoAlt ?? "";
          const seoTitle = media?.seoTitle ?? "";

          await stylePropsCheckTailwaindClass(
            media,
            defaultMedia,
            tailwaindJson?.background ?? "",
            "size",
            "size",
            "size"
          );
          if (backgroundRepeat) {
            await stylePropsCheckTailwaindClass(
              media,
              defaultMedia,
              tailwaindJson?.background ?? "",
              "repeat",
              "repeat",
              "repeat"
            );
          }
          valueProps.push(
            { key: "bgUrlCommon", value: `${bgUrl}` },
            { key: "backgroundRepeatCommon", value: backgroundRepeat },
            { key: "backgroundSizeCommon", value: backgroundSize },
            { key: "seoAltCommon", value: seoAlt },
            { key: "seoTitleCommon", value: seoTitle }
          );
        } else if ((background?.solid?.color ?? "").length > 0) {
          valueProps.push({
            key: "bgColorCommon",
            value:
              commonUtils.hexToRgba(background?.solid?.color ?? "") ??
              commonUtils.hexToRgba(defaultBackground?.solid?.color ?? ""),
          });
        } else {
        }
      } else if ((background?.solid?.color ?? "").length > 0) {
        valueProps.push({
          key: "bgColorCommon",
          value:
            commonUtils.hexToRgba(background?.solid?.color ?? "") ??
            commonUtils.hexToRgba(defaultBackground?.solid?.color ?? ""),
        });
      } else {
      }
      break;
    }
  }
}

async function stylePropsBoxDecoration(
  styleJsonObject,
  styleDefaultJsonObject
) {
  const boxDecoration = styleJsonObject?.boxDecoration ?? "";
  const defaultBoxDecoration = styleDefaultJsonObject?.boxDecoration ?? "";

  const boxDecorationBorder = boxDecoration?.border ?? "";
  const defaultBoxDecorationBorder = defaultBoxDecoration?.border ?? "";

  // Border Style
  for (const dir of ["top", "right", "bottom", "left"]) {
    await stylePropsCheckTailwaindClass(
      boxDecorationBorder,
      defaultBoxDecorationBorder,
      tailwaindJson?.boxDecoration?.borderStyle,
      dir,
      dir,
      `border${dir[0].toUpperCase()}S`
    );
  }

  // Border Width
  for (const dir of ["top", "right", "bottom", "left"]) {
    await stylePropsCheckAuto(
      boxDecorationBorder?.borderWidth ?? "",
      defaultBoxDecorationBorder?.borderWidth ?? "",
      tailwaindJson?.boxDecoration?.borderWidth,
      dir,
      dir,
      `border${dir[0].toUpperCase()}W`
    );
  }



  // Border Color
  for (const dir of ["top", "right", "bottom", "left"]) {
    await stylePropsForColor(
       await commonUtils.ensureHash(boxDecorationBorder?.borderColor ?? ""),
       await commonUtils.ensureHash(defaultBoxDecorationBorder?.borderColor ?? ""),
      tailwaindJson?.boxDecoration?.borderColor,
      dir,
      dir,
      `border${dir[0].toUpperCase()}C`
    );
  }

  // Border Radius
  const radiusMap = {
    topRight: "borderTRR",
    topLeft: "borderTLR",
    bottomLeft: "borderBLR",
    bottomRight: "borderBRR",
  };

  for (const key in radiusMap) {
    await stylePropsCheckAuto(
      boxDecorationBorder?.borderRadius ?? "",
      defaultBoxDecorationBorder?.borderRadius ?? "",
      tailwaindJson?.boxDecoration?.borderRadius,
      key,
      key,
      radiusMap[key]
    );
  }

  // Box Shadow
  const boxDecorationBoxShadow = boxDecoration?.boxShadow ?? "";
  const defaultBoxDecorationBoxShadow = defaultBoxDecoration?.boxShadow ?? "";

  const offsetX = await getValueWithUnit(
    boxDecorationBoxShadow?.offsetX ?? "",
    defaultBoxDecorationBoxShadow?.offsetX ?? ""
  );
  const offsetY = await getValueWithUnit(
    boxDecorationBoxShadow?.offsetY ?? "",
    defaultBoxDecorationBoxShadow?.offsetY ?? ""
  );
  const blurRadius = await getValueWithUnit(
    boxDecorationBoxShadow?.blurRadius ?? "",
    defaultBoxDecorationBoxShadow?.blurRadius ?? ""
  );
  const spreadRadius = await getValueWithUnit(
    boxDecorationBoxShadow?.spreadRadius ?? "",
    defaultBoxDecorationBoxShadow?.spreadRadius ?? ""
  );
  const color = commonUtils.hexToRgba(
    boxDecorationBoxShadow?.color ?? defaultBoxDecorationBoxShadow?.color ?? ""
  );

  const shadowValue = `${offsetX ?? ""} ${offsetY ?? ""} ${blurRadius ?? ""} ${
    spreadRadius ?? ""
  } ${color ?? ""}`;
  valueProps.push({ key: "boxShadowCommon", value: shadowValue });
}

async function stylePropStypography(styleJsonObject, styleDefaultJsonObject) {
  const typography = styleJsonObject?.typography ?? "";
  const defaultTypography = styleDefaultJsonObject?.typography ?? "";

  const text = typography?.text ?? "";
  const defaultText = defaultTypography?.text ?? "";

  const textDecoration = text?.textDecoration ?? "";
  const defaultTextDecoration = defaultText?.textDecoration ?? "";

  const more = text?.more ?? "";
  const defaultMore = defaultText?.more ?? "";

  const textShadow = more?.textShadow ?? "";
  const defaultTextShadow = defaultMore?.textShadow ?? "";

  valueProps.push({
    key: "headerText",
    value: text?.value ?? "",
  });

  await stylePropsCheckTailwaindClass(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "fontFamily",
    "fontFamily",
    "fontFamily"
  );
  await stylePropsCheckAuto(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "fontSize",
    "fontSize",
    "fontSize"
  );
  await stylePropsCheckTailwaindClass(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "fontWeight",
    "fontWeight",
    "fontWeight"
  );

  await stylePropsColor(
    text?.foreground ?? "",
    defaultText?.foreground ?? "",
    tailwaindJson.typography.text,
    "textColor",
    "foreground"
  );

  await stylePropsCheckTailwaindClass(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "textAlign",
    "textAlign",
    "textAlign"
  );
  await stylePropsCheckTailwaindClass(
    text?.lineHeight ?? "",
    defaultText?.lineHeight ?? "",
    tailwaindJson.typography.text,
    "lineHeight",
    "v",
    "v"
  );

  await stylePropsCheckAuto(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "letterSpacing",
    "letterSpacing",
    "letterSpacing"
  );
  await stylePropsCheckAuto(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "wordSpacing",
    "wordSpacing",
    "wordSpacing"
  );

  await stylePropsCheckTailwaindClass(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text,
    "style",
    "style",
    "style"
  );

  let lineString = (textDecoration?.line ?? [])
    .map((v) => (v === "lineThrough" ? "line-through" : v))
    .join(" ");

  valueProps.push({
    key: "textDecorationLineCommon",
    value: lineString,
  });

  await stylePropsCheckTailwaindClass(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text.textDecoration,
    "style",
    "style",
    "style"
  );

  await stylePropsForColor(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text.textDecoration,
    "color",
    "color",
    "color"
  );

  await stylePropsCheckAuto(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text.textDecoration,
    "thick",
    "thick",
    "thick"
  );
  await stylePropsCheckAuto(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text.textDecoration,
    "offset",
    "offset",
    "offset"
  );

  await stylePropsCheckAuto(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text.textDecoration,
    "strokeWidth",
    "strokeWidth",
    "strokeWidth"
  );

  await stylePropsCheckTailwaindClass(
    textDecoration,
    defaultTextDecoration,
    tailwaindJson.typography.text.textDecoration,
    "strokeColor",
    "strokeColor",
    "strokeColor",
    commonUtils.removeTransparencyFromHexCode(textDecoration?.strokeColor ?? "")
  );

  //  await stylePropsForColor(
  //      textDecoration,
  //   defaultTextDecoration,
  //   tailwaindJson.typography.text.textDecoration,
  //   "strokeColor",
  //   "strokeColor",
  //   "strokeColor"
  //     );

  await stylePropsCheckTailwaindClass(
    more,
    defaultMore,
    tailwaindJson.typography.text.more,
    "fontStyle",
    "fontStyle",
    "fontStyle"
  );
  await stylePropsCheckTailwaindClass(
    more,
    defaultMore,
    tailwaindJson.typography.text.more,
    "fontVariant",
    "fontVariant",
    "fontVariant"
  );
  await stylePropsCheckTailwaindClass(
    more,
    defaultMore,
    tailwaindJson.typography.text.more,
    "direction",
    "direction",
    "direction"
  );

  await stylePropsCheckTailwaindClass(
    more,
    defaultMore,
    tailwaindJson.typography.text.more,
    "wordBreak",
    "wordBreak",
    "wordBreak"
  );
  await stylePropsCheckTailwaindClass(
    more,
    defaultMore,
    tailwaindJson.typography.text.more,
    "lineBreak",
    "lineBreak",
    "lineBreak"
  );
  await stylePropsCheckTailwaindClass(
    more,
    defaultMore,
    tailwaindJson.typography.text.more,
    "textOverflow",
    "textOverflow",
    "textOverflow"
  );

  const offsetX = await getValueWithUnit(
    textShadow?.offsetX ?? "",
    defaultTextShadow?.offsetX ?? ""
  );
  const offsetY = await getValueWithUnit(
    textShadow?.offsetY ?? "",
    defaultTextShadow?.offsetY ?? ""
  );
  const blurRadius = await getValueWithUnit(
    textShadow?.blurRadius ?? "",
    defaultTextShadow?.blurRadius ?? ""
  );
  const spreadRadius = await getValueWithUnit(
    textShadow?.spreadRadius ?? "",
    defaultTextShadow?.spreadRadius ?? ""
  );
  const color = commonUtils.hexToRgba(
    textShadow?.color ?? defaultTextShadow?.color ?? ""
  );

  const shadowValue = [offsetX, offsetY, blurRadius, spreadRadius, color]
    .filter(Boolean)
    .join(" ");

  if (shadowValue) {
    valueProps.push({
      key: "textShadowCommon",
      value: shadowValue,
    });
  }
}

async function stylePropsDisplay(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetType
) {
  const layout = styleJsonObject?.layout ?? "";
  const defaultLayout = styleDefaultJsonObject?.layout ?? "";

  const displayType = layout?.displayType ?? "";
  const flex = layout?.properties?.flex ?? "";
  const defaultFlex = defaultLayout?.properties?.flex ?? "";

  const flexChild = layout?.properties?.flexChild ?? "";
  const defaultFlexChild = defaultLayout?.properties?.flexChild ?? "";

  const grid = layout?.properties?.grid ?? "";
  const defaultGrid = defaultLayout?.properties?.grid ?? "";

  await stylePropsCheckTailwaindClass(
    layout,
    defaultLayout,
    tailwaindJson.display,
    "displayType",
    "displayType",
    "displayType"
  );

  if (displayType === "Flex") {
    await stylePropsCheckTailwaindClass(
      flex,
      defaultFlex,
      tailwaindJson.display,
      "flexDirection",
      "flexDirection",
      "flexDirection"
    );
    await stylePropsCheckTailwaindClass(
      flex,
      defaultFlex,
      tailwaindJson.display,
      "flexWrap",
      "flexWrap",
      "flexWrap"
    );
    if (widgetType != "QStack") {
      await stylePropsCheckTailwaindClass(
        flex,
        defaultFlex,
        tailwaindJson.display,
        "justifyContent",
        "justifyContent",
        "justifyContent"
      );
      await stylePropsCheckTailwaindClass(
        flex,
        defaultFlex,
        tailwaindJson.display,
        "alignItems",
        "alignItems",
        "alignItems"
      );
      await stylePropsCheckTailwaindClass(
        flex,
        defaultFlex,
        tailwaindJson.display,
        "alignContent",
        "alignContent",
        "alignContent"
      );
    }

    await stylePropsCheckAuto(
      flex,
      defaultFlex,
      tailwaindJson.display,
      "vSpace",
      "vSpace",
      "vSpace"
    );
    await stylePropsCheckAuto(
      flex,
      defaultFlex,
      tailwaindJson.display,
      "hSpace",
      "hSpace",
      "hSpace"
    );

    await stylePropsCheckTailwaindClass(
      flexChild,
      defaultFlexChild,
      tailwaindJson.display,
      "flexGrow",
      "flexGrow",
      "flexGrow"
    );
    await stylePropsCheckTailwaindClass(
      flexChild,
      defaultFlexChild,
      tailwaindJson.display,
      "flexShrink",
      "flexShrink",
      "flexShrink"
    );
    await stylePropsCheckTailwaindClass(
      flexChild,
      defaultFlexChild,
      tailwaindJson.display,
      "alignSelf",
      "alignSelf",
      "alignSelf"
    );
    await stylePropsCheckTailwaindClass(
      flexChild,
      defaultFlexChild,
      tailwaindJson.display,
      "childAlign",
      "childAlign",
      "childAlign"
    );
    await stylePropsCheckTailwaindClass(
      flexChild,
      defaultFlexChild,
      tailwaindJson.display,
      "order",
      "order",
      "order"
    );

    await stylePropsCheckAuto(
      flexChild,
      defaultFlexChild,
      tailwaindJson.display,
      "flexBasis",
      "flexBasis",
      "flexBasis"
    );
  }

  if (displayType === "Grid") {
    await stylePropsCheckTailwaindClass(
      grid,
      defaultGrid,
      tailwaindJson.display,
      "rowCount",
      "rowCount",
      "rowCount"
    );
    await stylePropsCheckTailwaindClass(
      grid,
      defaultGrid,
      tailwaindJson.display,
      "columnCount",
      "columnCount",
      "columnCount"
    );
    await stylePropsCheckTailwaindClass(
      grid,
      defaultGrid,
      tailwaindJson.display,
      "gridDirection",
      "gridDirection",
      "gridDirection"
    );
    if (widgetType != "QStack") {
      await stylePropsCheckTailwaindClass(
        grid,
        defaultGrid,
        tailwaindJson.display,
        "justifyContent",
        "justifyContent",
        "justifyContent"
      );
      await stylePropsCheckTailwaindClass(
        grid,
        defaultGrid,
        tailwaindJson.display,
        "alignItems",
        "alignItems",
        "alignItems"
      );
      await stylePropsCheckTailwaindClass(
        grid,
        defaultGrid,
        tailwaindJson.display,
        "alignContent",
        "alignContent",
        "alignContent"
      );
    }

    await stylePropsCheckAuto(
      grid,
      defaultGrid,
      tailwaindJson.display,
      "vSpace",
      "vSpace",
      "vSpace"
    );
    await stylePropsCheckAuto(
      grid,
      defaultGrid,
      tailwaindJson.display,
      "hSpace",
      "hSpace",
      "hSpace"
    );

    await stylePropsCheckTailwaindClass(
      grid,
      defaultGrid,
      tailwaindJson.display,
      "gridRowAlignment",
      "gridRowAlignment",
      "gridRowAlignment"
    );
    await stylePropsCheckTailwaindClass(
      grid,
      defaultGrid,
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
  const backgroundType = styleJsonObject?.backgroundType ?? "";

  switch (backgroundType) {
    case "solid": {
      await stylePropsForColor(
        styleJsonObject?.solid ?? "",
        styleDefaultJsonObject?.solid ?? "",
        tailwaindMapperJson,
        tailwaindCategory,
        "color",
        propsKey
      );
      break;
    }

    case "linear": {
      const angle =
        styleJsonObject?.linearGradient?.angle ??
        styleDefaultJsonObject?.linearGradient?.angle ??
        "";
      const angleStr = angle
        ? `${angle.replace("°", "").trim()}deg,`
        : "to right,";

      const color1 = commonUtils.hexToRgba(
        styleJsonObject?.linearGradient?.colors?.[0]?.color ??
          styleDefaultJsonObject?.linearGradient?.colors?.[0]?.color ??
          ""
      );
      const stop1 =
        styleJsonObject?.linearGradient?.colors?.[0]?.stop ??
        styleDefaultJsonObject?.linearGradient?.colors?.[0]?.stop ??
        "";

      const color2 = commonUtils.hexToRgba(
        styleJsonObject?.linearGradient?.colors?.[1]?.color ??
          styleDefaultJsonObject?.linearGradient?.colors?.[1]?.color ??
          ""
      );
      const stop2 =
        styleJsonObject?.linearGradient?.colors?.[1]?.stop ??
        styleDefaultJsonObject?.linearGradient?.colors?.[1]?.stop ??
        "";

      valueProps.push({
        key: `${propsKey}Common`,
        value: `linear-gradient(${angleStr} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }

    case "radial": {
      const shape =
        styleJsonObject?.radialGradient?.shape ??
        styleDefaultJsonObject?.radialGradient?.shape ??
        "";

      const color1 = commonUtils.hexToRgba(
        styleJsonObject?.radialGradient?.colors?.[0]?.color ??
          styleDefaultJsonObject?.radialGradient?.colors?.[0]?.color ??
          ""
      );
      const stop1 =
        styleJsonObject?.radialGradient?.colors?.[0]?.stop ??
        styleDefaultJsonObject?.radialGradient?.colors?.[0]?.stop ??
        "";

      const color2 = commonUtils.hexToRgba(
        styleJsonObject?.radialGradient?.colors?.[1]?.color ??
          styleDefaultJsonObject?.radialGradient?.colors?.[1]?.color ??
          ""
      );
      const stop2 =
        styleJsonObject?.radialGradient?.colors?.[1]?.stop ??
        styleDefaultJsonObject?.radialGradient?.colors?.[1]?.stop ??
        "";

      const size = await getValueWithUnit(
        styleJsonObject?.radialGradient?.size,
        styleDefaultJsonObject?.radialGradient?.size ?? ""
      );
      const posX = await getValueWithUnit(
        styleJsonObject?.radialGradient?.position?.x,
        styleDefaultJsonObject?.radialGradient?.position?.x ?? ""
      );
      let posY = await getValueWithUnit(
        styleJsonObject?.radialGradient?.position?.y,
        styleDefaultJsonObject?.radialGradient?.position?.y ?? ""
      );
      posY = posY ? `${posY},` : "";

      valueProps.push({
        key: `${propsKey}Common`,
        value: `radial-gradient(${shape} ${size} at ${posX} ${posY} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }

    case "media": {
      if (typeof styleJsonObject === "object" && styleJsonObject?.media) {
        const media = styleJsonObject?.media ?? {};
        const defaultMedia = styleDefaultJsonObject?.media ?? {};
        const bgUrl = media.url ?? "";
        const backgroundRepeat = media.repeat ?? "";
        const backgroundSize = media.size ?? "";
        const seoAlt = media.seoAlt ?? "";
        const seoTitle = media.seoTitle ?? "";

        await stylePropsCheckTailwaindClass(
          media,
          defaultMedia,
          tailwaindJson.background,
          "size",
          "size",
          "size"
        );

        if (backgroundRepeat) {
          await stylePropsCheckTailwaindClass(
            media,
            defaultMedia,
            tailwaindJson.background,
            "repeat",
            "repeat",
            "repeat"
          );
        }

        valueProps.push(
          { key: "bgUrlCommon", value: bgUrl },
          { key: "backgroundRepeatCommon", value: backgroundRepeat },
          { key: "backgroundSizeCommon", value: backgroundSize },
          { key: "seoAltCommon", value: seoAlt },
          { key: "seoTitleCommon", value: seoTitle }
        );
      }

      break;
    }

    default: {
      // console.log(`default: ${styleJsonObject?.solid?.color}`);
      if (typeof styleJsonObject === "object" && styleJsonObject?.media) {
        const media = styleJsonObject?.media ?? {};
        const defaultMedia = styleDefaultJsonObject?.media ?? {};
        const bgUrl = media.url ?? "";
        if (bgUrl.length > 0) {
          const backgroundRepeat = media.repeat ?? "";
          const backgroundSize = media.size ?? "";
          const seoAlt = media.seoAlt ?? "";
          const seoTitle = media.seoTitle ?? "";

          await stylePropsCheckTailwaindClass(
            media,
            defaultMedia,
            tailwaindJson.background,
            "size",
            "size",
            "size"
          );

          if (backgroundRepeat) {
            await stylePropsCheckTailwaindClass(
              media,
              defaultMedia,
              tailwaindJson.background,
              "repeat",
              "repeat",
              "repeat"
            );
          }
          valueProps.push(
            { key: "bgUrlCommon", value: bgUrl },
            { key: "backgroundRepeatCommon", value: backgroundRepeat },
            { key: "backgroundSizeCommon", value: backgroundSize },
            { key: "seoAltCommon", value: seoAlt },
            { key: "seoTitleCommon", value: seoTitle }
          );
        } else if ((styleJsonObject?.solid?.color ?? "").length > 0) {
          // console.log(`styleJsonObject?.solid: ${styleJsonObject?.solid?.color}`);
          await stylePropsForColor(
            styleJsonObject?.solid ?? "",
            styleDefaultJsonObject?.solid ?? "",
            tailwaindMapperJson,
            tailwaindCategory,
            "color",
            propsKey
          );
        } else {
        }
      } else if ((styleJsonObject?.solid?.color ?? "").length > 0) {
        await stylePropsForColor(
          styleJsonObject?.solid ?? "",
          styleDefaultJsonObject?.solid ?? "",
          tailwaindMapperJson,
          tailwaindCategory,
          "color",
          propsKey
        );
      } else {
      }
      break;
    }
  }
}

async function stylePropsCheckTailwaindClass(
  propsJson,
  propsDefaultJson,
  tailwaindMapperJson,
  tailwaindCategory,
  key,
  propsKey,
  propsValue = ""
) {
  const value =
    propsValue.length > 0
      ? propsValue
      : propsJson?.[key] ?? propsDefaultJson?.[key] ?? "";

  if (!value || value.length === 0) return;

  const tryMap = (input) =>
    checkTailwaindKey(tailwaindMapperJson, tailwaindCategory, input);

  let tailwaindResult =
    tryMap(`${key}:${value};`) ?? tryMap(value) ?? tryMap("custom");

  if (tailwaindResult) {
    if (tailwaindResult.includes("{v}{u}")) {
      tailwaindClasses += tailwaindResult.replace("{v}{u}", value) + " ";
    } else if (tailwaindResult.includes("{v}")) {
      tailwaindClasses += tailwaindResult.replace("{v}", value) + " ";
    } else {
      tailwaindClasses += tailwaindResult + " ";
    }
  } else {
    valueProps.push({
      key: `${propsKey}Common`,
      value: value ?? "",
    });
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
  // console.log(
  //   `tailwaind: ${key} propsJson: ${propsJson} propsKey: ${propsKey}`
  // );
  let value = propsJson?.[key] ?? propsDefaultJson?.[key] ?? "";

  if (!value || value.length === 0) return;

  value = commonUtils.removeTransparencyFromHexCode(value);

  const tryMap = (input) =>
    checkTailwaindKey(tailwaindMapperJson, tailwaindCategory, input);

  let tailwaindResult =
    tryMap(`${key}:${value};`) ?? tryMap(value) ?? tryMap("custom");

  if (tailwaindResult) {
    if (tailwaindResult.includes("{v}{u}")) {
      tailwaindClasses += tailwaindResult.replace("{v}{u}", value) + " ";
    } else if (tailwaindResult.includes("{v}")) {
      tailwaindClasses += tailwaindResult.replace("{v}", value) + " ";
    } else {
      tailwaindClasses += tailwaindResult + " ";
    }
  } else {
    valueProps.push({
      key: `${propsKey}Common`,
      value: value ?? "",
    });
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
  const valueWithUnit = await getValueWithUnit(
    propsJson?.[key] ?? "",
    propsDefaultJson?.[key] ?? ""
  );

  if (!valueWithUnit || valueWithUnit.length === 0) return;

  const tryMap = (input) =>
    checkTailwaindKey(tailwaindMapperJson, tailwaindCategory, input);

  let tailwaindResult =
    tryMap(`${key}:${valueWithUnit};`) ?? tryMap(key) ?? tryMap("custom");

  if (tailwaindResult) {
    if (tailwaindResult.includes("{v}{u}")) {
      tailwaindClasses +=
        tailwaindResult.replace("{v}{u}", valueWithUnit) + " ";
    } else {
      tailwaindClasses += tailwaindResult + " ";
    }
  } else {
    valueProps.push({
      key: `${propsKey}Common`,
      value: valueWithUnit,
    });
  }
}

async function getValueWithUnit(propsJson, propsDefaultJson) {
  const v = propsJson?.v ?? propsDefaultJson?.v ?? "";
  const u = propsJson?.u ?? propsDefaultJson?.u ?? "";

  if (!v && u !== "auto") return ""; // no value means nothing to compute

  if (u === "auto") {
    return "auto";
  }

  return `${v}${u}`;
}

const checkTailwaindKey = (mapper, category, key) => {
  return mapper?.[category]?.[key] ?? null;
};

function getTailwaindClasses() {
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
