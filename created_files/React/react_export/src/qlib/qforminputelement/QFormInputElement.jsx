import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QFormInputElement = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  isImageFill,
  children,
  isAbsoluteValue,
  onClick = "",
  action = "",
  navigation = "",

  // Animation Props
  isAnimationP,
  animationEasing,
  animationDirection,
  animationType = "",
  animationIterations,
  animationDelay,
  animationDuration,
  animationCurve,
  animationTargetPosition,
  isRevarsed,

  overflow = "",
  zIndex,
  tailwaindClasses
}) => {
  const FormInputElemetRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick === "Yes") {
      switch (action) {
        case "Navigate to":
          navigate(`/${navigation}`);
          break;
      }
    }
  }; // Utility function to properly format dimensions

  // Inline styles for the div container
  const containerStyle = {
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      bgColor,
      bgUrl,
      isImageFill,
      overflow,
      onClick,
      zIndex,
    }),
  
  };

  return (
    <div
      className={` ${tailwaindClasses || ""}`}
      ref={FormInputElemetRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

// PropTypes for validation
QFormInputElement.propTypes = {
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

export default QFormInputElement;
QFormInputElement.displayName = "QFormInputElement";
