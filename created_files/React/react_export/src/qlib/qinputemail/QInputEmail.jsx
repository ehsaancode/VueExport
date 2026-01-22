import React, { useState } from "react";
import PropTypes from "prop-types";

const QInputEmail = ({
  width,
  height,
  padding,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  margin,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  positionedLeft,
  positionedTop,
  positionedRight,
  positionedBottom,
  color,
  bgColor,
  borderRadius,
  borderColor,
  borderWidth,
  bgUrl,
  isImageFill,
  widthType,
  heightType,
  children,
  widthPercent,
  heightPercent,
  alignment,
  mainAlignment,
  crossAlignment,
  borderTLR,
  borderTRR,
  borderBLR,
  borderBRR,
  borderTW,
  borderTC,
  borderBW,
  borderBC,
  borderLW,
  borderLC,
  borderRW,
  borderRC,
  shadowSpreadRadius,
  shadowBlurRadius,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor,
  isAbsoluteValue,
  headerText = '',
  fontSize,
  fontFamily
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Default border values
  const defaultBorderWidth = "1px";
  const defaultBorderColor = "rgb(153, 147, 147)";

  const finalBorderTW = borderTW || defaultBorderWidth;
  const finalBorderTC = borderTC || defaultBorderColor;
  const finalBorderBW = borderBW || defaultBorderWidth;
  const finalBorderBC = borderBC || defaultBorderColor;
  const finalBorderLW = borderLW || defaultBorderWidth;
  const finalBorderLC = borderLC || defaultBorderColor;
  const finalBorderRW = borderRW || defaultBorderWidth;
  const finalBorderRC = borderRC || defaultBorderColor;

  // Ensure value has px
  const ensurePx = (value) =>
    value && typeof value === "string" && value.includes("px") ? value : `${value}px`;

  const computedWidth = width;
  const computedHeight = height;

  const containerStyle = {
    width: `${computedWidth}`,
    height: `${computedHeight}`,
    position: isAbsoluteValue === 'true' ? 'absolute' : '',
    left: positionedLeft != null && isAbsoluteValue === 'true' ? ensurePx(positionedLeft) : "auto",
    top: positionedTop != null && isAbsoluteValue === 'true' ? ensurePx(positionedTop) : "auto",
    right: positionedRight != null && isAbsoluteValue === 'true' ? ensurePx(positionedRight) : "auto",
    bottom: positionedBottom != null && isAbsoluteValue === 'true' ? ensurePx(positionedBottom) : "auto",

    ...(paddingTop && { paddingTop }),
    ...(paddingRight && { paddingRight }),
    ...(paddingBottom && { paddingBottom }),
    ...(paddingLeft && { paddingLeft }),

    ...(marginLeft && { marginLeft }),
    ...(marginTop && { marginTop }),
    ...(marginRight && { marginRight }),
    ...(marginBottom && { marginBottom }),

    //margin: '5px',

    color,
    backgroundColor: isHovered ? '#f2f2f2' : bgColor || 'transparent',
    ...(bgUrl && bgUrl !== "undefined" && bgUrl !== undefined && {
      backgroundImage: `url(${bgUrl})`,
    }),

    // Apply corner radius - fallback to borderRadius if none specified
    ...(borderTLR !== undefined || borderTRR !== undefined || borderBLR !== undefined || borderBRR !== undefined
      ? {
          ...(borderTLR !== undefined && { borderTopLeftRadius: `${borderTLR}px` }),
          ...(borderTRR !== undefined && { borderTopRightRadius: `${borderTRR}px` }),
          ...(borderBLR !== undefined && { borderBottomLeftRadius: `${borderBLR}px` }),
          ...(borderBRR !== undefined && { borderBottomRightRadius: `${borderBRR}px` }),
        }
      : { borderRadius }),

    // Always apply individual borders with defaults
    borderTop: `${finalBorderTW} solid ${finalBorderTC}`,
    borderBottom: `${finalBorderBW} solid ${finalBorderBC}`,
    borderLeft: `${finalBorderLW} solid ${finalBorderLC}`,
    borderRight: `${finalBorderRW} solid ${finalBorderRC}`,

    boxShadow: `${shadowOffsetX || '0px'} ${shadowOffsetY || '0px'} ${shadowBlurRadius || '0px'} ${shadowSpreadRadius || '0px'} ${shadowColor || 'transparent'}`,
    // paddingLeft: '10px'
    fontSize: fontSize,
    fontFamily: fontFamily != null && fontFamily !== "" && fontFamily!=='undefined' ? fontFamily : "unset",

  };

  // Format placeholder text
  const formattedHeaderText = headerText
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <input
      placeholder={formattedHeaderText}
      type="email"
      required={true}

      name={headerText}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

// PropTypes for validation
QInputEmail.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.string,
  paddingLeft: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingRight: PropTypes.string,
  paddingBottom: PropTypes.string,
  margin: PropTypes.string,
  marginLeft: PropTypes.string,
  marginTop: PropTypes.string,
  marginRight: PropTypes.string,
  marginBottom: PropTypes.string,
  positionedLeft: PropTypes.string,
  positionedTop: PropTypes.string,
  positionedRight: PropTypes.string,
  positionedBottom: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  shadowBlurRadius: PropTypes.string,
  shadowColor: PropTypes.string,
  shadowOffsetX: PropTypes.string,
  shadowOffsetY: PropTypes.string,
  shadowSpreadRadius: PropTypes.string,
  mainAlignment: PropTypes.string,
  crossAlignment: PropTypes.string,
  widthType: PropTypes.string,
  heightType: PropTypes.string,
  children: PropTypes.node,
  headerText: PropTypes.string,
  fontSize: PropTypes.string,
  borderTLR: PropTypes.string,
  borderTRR: PropTypes.string,
  borderBLR: PropTypes.string,
  borderBRR: PropTypes.string,
  borderTW: PropTypes.string,
  borderTC: PropTypes.string,
  borderBW: PropTypes.string,
  borderBC: PropTypes.string,
  borderLW: PropTypes.string,
  borderLC: PropTypes.string,
  borderRW: PropTypes.string,
  borderRC: PropTypes.string,
  isAbsoluteValue: PropTypes.string,
};

export default QInputEmail;
QInputEmail.displayName = 'QInputEmail';
