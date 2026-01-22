import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QImageSlider = ({
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
  isImageFill = true,
  shadowBlurRadius,
  shadowColor,
  shadowOffsetX,
  shadowOffsetY,
  shadowSpreadRadius,
  autoPlay = true,
  loop = true,
  urls = [],
  autoPlayInterval = 3000,
  alignment = "center",
  isSelected = false,
  isSlider = true,
  widthType = "px",
  heightType = "px",
  onClick = "",
  action = "",
  navigation = "",

  // New props added below
  isAbsoluteValue,
  borderTLR,
  borderTRR,
  borderBLR,
  borderBRR,
  borderTW,
  borderBW,
  borderLW,
  borderRW,
  borderTC,
  borderBC,
  borderLC,
  borderRC,
  overflow,
  mainAlignment,
  crossAlignment,
  zIndex,
  fontSize,
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
  const [currentIndex, setCurrentIndex] = useState(0);

  // AutoPlay functionality
  useEffect(() => {
    if (autoPlay && isSlider) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          loop
            ? (prevIndex + 1) % urls.length
            : Math.min(prevIndex + 1, urls.length - 1)
        );
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, isSlider, loop, urls.length]);

  // Function to go to the next image
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      loop
        ? (prevIndex + 1) % urls.length
        : Math.min(prevIndex + 1, urls.length - 1)
    );
  };

  // Function to go to the previous image
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      loop
        ? (prevIndex - 1 + urls.length) % urls.length
        : Math.max(prevIndex - 1, 0)
    );
  };

  // Inline styles for the slider container and images
  const containerStyle = {
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      positionedLeft,
      positionedTop,
      positionedRight,
      positionedBottom,
      bgColor,
      bgUrl,
      isImageFill,
      color,
      borderRadius,
      borderTLR,
      borderTRR,
      borderBLR,
      borderBRR,
      borderWidth,
      borderColor,
      borderTW,
      borderBW,
      borderLW,
      borderRW,
      borderTC,
      borderBC,
      borderLC,
      borderRC,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlurRadius,
      shadowSpreadRadius,
      shadowColor,
      overflow,
      mainAlignment,
      crossAlignment,
      onClick,
      zIndex,
      fontSize,
      fontWeight,
      textAlign,
      fontFamily,
      fontStyle,
      imageFit,
      decoration,
      textDirection,

      boxShadow,
    }),
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),

    overflow: "hidden",
  };

  const imageStyle = {
    width: isImageFill ? "100%" : "auto",
    height: isImageFill ? "100%" : "auto",
    objectFit: isImageFill ? "cover" : "contain",
    transition: "opacity 0.5s ease-in-out",
    opacity: isSelected ? 1 : 0.8,
    cursor: onClick === "Yes" ? "pointer" : "default",
  };

  return (
    <div style={containerStyle} className={`${tailwaindClasses}`}>
      {urls.length > 0 ? (
        urls.map((url, index) => (
          <img
            onClick={onClick === "Yes" ? handleClick : undefined}
            key={index}
            src={url}
            alt={`Slide ${index + 1}`}
            style={{
              ...imageStyle,
              display: index === currentIndex ? "block" : "none",
            }}
          />
        ))
      ) : (
        <p style={{ color }}>No images available</p>
      )}
      {/* Manual navigation controls */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        ❯
      </button>
    </div>
  );
};

// PropTypes for validation
QImageSlider.propTypes = {
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
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  urls: PropTypes.arrayOf(PropTypes.string),
  autoPlayInterval: PropTypes.number,
  alignment: PropTypes.string,
  isSelected: PropTypes.bool,
  isSlider: PropTypes.bool,
  widthType: PropTypes.string,
  heightType: PropTypes.string,
};

export default QImageSlider;
QImageSlider.displayName = "QImageSlider";
