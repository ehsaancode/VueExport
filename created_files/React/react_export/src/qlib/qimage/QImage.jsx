import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { defaultImageUrl } from "../../config";
import QImageAnimation from "../qimageanimation/QImageAnimation";
import { useNavigate } from "react-router-dom";
import { generateStyle, HexToFilter } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QImage = ({
  width,
  height,
  bgUrl,
  bgColor,
  isAbsoluteValue,
  imageFit,
  color,
  onClick = "",
  action = "",
  navigation = "",

  // Animation Props
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
  maxValue,
  minValue,
  overflow = "",
  zIndex,
  tailwaindClasses,
  seoAlt,
  seoTitle,
  boxShadow,
  foreground,
  backgroundSize,
  style,
}) => {
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [animationName, setAnimationName] = useState("");
  const animationNameRef = useRef("");
  const animationCountRef = useRef(0);

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

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [isVisible, hasAnimated]);

  useEffect(() => {
    if (isAnimationP === "true") {
      runDynamicAnimations({
        ref: imgRef,
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
        minValue
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

    let objectFit;

    switch (backgroundSize) {
      case "cover":
        objectFit = "cover";
        break;
      case "contain":
        objectFit = "contain";
        break;
      case "fill":
        objectFit = "fill";
        break;
      case "fitHeight":
      case "fitWidth":
        objectFit = "contain";
        break;
      case "none":
        objectFit = "none";
        break;
      default:
        if (isAbsoluteValue !== "true") {
          objectFit = "scale-down";
        }
        break;
    }


  // Apply animation styles
  const imageStyle = {
    ...generateStyle({
         width,
         height,
         isAbsoluteValue,
         bgColor,
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
         objectFit: objectFit,
    // ...(isAnimationP === "true" && !hasAnimated && { opacity: 0 }),
    ...(isAnimationP === "true" && animationType?.toLowerCase() !== "none" && !hasAnimated && { opacity: 0 }),
  };

  const match = tailwaindClasses.match(/text-\[#([A-Fa-f0-9]{8})\]/);
    const textColorHex = match ? `#${match[1].toUpperCase()}` : null;

    const filterConverter = new HexToFilter();

    function hexToFilter(hex, useAdvanced = false) {
      return filterConverter.getFilter(hex, useAdvanced);
    }

  return (
    <>
    <img
        className={`${tailwaindClasses}`}
        ref={imgRef}
        onClick={onClick === "Yes" ? handleClick : undefined}
        src={bgUrl}
        alt={seoAlt}         // fallback to `alt` if `seoAlt` is not defined
        title={seoTitle}
       style={{
          ...imageStyle,
          ...style,
          filter: textColorHex? hexToFilter(textColorHex):""
        }}
      />

    </>
  );
};

// PropTypes for type-checking
QImage.propTypes = {
  bgUrl: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,

  animationDelay: PropTypes.string,
  animationDirection: PropTypes.string,
  animationDuration: PropTypes.string,
  animationEasing: PropTypes.string,
  animationIterations: PropTypes.string,
  animationTargetPosition: PropTypes.string,
  animationType: PropTypes.string,
  maxValue: PropTypes.string,
  minValue: PropTypes.string,
};

export default QImage;
QImage.displayName = "QImage";
