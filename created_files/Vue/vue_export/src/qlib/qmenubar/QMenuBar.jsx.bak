import { React, useRef } from "react";

import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

const QMenuBar = ({
  setOpenMenus,
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
  tailwaindClasses,
  boxShadow,
  foreground,
}) => {
  const timeoutRef = useRef(null); // Store timeout reference

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
    width: width,
    height: height,
    position: isAbsoluteValue === "true" ? "absolute" : "relative",
    color: color,
    
    // background: bgColor,
    // backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,

    backgroundSize: isImageFill ? "cover" : "contain",
    display: "flex",
    flexDirection: "row",
    cursor: onClick === "Yes" ? "pointer" : "default",
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
    boxShadow: boxShadow,
  };

  return (
    <div
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => {
          setOpenMenus?.({});
        }, 200); // Delayed menu close (1 sec)
      }}
      onMouseEnter={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // Prevent closing if hovered back
        }
      }}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
      className={`${tailwaindClasses}`}
    >
      {children}
    </div>
  );
};

// PropTypes for validation
QMenuBar.propTypes = {
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

export default QMenuBar;
QMenuBar.displayName = "QMenuBar";
