const commonUtils = require("../../utility/common_utils");
const tailwaindJson = require("../../resource/css-tailwaind-mapper.json");
const cssThemeMapperJson = require("../../resource/css-theme-mapper.json");
const reactJsMapper = require("../../mapper/reactjs/reactjs_mapper")
const commonUtilsReact = require("../../parser/React/common_utilits_react");


let valueProps = [];
let tailwaindClasses = "";

async function styleProps(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetType,
  widgetId
) {
  valueProps = [];
  tailwaindClasses = "";

  await stylePropsCursor(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId ?? ""
  );

  await stylePropsDimenSion(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId ?? ""
  );
  await stylePropsSpacing(styleJsonObject ?? "", styleDefaultJsonObject ?? "", widgetId ?? "");
  await stylePropsPosition(styleJsonObject ?? "", styleDefaultJsonObject ?? "", widgetId ?? "");
  await stylePropsBackground(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetType,
     widgetId ?? ""
  );
  await stylePropsBoxDecoration(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId ?? ""
  );
  await stylePropStypography(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId ?? ""
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

async function stylePropsDimenSion(styleJsonObject, styleDefaultJsonObject, widgetId) {

  await stylePropsDimenSionWidth(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId
  );
  await stylePropsDimenSionHeight(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId
  );
  await stylePropsDimenSionOverflow(
    styleJsonObject ?? "",
    styleDefaultJsonObject ?? "",
    widgetId
  );
}

async function stylePropsDimenSionWidth(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetId
) {
  const dimension = styleJsonObject?.dimension ?? "";
  const defaultDimension = styleDefaultJsonObject?.dimension ?? "";
  const withUnit = dimension?.width?.u ?? "";

  const valLeftMargin = `${styleJsonObject?.spacing?.margin?.left?.v ?? "0"}`;
  const valRightMargin = `${styleJsonObject?.spacing?.margin?.right?.v ?? "0"}`;



  let minWidthThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "dimension.minWidth",
    "size"
  );

  if (minWidthThmVariable.length > 0) {

    await stylePropsWithTheme(minWidthThmVariable, "dimension.minWidth");
  } else if (dimension?.minWidth?.v != "auto") {
    await stylePropsCheckAuto(
      dimension,
      defaultDimension ?? "",
      tailwaindJson?.dimension ?? "",
      "minWidth",
      "minWidth",
      "minWidth"
    );
  }


  let maxWidthThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "dimension.maxWidth",
    "size"
  );

  if (maxWidthThmVariable.length > 0) {

    await stylePropsWithTheme(maxWidthThmVariable, "dimension.maxWidth");
  } else {
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
          ? ` + ${valRightMargin}${styleJsonObject?.spacing?.margin?.right?.u ?? ""
          }`
          : "";

      valueProps.push({
        key: "width",
        value: `"calc(${valueWithUnit} - (${leftMargin}${rightMargin}))"`,
      });
    }
  } else {  

    let widthThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      "dimension.width",
      "size"
    );

    if (widthThmVariable.length > 0) {

      await stylePropsWithTheme(widthThmVariable, "dimension.width");
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
}

async function stylePropsDimenSionHeight(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetId
) {
  const dimension = styleJsonObject?.dimension ?? "";
  const defaultDimension = styleDefaultJsonObject?.dimension ?? "";
  const heightUnit = dimension?.height?.u ?? "";

  const valTopMargin = `${styleJsonObject?.spacing?.margin?.top?.v ?? "0"}`;
  const valBottomMargin = `${styleJsonObject?.spacing?.margin?.bottom?.v ?? "0"
    }`;

  let minHeightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "dimension.minHeight",
    "size"
  );

  if (minHeightThmVariable.length > 0) {

    await stylePropsWithTheme(minHeightThmVariable, "dimension.minHeight");
  } else {
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
  }


  let maxHeightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "dimension.maxHeight",
    "size"
  );

  if (maxHeightThmVariable.length > 0) {

    await stylePropsWithTheme(maxHeightThmVariable, "dimension.maxHeight");
  } else {
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
          ? ` + ${valBottomMargin}${styleJsonObject?.spacing?.margin?.bottom?.u ?? ""
          }`
          : "";

      valueProps.push({
        key: "height",
        value: `"calc(${valueWithUnit} - (${topMargin}${bottomMargin}))"`,
      });
    }
  } else {
    let heightThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      "dimension.height",
      "size"
    );

    if (heightThmVariable.length > 0) {

      await stylePropsWithTheme(heightThmVariable, "dimension.height");
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
}

