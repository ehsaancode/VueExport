import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

/**
 * QForm — same structure as QDiv but acts as a form container
 * Supports animations, styles, and cms_form_Id for submission handling
 */
const QForm = ({
  cms_form_Id,
  width,
  height,
  bgColor,
  bgUrl,
  isImageFill,
  children,
  isAbsoluteValue,
  tailwaindClasses,
  backgroundSize,
  boxShadow,
  textShadow,

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
  zIndex,
  maxValue,
  minValue,
  midValue,

  // Events
  onSubmit,
  onClick
}) => {
  const formRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [classes, setClasses] = useState("");

  // ✅ Observe visibility for animation triggering
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

    if (formRef.current) observer.observe(formRef.current);
    return () => formRef.current && observer.unobserve(formRef.current);
  }, [hasAnimated]);

  // ✅ Handle dynamic animations when visible
  useEffect(() => {
    const applyAnimations = async () => {
      if (isAnimationP === "true" && isVisible) {
        await runDynamicAnimations({
          ref: formRef,
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
        setClasses(formRef.current.className);
      }
    };
    applyAnimations();
  }, [isVisible]);

  // ✅ Handle submit (prevent default)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(e);
    }
  };

  // ✅ Style using helper
  const formStyle = {
    ...generateStyle(
      Object.fromEntries(
        Object.entries({
          width,
          height,
          bgColor,
          bgUrl,
          isImageFill,
          isAbsoluteValue,
          zIndex,
          backgroundSize,
          boxShadow,
          textShadow
        }).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )
    ),
  };

  return (
    <form
      ref={formRef}
      id={`form_${cms_form_Id}`}
      onSubmit={handleSubmit}
     // onClick={onClick}
      style={formStyle}
      className={`${classes} ${tailwaindClasses || ""}`}
    >
      {children}
    </form>
  );
};

QForm.propTypes = {
  cms_form_Id: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  children: PropTypes.node,
  isAbsoluteValue: PropTypes.bool,
  tailwaindClasses: PropTypes.string,
  backgroundSize: PropTypes.string,
  boxShadow: PropTypes.string,
  textShadow: PropTypes.string,
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
  onSubmit: PropTypes.func,
  onClick: PropTypes.func,
};

QForm.displayName = "QForm";
export default QForm;
