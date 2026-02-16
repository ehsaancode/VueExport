import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QDiv = ({
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
  maxValue,
  minValue,
  midValue,
  isRevarsed,
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
  }, [hasAnimated]);

  useEffect(() => {
    const applyAnimations = async () => {
      if (isAnimationP === "true" && isVisible) {
        await runDynamicAnimations({
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

  // Style only using allowed props
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
        }).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )
    ),
    // display: "flex",
    // flexDirection: "column",
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

QDiv.propTypes = {
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

QDiv.displayName = "QDiv";
export default QDiv;
