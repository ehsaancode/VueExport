import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const QHeaderBar = ({
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
  boxShadow,
  foreground,
  tailwaindClasses

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
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleScroll = () => {
      if (headerRef.current && placeholderRef.current) {
        const placeholderTop =
          placeholderRef.current.getBoundingClientRect().top;
        setIsSticky(placeholderTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const containerStyle = {
     width:width,
     height:height,
  //  position: isSticky ? "fixed" : isAbsoluteValue === "true" ? "absolute" : "",
    top: isSticky
      ? "0px"
      : positionedTop != null && isAbsoluteValue === "true"
      ? ensurePx(positionedTop)
      : "auto",
    left:
      positionedLeft != null && isAbsoluteValue === "true"
        ? ensurePx(positionedLeft)
        : "auto",
    right:
      positionedRight != null && isAbsoluteValue === "true"
        ? ensurePx(positionedRight)
        : "auto",
    bottom:
      positionedBottom != null && isAbsoluteValue === "true"
        ? ensurePx(positionedBottom)
        : "auto",
    color,
    // backgroundColor: bgColor,
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,
    boxShadow: boxShadow,
    // ...(bgUrl &&
    //   bgUrl !== "undefined" &&
    //   bgUrl !== undefined && {
    //     backgroundImage: `url(${bgUrl})`,
    //   }),
    zIndex: 50,
    display: "flex",
    flexDirection: crossAlignment === "align_center" ? "row" : "column",
    cursor: onClick === "Yes" ? "pointer" : "",
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
  };

  return (
    <>
      <div ref={placeholderRef}></div>
      <div
        ref={headerRef}
        onClick={onClick === "Yes" ? handleClick : undefined}
        className={`${tailwaindClasses}`}
        style={containerStyle}
      >
        {children}
      </div>
    </>
  );
};

// PropTypes for validation
QHeaderBar.propTypes = {
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

export default QHeaderBar;
QHeaderBar.displayName = "QHeaderBar";