async function stylePropsDimenSionOverflow(
  styleJsonObject,
  styleDefaultJsonObject
) {
  const dimension = styleJsonObject?.dimension ?? "";
  const defaultDimension = styleDefaultJsonObject?.dimension ?? "";

  const withUnit = dimension?.width?.u ?? "";
  const heightUnit = dimension?.height?.u ?? "";

  //const overflowKey = dimension?.overflow ?? defaultDimension?.overflow ?? "";

    const overflowType =
      dimension?.overflow?.overflowType ??
      defaultDimension?.overflow?.overflowType ??
      "";

      let tailwaindResult = null;
        if (overflowType === "hidden") {
               
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.dimension?.overflow ?? "",
          "overflowType",
          `overflow:${overflowType};`
        );
      }else {
        if ( dimension?.overflow?.scroll?.scrollType === "overflow-xy") {
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.dimension?.overflow ?? "",
          "overflowType",
          `overflow:scroll;`
        );
      } else  if ( dimension?.overflow?.scroll?.scrollType === "overflow-x") {
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.dimension?.overflow?.scroll ?? "",
          "overflowX",
          `overflow-x:scroll;`
        );
      } else if (dimension?.overflow?.scroll?.scrollType === "overflow-y") {
        tailwaindResult = checkTailwaindKey(
          tailwaindJson?.dimension?.overflow?.scroll ?? "",
          "overflowY",
          `overflow-y:scroll;`
        );
      }
      }

     

      if (tailwaindResult !== null) {
        tailwaindClasses += `${tailwaindResult} `;
      }
    
  }


async function stylePropsSpacing(styleJsonObject, styleDefaultJsonObject, widgetId) {
  const spacing = styleJsonObject?.spacing ?? "";
  const defaultSpacing = styleDefaultJsonObject?.spacing ?? "";

  const padding = spacing?.padding ?? "";
  const defaultPadding = defaultSpacing?.padding ?? "";
  const margin = spacing?.margin ?? "";
  const defaultMargin = defaultSpacing?.margin ?? "";

  let paddingTopThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.padding.top",
    "size"
  );

  if (paddingTopThmVariable.length > 0) {
    await stylePropsWithTheme(paddingTopThmVariable, "spacing.padding.top");
  } else {
    await stylePropsCheckAuto(
      padding,
      defaultPadding,
      tailwaindJson?.spacing?.padding,
      "top",
      "top",
      "paddingTop"
    );
  }


  let paddingRightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.padding.right",
    "size"
  );

  if (paddingRightThmVariable.length > 0) {
    await stylePropsWithTheme(paddingRightThmVariable, "spacing.padding.right");
  } else {
    await stylePropsCheckAuto(
      padding,
      defaultPadding,
      tailwaindJson?.spacing?.padding,
      "right",
      "right",
      "paddingRight"
    );
  }

  let paddingBottomThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.padding.bottom",
    "size"
  );

  if (paddingBottomThmVariable.length > 0) {
    await stylePropsWithTheme(paddingBottomThmVariable, "spacing.padding.bottom");
  } else {
    await stylePropsCheckAuto(
      padding,
      defaultPadding,
      tailwaindJson?.spacing?.padding,
      "bottom",
      "bottom",
      "paddingBottom"
    );
  }

  let paddingLeftThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.padding.left",
    "size"
  );

  if (paddingLeftThmVariable.length > 0) {
    await stylePropsWithTheme(paddingLeftThmVariable, "spacing.padding.left");
  } else {
    await stylePropsCheckAuto(
      padding,
      defaultPadding,
      tailwaindJson?.spacing?.padding,
      "left",
      "left",
      "paddingLeft"
    );
  }

  let marginTopThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.margin.top",
    "size"
  );

  if (marginTopThmVariable.length > 0) {
    await stylePropsWithTheme(marginTopThmVariable, "spacing.margin.top");
  } else {
    await stylePropsCheckAuto(
      margin,
      defaultMargin,
      tailwaindJson?.spacing?.margin,
      "top",
      "top",
      "marginTop"
    );
  }

  let marginRightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.margin.right",
    "size"
  );

  if (marginRightThmVariable.length > 0) {
    await stylePropsWithTheme(marginRightThmVariable, "spacing.margin.right");
  } else {
    await stylePropsCheckAuto(
      margin,
      defaultMargin,
      tailwaindJson?.spacing?.margin,
      "right",
      "right",
      "marginRight"
    );
  }

  let marginBottomThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.margin.bottom",
    "size"
  );

  if (marginBottomThmVariable.length > 0) {
    await stylePropsWithTheme(marginBottomThmVariable, "spacing.margin.bottom");
  } else {
    await stylePropsCheckAuto(
      margin,
      defaultMargin,
      tailwaindJson?.spacing?.margin,
      "bottom",
      "bottom",
      "marginBottom"
    );
  }

  let marginLeftThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "spacing.margin.left",
    "size"
  );

  if (marginLeftThmVariable.length > 0) {
    await stylePropsWithTheme(marginLeftThmVariable, "spacing.margin.left");
  } else {
    await stylePropsCheckAuto(
      margin,
      defaultMargin,
      tailwaindJson?.spacing?.margin,
      "left",
      "left",
      "marginLeft"
    );
  }
}

