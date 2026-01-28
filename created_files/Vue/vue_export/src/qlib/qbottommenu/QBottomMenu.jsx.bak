import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QBottomMenu = ({
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
  const menuRef = useRef(null);
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

    if (menuRef.current) observer.observe(menuRef.current);
    return () => menuRef.current && observer.unobserve(menuRef.current);
  }, [hasAnimated]);

  useEffect(() => {
    if (isAnimationP === "true" && isVisible) {
      runDynamicAnimations({
        ref: menuRef,
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

  const containerStyle = {
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
          textShadow,
        }).filter(([, val]) => val !== undefined && val !== null && val !== "")
      )
    ),
    // display: "flex",
    // flexDirection: "row",
    // position: "fixed",
    zIndex: 99999,
  };

  return (
    <div
      ref={menuRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
     // style={containerStyle}
       style={{
          ...containerStyle,
          ...style
        }}
      className={tailwaindClasses || ""}
    >
      {children}
    </div>
  );
};

// ✅ PropTypes applied only for used props
QBottomMenu.propTypes = {
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
  textShadow: PropTypes.string,
};

export default QBottomMenu;
QBottomMenu.displayName = "QBottomMenu";
