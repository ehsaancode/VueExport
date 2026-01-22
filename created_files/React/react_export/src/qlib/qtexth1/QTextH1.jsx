import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";
import { extractFontFamily } from "../../utils/helper";


const QTextH1 = ({
  width,
  height,
  headerText = "",
  bgColor,
  color,
  bgUrl,
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
  overflow = "",
  zIndex,
  tailwaindClasses,
  boxShadow,
  foreground,
  textDecorationLine,
  style
}) => {
  const H1Ref = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const font = extractFontFamily(tailwaindClasses);

  // Observer for when QTextH1 enters the viewport
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

    if (H1Ref.current) {
      observer.observe(H1Ref.current);
    }

    return () => {
      if (H1Ref.current) {
        observer.unobserve(H1Ref.current);
      }
    };
  }, [hasAnimated, isVisible]);

  useEffect(() => {
    if (isAnimationP === "true") {
      runDynamicAnimations({
        ref: H1Ref,
        isVisible,
        isAnimationP,
        animationType,
        animationDirection,
        animationEasing,
        animationIterations,
        animationDelay,
        isRevarsed,
        maxValue,
        minValue,
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
        default:
          break;
      }
    }
  };

  const matchStroke = tailwaindClasses.match(/stroke-\[(\d+px)\]/);
  const matchStrokeColor = tailwaindClasses.match(
    /strokeColor-\[#([0-9A-Fa-f]{6,8})\]/
  );
  const strokeWidth = matchStroke?.[1] ?? null;
  const fullStrokeColor = matchStrokeColor?.[1] ?? null;
  const strokeColor = fullStrokeColor
    ? `#${fullStrokeColor}` // keep all 6 or 8 hex characters
    : null;


  // Apply animation styles
  const paragraphStyle = {
    margin: "0px",
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      bgColor,
      bgUrl,
      color,
      overflow,
      onClick,
      zIndex,
      boxShadow,
    }),

    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),

    ...(strokeWidth && strokeColor
      ? {
          WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
          color: "transparent", // Only if outlined text is active
        }
      : {}),
    textDecorationLine: textDecorationLine,
    ...(isAnimationP === "true" && animationType?.toLowerCase() !== "none" && !hasAnimated && { opacity: 0 }),
      ...(font ? { fontFamily: font } : {}), // ✅ FIX

  };

  return (
    <>
      <h1
        ref={H1Ref}
        className={`${tailwaindClasses}`}
         style={{
          ...paragraphStyle,
          ...style
        }}
        onClick={onClick === "Yes" ? handleClick : undefined}
         dangerouslySetInnerHTML={{
          __html: String(headerText ?? "").replace(/\n/g, "<br/>"),
        }}

      ></h1>
    </>
  );
};

QTextH1.propTypes = {
  headerText: PropTypes.string.isRequired,
  fontSize: PropTypes.string,
  color: PropTypes.string,
  fontWeight: PropTypes.string,
  textAlign: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.string,
  positionedLeft: PropTypes.string,
  positionedTop: PropTypes.string,
  positionedRight: PropTypes.string,
  positionedBottom: PropTypes.string,
  fontFamily: PropTypes.string,
  fontStyle: PropTypes.string,
  paddingLeft: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingRight: PropTypes.string,
  paddingBottom: PropTypes.string,
  marginLeft: PropTypes.string,
  marginTop: PropTypes.string,
  marginRight: PropTypes.string,
  marginBottom: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  shadowColor: PropTypes.string,
  shadowBlurRadius: PropTypes.string,
  shadowOffsetX: PropTypes.string,
  shadowOffsetY: PropTypes.string,
  shadowSpreadRadius: PropTypes.string,
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
  maxValue: PropTypes.string,
  minValue:PropTypes.string,
};

export default QTextH1;
QTextH1.displayName = "QTextH1";