async function stylePropsPosition(styleJsonObject, styleDefaultJsonObject, widgetId ) {
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


  let positionTopThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "position.positionValue.top",
    "size"
  );

  if (positionTopThmVariable.length > 0) {
    await stylePropsWithTheme(positionTopThmVariable, "position.positionValue.top");
  } else {
    await stylePropsCheckAuto(
      positionValue,
      defaultPositionValue,
      tailwaindJson?.position ?? "",
      "positionValue",
      "top",
      "positionedTop"
    );
  }

   let positionRightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "position.positionValue.right",
    "size"
  );

  if (positionRightThmVariable.length > 0) {
    await stylePropsWithTheme(positionRightThmVariable, "position.positionValue.right");
  } else {
  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "right",
    "positionedRight"
  );
  }

   let positionBottomThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "position.positionValue.bottom",
    "size"
  );

  if (positionBottomThmVariable.length > 0) {
    await stylePropsWithTheme(positionBottomThmVariable, "position.positionValue.bottom");
  } else {
  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "bottom",
    "positionedBottom"
  );
  }

   let positionLeftThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "position.positionValue.left",
    "size"
  );

  if (positionLeftThmVariable.length > 0) {
    await stylePropsWithTheme(positionLeftThmVariable, "position.positionValue.left");
  } else {
  await stylePropsCheckAuto(
    positionValue,
    defaultPositionValue,
    tailwaindJson?.position ?? "",
    "positionValue",
    "left",
    "positionedLeft"
  );
  }
}

