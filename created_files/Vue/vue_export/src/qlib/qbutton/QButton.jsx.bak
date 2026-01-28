import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { runDynamicAnimations } from "../../utils/animationUtils";
import { extractFontFamily } from "../../utils/helper";

const QButton = ({
  width,
  height,
  design,
  bgColor,
  headerText,
  style ,
  isLoading = false,
  iconLeft = null,
  iconRight = null,
  onPressed,
  onHover,
  onFocusChange,
  onLongPress,
  isAbsoluteValue,

  onClick = "",
  action = "",
  navigation = "",
  buttonType,

  // Animation Props
  maxValue,
  minValue,
  isAnimationP,
  animationEasing,
  animationDirection,
  animationType,
  animationIterations,
  animationDelay,
  animationDuration,
  animationCurve,
  animationTargetPosition,
  isRevarsed,
    flexWrap,
  tailwaindClasses,
  boxShadow,
  foreground,
  textShadow,
  
}) => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [animationName, setAnimationName] = useState("");
  const animationNameRef = useRef("");
  const animationCountRef = useRef(0);

  const [hasAnimated, setHasAnimated] = useState(false);
  const font = extractFontFamily(tailwaindClasses);

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

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, [isVisible, hasAnimated]);

  useEffect(() => {
    if (isAnimationP === "true") {
      runDynamicAnimations({
        ref: buttonRef,
        isVisible,
        isAnimationP,
        animationType,
        animationDirection,
        animationEasing,
        animationIterations,
        animationDelay,
        isRevarsed,
        animationDuration,
        maxValue,
        minValue,
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

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle bgColor as solid, linear, or radial gradient
  let effectiveBgColor = "transparent";
  let effectiveBgImage = "";

  if (bgColor) {
    if (bgColor.trim().startsWith("linear-gradient(") || bgColor.trim().startsWith("radial-gradient(")) {
      effectiveBgImage = bgColor;
    } else {
      effectiveBgColor = bgColor;
    }
  }
  
  const buttonStyles = {
    width: width,
    height: height,
    // backgroundColor: bgColor,
    backgroundColor: effectiveBgColor,
    backgroundImage: effectiveBgImage || undefined,
    cursor: "pointer",
    boxShadow: boxShadow,
    textShadow: textShadow,
    ...(font ? { fontFamily: font } : {}), // ✅ FIX
    ...(isAnimationP === "true" && animationType?.toLowerCase() !== "none" && !hasAnimated && { opacity: 0 }),

  };

  // Event handlers
  const handleMouseEnter = () => {
    if (onHover) onHover();
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocusChange) onFocusChange(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
    if (onFocusChange) onFocusChange(false);
  };



  return (
    <>
        <button
          ref={buttonRef}
          style={{ ...buttonStyles, ...style }}
          onClick={onClick === "Yes" ? handleClick : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isLoading}
          type={buttonType}
          className={`${tailwaindClasses}`}

        >
          {iconLeft && <span>{iconLeft}</span>}
          {headerText}
          {iconRight && <span>{iconRight}</span>}
        </button>
    </>
  );
};

export default QButton;
QButton.displayName = "QButton";
