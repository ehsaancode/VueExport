import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QRow = ({
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

  zIndex,
  tailwaindClasses,
  backgroundSize,
  boxShadow,
  textShadow,
  style
}) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

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

    if (rowRef.current) observer.observe(rowRef.current);
    return () => rowRef.current && observer.unobserve(rowRef.current);
  }, [hasAnimated]);

  useEffect(() => {
    if (isAnimationP === "true" && isVisible) {
      runDynamicAnimations({
        ref: rowRef,
        isVisible,
        isAnimationP,
        animationType,
        animationDirection,
        animationEasing,
        animationIterations,
        animationDelay,
        animationDuration,
        isRevarsed,
      });
    }
  }, [isVisible]);

  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to" && navigation) {
      navigate(`/${navigation}`);
    }
  };

  const rowStyle = {
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
  };

  return (
    <div
      ref={rowRef}
      className={tailwaindClasses || ""}
      style={{...rowStyle, ...style}}
      onClick={onClick === "Yes" ? handleClick : undefined}
    >
      {children}
    </div>
  );
};

// ✅ PropTypes for only used props
QRow.propTypes = {
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

export default QRow;
QRow.displayName = "QRow";
