import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../../utils/helper";
import { runDynamicAnimations } from "../../../utils/animationUtils";

const QTablePaginationRPP = ({
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
  overflow = "",

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
  zIndex,
}) => {
  const tablePaginationRPPRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Observer for when paragraph enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true); // Prevents the animation from running again
        }
      },
      { threshold: 0.2 }
    );

    if (tablePaginationRPPRef.current) {
      observer.observe(tablePaginationRPPRef.current);
    }

    return () => {
      if (tablePaginationRPPRef.current) {
        observer.unobserve(tablePaginationRPPRef.current);
      }
    };
  }, [hasAnimated, isVisible]);

  useEffect(() => {
    if (isAnimationP === "true") {
      runDynamicAnimations({
        ref: tablePaginationRPPRef,
        isVisible,
        isAnimationP,
        animationType,
        animationDirection,
        animationEasing,
        animationIterations,
        animationDelay,
        isRevarsed,
        animationDuration,
      });
    }
  }, [isVisible]);

  const handleClick = () => {
    if (onClick === "Yes") {
      switch (action) {
        case "Navigate to":
          navigate(`/${navigation}`);
          break;
      }
    }
  };

  // Inline styles for the div container
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
    }),

    display: "flex",
    flexDirection: "row",
    // justifyContent: 'center',
    // alignItems: 'center',
  };

  return (
    <div
      ref={tablePaginationRPPRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

// PropTypes for validation
QTablePaginationRPP.propTypes = {
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

export default QTablePaginationRPP;
QTablePaginationRPP.displayName = "QTablePaginationRPP";