async function stylePropsBackground(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetType,
  widgetId
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

  let backGroundColor;

  let backgroundColorThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "colorBackground.background.color.color",
    "color",
    false
  );

 // console.log('backgroundColorThmVariable', backgroundColorThmVariable)
  if (backgroundColorThmVariable.length > 0) {
    backGroundColor = `var(${backgroundColorThmVariable})`;
     valueProps.push({
        key: "bgColor",
        value: backGroundColor 
      });

  } else {
    backGroundColor=background?.solid?.color ?? ""
  }
  

  switch (backgroundType ) {
    case "solid": {
      valueProps.push({
        key: "bgColor",
        value: commonUtils.hexToRgba(backGroundColor) 
          
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
        key: "bgColor",
        value: `linear-gradient(${angle} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }

    case "radial": {
      const shape =
        background?.radialGradient?.shape ??
        defaultBackground?.radialGradient?.shape ??
        "";

      // const color1 = commonUtils.hexToRgba(
      //   background?.radialGradient?.colors?.[0]?.color ??
      //   defaultBackground?.radialGradient?.colors?.[0]?.color ??
      //   ""
      // );
      // const stop1 =
      //   background?.radialGradient?.colors?.[0]?.stop ??
      //   defaultBackground?.radialGradient?.colors?.[0]?.stop ??
      //   "";

      // const color2 = commonUtils.hexToRgba(
      //   background?.radialGradient?.colors?.[1]?.color ??
      //   defaultBackground?.radialGradient?.colors?.[1]?.color ??
      //   ""
      // );
      // const stop2 =
      //   background?.radialGradient?.colors?.[1]?.stop ??
      //   defaultBackground?.radialGradient?.colors?.[1]?.stop ??
      //   "";

      //multiple radial colors
      let colorsList = background?.radialGradient?.colors;
      if (
        !colorsList ||
        !Array.isArray(colorsList) ||
        colorsList.length === 0
      ) {
        colorsList = defaultBackground?.radialGradient?.colors;
      }

      const colorStops = (colorsList || [])
        .map((colorObj) => {
          const color = commonUtils.hexToRgba(colorObj?.color ?? "");
          const stop = colorObj?.stop ?? "";
          return `${color} ${stop}%`;
        })
        .join(", ");

      const size = await getValueWithUnit(
        background?.radialGradient?.size ?? "",
        defaultBackground?.radialGradient?.size ?? ""
      );
      let posX = await getValueWithUnit(
        background?.radialGradient?.position?.x ?? "",
        defaultBackground?.radialGradient?.position?.x ?? ""
      );
      let posY = await getValueWithUnit(
        background?.radialGradient?.position?.y ?? "",
        defaultBackground?.radialGradient?.position?.y ?? ""
      );
      // posY = posY ? `${posY},` : "";
      if (!posX) {
        posX = "center";
      }

      const position = posY ? `${posX} ${posY}` : `${posX}`;

      valueProps.push({
        key: "bgColor",
        value: `radial-gradient(${shape} ${size} at ${position}, ${colorStops})`,
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
          { key: "bgUrl", value: `${bgUrl}` },
          { key: "backgroundRepeat", value: backgroundRepeat },
          { key: "backgroundSize", value: backgroundSize },
          { key: "seoAlt", value: seoAlt },
          { key: "seoTitle", value: seoTitle }
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
            { key: "bgUrl", value: `${bgUrl}` },
            { key: "backgroundRepeat", value: backgroundRepeat },
            { key: "backgroundSize", value: backgroundSize },
            { key: "seoAlt", value: seoAlt },
            { key: "seoTitle", value: seoTitle }
          );
        } else if ((background?.solid?.color ?? "").length > 0) {

             let backGroundColor;

            let backgroundColorThmVariable = await commonUtils.themeVariable(
              commonUtils.projectId,
              commonUtils.pageId,
              widgetId,
              "colorBackground.background.color.color",
              "color",
              false
            );

            if (backgroundColorThmVariable.length > 0) {
              backGroundColor = `var(${backgroundColorThmVariable})`;
            } else {
              backGroundColor=background?.solid?.color ?? ""
            }

          valueProps.push({
            key: "bgColor",
            value: 
                  backgroundColorThmVariable.length>0 ? backGroundColor: commonUtils.hexToRgba(backGroundColor) 

             // commonUtils.hexToRgba(background?.solid?.color ?? "") ??
             // commonUtils.hexToRgba(defaultBackground?.solid?.color ?? ""),
          });
        } else {
        }
      } else if ((background?.solid?.color ?? "").length > 0) {

         let backGroundColor;

            let backgroundColorThmVariable = await commonUtils.themeVariable(
              commonUtils.projectId,
              commonUtils.pageId,
              widgetId,
              "colorBackground.background.color.color",
              "color",
              false
            );

            if (backgroundColorThmVariable.length > 0) {
              backGroundColor = `var(${backgroundColorThmVariable})`;
            } else {
              backGroundColor=background?.solid?.color ?? ""
            }

        valueProps.push({
          key: "bgColor",
          value: 
                   backgroundColorThmVariable.length>0 ? backGroundColor: commonUtils.hexToRgba(backGroundColor) 

           // commonUtils.hexToRgba(background?.solid?.color ?? "") ??
           // commonUtils.hexToRgba(defaultBackground?.solid?.color ?? ""),
        });
      } else {
      }
      break;
    }
  }
}

async function stylePropsBoxDecoration(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetId 
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

      let borderWidthThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.borderWidth.${dir}`,
      "size"
     );

    if (borderWidthThmVariable.length > 0) {
      await stylePropsWithTheme(borderWidthThmVariable, `boxDecoration.borderWidth.${dir}`);
    } else {
      await stylePropsCheckAuto(
        boxDecorationBorder?.borderWidth ?? "",
        defaultBoxDecorationBorder?.borderWidth ?? "",
        tailwaindJson?.boxDecoration?.borderWidth,
        dir,
        dir,
        `border${dir[0].toUpperCase()}W`
      );
    }
  }

  // Border Color
  for (const dir of ["top", "right", "bottom", "left"]) {
     let borderColorThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.borderColor.${dir}`,
      "color",
      false
     );

    if (borderColorThmVariable.length > 0) {
      await stylePropsWithTheme(borderColorThmVariable, `boxDecoration.borderColor.${dir}`);
    } else {      
       await stylePropsForColor(
     // boxDecorationBorder?.borderColor ?? "",
     // defaultBoxDecorationBorder?.borderColor ?? "",
       await commonUtils.ensureHash(boxDecorationBorder?.borderColor ?? ""),
       await commonUtils.ensureHash(defaultBoxDecorationBorder?.borderColor ?? ""),
      tailwaindJson?.boxDecoration?.borderColor,
      dir,
      dir,
      `border${dir[0].toUpperCase()}C`
    );
    }
  }

  // Border Radius
  const radiusMap = {
    topRight: "borderTRR",
    topLeft: "borderTLR",
    bottomLeft: "borderBLR",
    bottomRight: "borderBRR",
  };

  for (const key in radiusMap) {

      let borderRadiusThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.borderRadius.${key}`,
      "size"
     );

    if (borderRadiusThmVariable.length > 0) {
      await stylePropsWithTheme(borderRadiusThmVariable, `boxDecoration.borderRadius.${key}`);
    } else {
      await stylePropsCheckAuto(
        boxDecorationBorder?.borderRadius ?? "",
        defaultBoxDecorationBorder?.borderRadius ?? "",
        tailwaindJson?.boxDecoration?.borderRadius,
        key,
        key,
        radiusMap[key]
      );
  }
  }

  // Box Shadow
  const boxDecorationBoxShadow = boxDecoration?.boxShadow ?? "";
  const defaultBoxDecorationBoxShadow = defaultBoxDecoration?.boxShadow ?? "";

  //const offsetX = "var(--offSet-x)";
  let offsetX;

   let offsetXThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.boxShadow.offsetX`,
      "size"
     );

    if (offsetXThmVariable.length > 0) {
      offsetX = `var(${offsetXThmVariable})`;

    } else {
        offsetX = await getValueWithUnit(
          boxDecorationBoxShadow?.offsetX ?? "",
          defaultBoxDecorationBoxShadow?.offsetX ?? ""
        );
    }

   let offsetY;

   let offsetYThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.boxShadow.offsetY`,
      "size"
     );

    if (offsetYThmVariable.length > 0) {
      offsetY = `var(${offsetYThmVariable})`;

    } else {
       offsetY = await getValueWithUnit(
        boxDecorationBoxShadow?.offsetY ?? "",
        defaultBoxDecorationBoxShadow?.offsetY ?? ""
      );
  }

   let blurRadius;

   let blurRadiusThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.boxShadow.blurRadius`,
      "size"
     );

    if (blurRadiusThmVariable.length > 0) {
      blurRadius = `var(${blurRadiusThmVariable})`;

    } else {
       blurRadius = await getValueWithUnit(
        boxDecorationBoxShadow?.blurRadius ?? "",
        defaultBoxDecorationBoxShadow?.blurRadius ?? ""
      );
  }

  let spreadRadius;

   let spreadRadiusThmVariable = await commonUtils.themeVariable(
      commonUtils.projectId,
      commonUtils.pageId,
      widgetId,
      `boxDecoration.boxShadow.spreadRadius`,
      "size"
     );

    if (spreadRadiusThmVariable.length > 0) {
      spreadRadius = `var(${spreadRadiusThmVariable})`;

    } else {
       spreadRadius = await getValueWithUnit(
        boxDecorationBoxShadow?.spreadRadius ?? "",
        defaultBoxDecorationBoxShadow?.spreadRadius ?? ""
      );
  }
  const color = commonUtils.hexToRgba(
    boxDecorationBoxShadow?.color ?? defaultBoxDecorationBoxShadow?.color ?? ""
  );

  const shadowValue = `${offsetX ?? ""} ${offsetY ?? ""} ${blurRadius ?? ""} ${spreadRadius ?? ""
    } ${color ?? ""}`;
  valueProps.push({ key: "boxShadow", value: shadowValue });
}

async function stylePropStypography(
  styleJsonObject,
  styleDefaultJsonObject,
  widgetId
) {
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

  PropsAndStateVariablesFromWidget= await reactJsMapper.getPropsAndStateVariablesFromWidget( commonUtils?.projectId,commonUtils?.pageId,widgetId);
  const {variableName, state}= await findStateVariable('typography.text.content', PropsAndStateVariablesFromWidget )
  if(variableName=='')
  {
      valueProps.push({
        key: "headerText",
        value: text?.value ?? "",
      });
  }else if(variableName && state=='pageState') {
     valueProps.push({
        key: "headerText1",
        value: variableName
      });
  }else if(variableName && state=='appState') {
     valueProps.push({
        key: "headerText1",
        value: `\get('${variableName}')`
      });
  }
  

    let fontFamilyThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.fontFamily",
    "fontfamily"
  );

  if (fontFamilyThmVariable.length > 0) {
    await stylePropsWithTheme(fontFamilyThmVariable, "typography.text.fontFamily");
  } else {
    await stylePropsCheckTailwaindClass(
      text,
      defaultText,
      tailwaindJson.typography.text,
      "fontFamily",
      "fontFamily",
      "fontFamily"
    );
  }

  let thmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.fontSize",
    "size"
  );

  if (thmVariable.length > 0) {
    await stylePropsWithTheme(thmVariable, "typography.text.fontSize");
  } else {
    await stylePropsCheckAuto(
      text,
      defaultText,
      tailwaindJson.typography.text,
      "fontSize",
      "fontSize",
      "fontSize"
    );
  }

   let fontWeightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.fontWeight",
    "size"
  );

  if (fontWeightThmVariable.length > 0) {
    await stylePropsWithTheme(fontWeightThmVariable, "typography.text.fontWeight");
  } else {
    await stylePropsCheckTailwaindClass(
      text,
      defaultText,
      tailwaindJson.typography.text,
      "fontWeight",
      "fontWeight",
      "fontWeight"
    );
  }

   let textColorThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.textColor",
    "color",
    false
  );

  if (textColorThmVariable.length > 0) {
    await stylePropsWithTheme(textColorThmVariable, "typography.text.textColor");
  } else {
  await stylePropsColor(
    text?.foreground ?? "",
    defaultText?.foreground ?? "",
    tailwaindJson.typography.text,
    "textColor",
    "foreground"
    );
  }

  await stylePropsCheckTailwaindClass(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "textAlign",
    "textAlign",
    "textAlign"
  );

   let lineHeightThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.lineHeight",
    "size"
  );

  if (lineHeightThmVariable.length > 0) {
    await stylePropsWithTheme(lineHeightThmVariable, "typography.text.lineHeight");
  } else {
  await stylePropsCheckTailwaindClass(
    text?.lineHeight ?? "",
    defaultText?.lineHeight ?? "",
    tailwaindJson.typography.text,
    "lineHeight",
    "v",
    "v"
  );
  }


   let letterSpacingThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.letterSpacing",
    "size"
  );

  if (letterSpacingThmVariable.length > 0) {
    await stylePropsWithTheme(letterSpacingThmVariable, "typography.text.letterSpacing");
  } else {
  await stylePropsCheckAuto(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "letterSpacing",
    "letterSpacing",
    "letterSpacing"
  );
  }


  await stylePropsCheckAuto(
    text,
    defaultText,
    tailwaindJson.typography.text,
    "wordSpacing",
    "wordSpacing",
    "wordSpacing"
  );

  // if(tailwaindJson?.typography?.text)
  // {
  //     await stylePropsCheckTailwaindClass(
  //       textDecoration,
  //       defaultTextDecoration,
  //       tailwaindJson.typography.text,
  //       "style",
  //       "style",
  //       "style"
  //     );
  // }
  

  let lineString = (textDecoration?.line ?? [])
    .map((v) => (v === "Linethrough" ? "line-through" : v))
    .join(" ");

  valueProps.push({
    key: "textDecorationLine",
    value: lineString,
  });

  if(tailwaindJson?.typography?.text?.textDecoration)
  {
       await stylePropsCheckTailwaindClass(
        textDecoration,
        defaultTextDecoration,
        tailwaindJson.typography.text.textDecoration,
        "style",
        "style",
        "style"
      );
  }
 

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


   let strokeWidthThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.textDecoration.strokeWidth",
    "size"
  );

  if (strokeWidthThmVariable.length > 0) {
    await stylePropsWithTheme(strokeWidthThmVariable, "typography.text.textDecoration.strokeWidth");
  } else {
       await stylePropsCheckAuto(
        textDecoration,
        defaultTextDecoration,
        tailwaindJson.typography.text.textDecoration,
        "strokeWidth",
        "strokeWidth",
        "strokeWidth"
      );
  }

 
 let strokeColorThmVariable = await commonUtils.themeVariable(
    commonUtils.projectId,
    commonUtils.pageId,
    widgetId,
    "typography.text.textDecoration.strokeColor",
    "color",
    false
  );

  if (strokeColorThmVariable.length > 0) {
    await stylePropsWithTheme(strokeColorThmVariable, "typography.text.textDecoration.strokeColor");
  } else {
    await stylePropsCheckTailwaindClass(
      textDecoration,
      defaultTextDecoration,
      tailwaindJson.typography.text.textDecoration,
      "strokeColor",
      "strokeColor",
      "strokeColor",
      commonUtils.removeTransparencyFromHexCode(textDecoration?.strokeColor ?? "")
    );
  }
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
      key: "textShadow",
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
        key: propsKey,
        value: `linear-gradient(${angleStr} ${color1} ${stop1}%, ${color2} ${stop2}%)`,
      });
      break;
    }

    case "radial": {
      const shape =
        styleJsonObject?.radialGradient?.shape ??
        styleDefaultJsonObject?.radialGradient?.shape ??
        "";

      let colorsList = styleJsonObject?.radialGradient?.colors;
      if (
        !colorsList ||
        !Array.isArray(colorsList) ||
        colorsList.length === 0
      ) {
        colorsList = styleDefaultJsonObject?.radialGradient?.colors;
      }

      const colorStops = (colorsList || [])
        .map((colorObj) => {
          const color = commonUtils.hexToRgba(colorObj?.color ?? "");
          const stop = colorObj?.stop ?? "";
          return `${color} ${stop}%`;
        })
        .join(", ");

      const size = await getValueWithUnit(
        //changes
        styleJsonObject?.radialGradient?.size ?? "",
        styleDefaultJsonObject?.radialGradient?.size ?? ""
      );
      //changes
      let posX = await getValueWithUnit(
        styleJsonObject?.radialGradient?.position?.x ?? "",
        styleDefaultJsonObject?.radialGradient?.position?.x ?? ""
      );
      let posY = await getValueWithUnit(
        //changes
        styleJsonObject?.radialGradient?.position?.y ?? "",
        styleDefaultJsonObject?.radialGradient?.position?.y ?? ""
      );
      //changes

      if (!posX) {
        posX = "center";
      }

      const position = posY ? `${posX} ${posY}` : `${posX}`;

      valueProps.push({
        key: propsKey,
        //changes
        value: `radial-gradient(${shape} ${size} at ${position}, ${colorStops})`,
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
          { key: "bgUrl", value: bgUrl },
          { key: "backgroundRepeat", value: backgroundRepeat },
          { key: "backgroundSize", value: backgroundSize },
          { key: "seoAlt", value: seoAlt },
          { key: "seoTitle", value: seoTitle }
        );
      }

      break;
    }

    default: {
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
            { key: "bgUrl", value: bgUrl },
            { key: "backgroundRepeat", value: backgroundRepeat },
            { key: "backgroundSize", value: backgroundSize },
            { key: "seoAlt", value: seoAlt },
            { key: "seoTitle", value: seoTitle }
          );
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
      key: propsKey,
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
      key: propsKey,
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
    //console.log('tailwaindResult', valueWithUnit)

  if (tailwaindResult) {
    if (tailwaindResult.includes("{v}{u}")) {
      tailwaindClasses +=
        tailwaindResult.replace("{v}{u}", valueWithUnit) + " ";
    } else {
      tailwaindClasses += tailwaindResult + " ";
    }
  } else {
    valueProps.push({
      key: propsKey,
      value: valueWithUnit,
    });
  }
}

async function getValueWithUnit(propsJson, propsDefaultJson) {
  let v = propsJson?.v ?? propsDefaultJson?.v ?? "";
  const u = propsJson?.u ?? propsDefaultJson?.u ?? "";

  if (!v && u !== "auto") return "";

  if (u === "auto") {
    return "auto";
  }

  // Convert v to number to remove trailing .00 or zeros
  if (!isNaN(v) && v !== "") {
    v = Number(v);
  }

  return `${v}${u}`;
}


// async function getValueWithUnit(propsJson, propsDefaultJson) {
//   const v = propsJson?.v ?? propsDefaultJson?.v ?? "";
//   const u = propsJson?.u ?? propsDefaultJson?.u ?? "";

//   if (!v && u !== "auto") return ""; // no value means nothing to compute

//   if (u === "auto") {
//     return "auto";
//   }

//   return `${v}${u}`;
// }

const checkTailwaindKey = (mapper, category, key) => {
  return mapper?.[category]?.[key] ?? null;
};

async function stylePropsWithTheme(themeVariable, key) {
  let value = commonUtils.getNestedValue(cssThemeMapperJson, key);
  if (value !== undefined && value !== null) {
    let themeClass = String(value).replace("variableName", themeVariable);
    tailwaindClasses += themeClass + " ";
  }
}

function getTailwaindClasses() {
  return tailwaindClasses;
}

async function getStyleProps() {
  return valueProps;
}

async function findStateVariable(propKey, list) {
  const item = list.find(obj => obj.prop === propKey);

  if (!item) {
    return { variableName: "", state: "" }; // not found
  }

  if (item.stateVariableName && item.stateVariableName.trim() !== "") {
    return { variableName: item.stateVariableName, state: "pageState" };
  }

  if (item.appStateVariableName && item.appStateVariableName.trim() !== "") {
    return { variableName: item.appStateVariableName, state: "appState" };
  }

  return { variableName: "", state: "" };
}


module.exports = {
  valueProps,
  tailwaindClasses,
  styleProps,
  getStyleProps,
  getTailwaindClasses,
};

