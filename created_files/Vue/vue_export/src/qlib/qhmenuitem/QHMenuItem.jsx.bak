import React from "react";
import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

const QHMenuItem = ({
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
  onMouseEnter,
  onMouseLeave,
  tailwaindClasses,
  backgroundSize,
  boxShadow,
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

  // Replace "align_center" with "center" for mainAlignment
  const computeMainAlignment = (value) => {
    switch (value) {
      case "align_center":
        return "center";
      case "space_between":
        return "space-between";
      case "align_start":
        return "flex-start";
      case "align_end":
        return "flex-end";
      case "space_evenly":
        return "space-evenly";
      case "align_right":
        return "flex-end";
      case "align_left":
        return "flex-left";
      default:
        return value; // Return the original value if no case matches
    }
  };



  const ensurePx = (value) =>
    value && typeof value === "string" && value.includes("px")
      ? value
      : `${value}px`;
  // Handle bgColor as solid, linear, or radial gradient
  let effectiveBgColor = "transparent";
  let effectiveBgImage = "";
  if (bgColor) {
    if (bgColor.trim().startsWith("linear-gradient(") || bgColor.trim().startsWith("radial-gradient(")) {
      effectiveBgImage = bgColor;
      effectiveBgColor = "transparent";
    } else {
      effectiveBgColor = bgColor;
    }
  }

  // Handle background image URL
  if (bgUrl && bgUrl !== "undefined" && bgUrl !== undefined) {
    const imgUrl = `url(${bgUrl})`;
    effectiveBgImage = effectiveBgImage ? `${imgUrl}, ${effectiveBgImage}` : imgUrl;
  }
  // Inline styles for the div container
  const containerStyle = {
    width: (tailwaindClasses?.includes("w-[auto]") ?? false) ? "100%" : `${width}`,
    height: `${height}`,
    position: isAbsoluteValue === "true" ? "absolute" : "relative",
    // backgroundColor: bgColor,
    // backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,
    backgroundSize: isImageFill ? "cover" : "contain",
    display: "flex",
    flexDirection: "column",
    cursor: onClick === "Yes" ? "pointer" : "default",
   // padding:'8px'
  }

  return (
    <div
      className={`${tailwaindClasses}`}
      onMouseEnter={onMouseEnter} // Prevent closing when hovering
      onMouseLeave={onMouseLeave} // Only close when fully outside
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

// PropTypes for validation
QHMenuItem.propTypes = {
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

export default QHMenuItem;
QHMenuItem.displayName = "QHMenuItem";
