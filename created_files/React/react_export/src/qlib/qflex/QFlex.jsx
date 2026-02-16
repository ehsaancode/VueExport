import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QFlex = ({
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
  const divRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [classes, setClasses] = useState("");

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

    if (divRef.current) observer.observe(divRef.current);
    return () => divRef.current && observer.unobserve(divRef.current);
  }, [isVisible, hasAnimated]);

  useEffect(() => {
    const applyAnimations = async () => {
      if (isAnimationP === "true" && isVisible) {
        const cleanup = await runDynamicAnimations({
          ref: divRef,
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

        setClasses(divRef.current.className);
      }
    };

    applyAnimations();
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
          textShadow
        }).filter(([, val]) => val !== undefined && val !== null && val !== "")
      )
    ),
    // ...(isAnimationP === "true" && !hasAnimated && { opacity: 0 }),
    ...(isAnimationP === "true" && animationType?.toLowerCase() !== "none" && !hasAnimated && { opacity: 0 }),
  };

  return (
    <div
      ref={divRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
       style={{
          ...containerStyle,
          ...style
        }}
      className={`${classes} ${tailwaindClasses || ""}`}
    >
      {children}
    </div>
  );
};

QFlex.propTypes = {
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

export default QFlex;
QFlex.displayName = "QFlex";
