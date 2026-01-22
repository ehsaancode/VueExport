import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QIncrementCounter = ({
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
  endValue,
  fontSize,
  onClick = "",
  action = "",
  navigation = "",

  // 🆕 Added to resolve no-undef warnings
  overflow,
  zIndex,
  fontWeight,
  textAlign,
  fontFamily,
  fontStyle,
  imageFit,
  decoration,
  textDirection,
  tailwaindClasses,
  boxShadow,
  foreground,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick === "Yes") {
      switch (action) {
        case "Navigate to":
          navigate(`/${navigation}`);
          break;
      }
    }
  };

  const containerStyle = {
    ...generateStyle({
       width,
       height,
      isAbsoluteValue,
      bgColor,
      bgUrl,
      isImageFill,
      color,
      overflow,
      onClick,
      zIndex,
      imageFit,

      boxShadow,
    }),
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
    display: "flex",
    flexDirection: "column",
  };

  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);
  const targetValue = endValue;
  const intervalSpeed = 100;

  useEffect(() => {
    let observer;

    const startCounting = () => {
      if (!hasStarted) {
        setHasStarted(true);
        const interval = setInterval(() => {
          setCount((prev) => {
            if (prev < targetValue) return prev + 1;
            clearInterval(interval);
            return targetValue;
          });
        }, intervalSpeed);
      }
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startCounting();
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (counterRef.current) observer.observe(counterRef.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [hasStarted]);

  return (
    <div
      className={`${tailwaindClasses}`}
      onClick={onClick === "Yes" ? handleClick : undefined}
      ref={counterRef}
      style={containerStyle}
    >
      {count}
    </div>
  );
};

// PropTypes for validation
QIncrementCounter.propTypes = {
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

export default QIncrementCounter;
QIncrementCounter.displayName = "QIncrementCounter";
