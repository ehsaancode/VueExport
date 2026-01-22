import React from "react";
import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QWrap = ({
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
  onClick = "",
  action = "",
  navigation = "",

  // ✅ Added to fix no-undef errors
  overflow,
  zIndex,
  fontSize,
  fontWeight,
  textAlign,
  fontFamily,
  fontStyle,
  imageFit,
  decoration,
  textDirection,
  tailwaindClasses,
  boxShadow,
  foreground,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick === "Yes") {
      switch (action) {
        case "Navigate to":
          navigate(`/${navigation}`);
          break;
      }
    }
  };

  const containerStyle = {
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      positionedLeft,
      positionedTop,
      positionedRight,
      positionedBottom,
      bgColor,
      bgUrl,
      isImageFill,
      color,
      borderRadius,
      borderTLR,
      borderTRR,
      borderBLR,
      borderBRR,
      borderWidth,
      borderColor,
      borderTW,
      borderBW,
      borderLW,
      borderRW,
      borderTC,
      borderBC,
      borderLC,
      borderRC,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlurRadius,
      shadowSpreadRadius,
      shadowColor,
      overflow,
      mainAlignment,
      crossAlignment,
      onClick,
      zIndex,
      fontSize,
      fontWeight,
      textAlign,
      fontFamily,
      fontStyle,
      imageFit,
      decoration,
      boxShadow,
    }),
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
    display: "flex",
    flexWrap: "wrap",
    textTransform: "uppercase",
  };

  return (
    <div
      className={`${tailwaindClasses}`}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

// PropTypes for validation
QWrap.propTypes = {
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
};

export default QWrap;
QWrap.displayName = "QWrap";
