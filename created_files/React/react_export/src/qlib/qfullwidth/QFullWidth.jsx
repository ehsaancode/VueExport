import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QFullWidth = ({
  width,
  height,
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
  maxValue,
  minValue,
  midValue,

  zIndex,
  tailwaindClasses,
  backgroundSize,
  boxShadow,
  textShadow,
  style
}) => {
  const fullWidthRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Intersection Observer for animation visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.2 }
    );

    if (fullWidthRef.current) observer.observe(fullWidthRef.current);
    return () => fullWidthRef.current && observer.unobserve(fullWidthRef.current);
  }, [hasAnimated]);

  // Run animation when visible
  useEffect(() => {
    if (isAnimationP === "true" && isVisible) {
      runDynamicAnimations({
        ref: fullWidthRef,
        isVisible,
        isAnimationP,
        animationType,
        animationDirection,
        animationEasing,
        animationIterations,
        animationDelay,
        animationDuration,
        isRevarsed,
        maxValue,
        minValue,
        midValue,
      });
    }
  }, [isVisible]);

  // Handle click navigation
  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to" && navigation) {
      navigate(`/${navigation}`);
    }
  };

  // Style using only valid props
  const styles = {
    ...generateStyle(
      Object.fromEntries(
        Object.entries({
          width,
          height,
          isAbsoluteValue,
          bgColor,
          bgUrl,
          isImageFill,
          zIndex,
          backgroundSize,
          boxShadow,
          textShadow
        }).filter(([, val]) => val !== undefined && val !== null && val !== "")
      )
    ),
    // display: "flex",
    // flexDirection: "row",
    
    // ...(isAnimationP === "true" && !hasAnimated && { opacity: 0 }),
    ...(isAnimationP === "true" && animationType?.toLowerCase() !== "none" && !hasAnimated && { opacity: 0 }),
  };

  return (
    <div
      ref={fullWidthRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
      className={`${tailwaindClasses || ""}`}
     // style={styles}
       style={{
          ...styles,
          ...style
        }}
    >
      {children}
    </div>
  );
};


QFullWidth.propTypes = {
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  children: PropTypes.node,
  isAbsoluteValue: PropTypes.bool,
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  isAnimationP: PropTypes.string,
  animationEasing: PropTypes.string,
  animationDirection: PropTypes.string,
  animationType: PropTypes.string,
  animationIterations: PropTypes.string,
  animationDelay: PropTypes.string,
  animationDuration: PropTypes.string,
  animationCurve: PropTypes.string,
  animationTargetPosition: PropTypes.string,
  isRevarsed: PropTypes.string,
  zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tailwaindClasses: PropTypes.string,
  backgroundSize: PropTypes.string,
  boxShadow: PropTypes.string,
};


export default QFullWidth;
QFullWidth.displayName = "QFullWidth";
