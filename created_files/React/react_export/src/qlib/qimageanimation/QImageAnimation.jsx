import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const QImageAnimation = ({
  images,
  animationProps,
  width,
  height,
  imageFit,
  onClick = "",
  action = "",
  navigation = "",
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
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has already run
  const containerRef = useRef(null);

  const computedWidth = width;
  const computedHeight = height;

  // Detect when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true); // Mark animation as played
          setCurrentIndex(0); // Start animation
        }
      },
      { threshold: 0.5 } // Adjust visibility threshold
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [hasAnimated]);

  // Image sliding logic (only runs the first time)
  useEffect(() => {
    if (!hasAnimated) return;

    const delay = parseInt(animationProps.animationDelay, 10) || 3000;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [hasAnimated, images.length, animationProps.animationDelay]);

  // Get dynamic transform based on direction
  const getTransform = (index) => {
    if (animationProps.animationType == "slider") {
      if (!hasAnimated) {
        switch (animationProps.animationDirection) {
          case "left":
            return `translateX(-100vw)`; // Start fully off-screen to the left
          case "right":
            return `translateX(100vw)`; // Start fully off-screen to the right
          case "top":
            return `translateY(-100vh)`; // Start fully off-screen above
          case "bottom":
            return `translateY(100vh)`; // Start fully off-screen below
          default:
            return `translateX(100vw)`; // Default: move from right
        }
      }

      return index === currentIndex ? "translate(0, 0)" : "translateX(100vw)";
    } else {
      if (!hasAnimated) {
        switch (animationProps.animationType) {
          case "slide":
            switch (animationProps.animationDirection) {
              case "left":
                return "translateX(-100vw)";
              case "right":
                return "translateX(100vw)";
              case "top":
                return "translateY(-100vh)";
              case "bottom":
                return "translateY(100vh)";
              default:
                return "translateX(100vw)";
            }
          case "scale":
            return "scale(0)"; // Image is hidden before appearing
          case "fade":
            return "opacity(0)"; // No movement, just fades in
          default:
            return "translateX(100vw)"; // Default slide from right
        }
      }

      // When the image is visible, smoothly scale from 0 to 1
      return index === currentIndex
        ? "scale(1)" // Show when active
        : animationProps.animationType === "scale"
        ? "scale(0)" // Hide when inactive
        : "translateX(100vw)"; // Default slide
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: computedWidth ? `${computedWidth}px` : "100%",
        height: computedHeight != "" ? `${computedHeight}px` : "100%",
        maxWidth: computedWidth ? "" : "fit-content",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
      }}
    >
      {images.map((image, index) => (
        <img
         onClick={onClick === "Yes" ? handleClick : undefined}
          key={index}
          src={image}
          alt={`slide-${index}`}
          style={{
            cursor: onClick === "Yes" ? "pointer" : "default",

            position: "absolute",
            width: computedWidth ? `${computedWidth}px` : "100%",
            height: computedHeight !== "" ? `${computedHeight}px` : "100%",
            maxWidth: computedWidth ? "" : "fit-content",
            objectFit: imageFit,
            transition:
              animationProps.animationType === "scale"
                ? "transform 0.8s ease-in-out, opacity 0.5s ease-in-out"
                : `transform ${animationProps.animationDuration || "1s"} ${
                    animationProps.animationEasing || "ease-in-out"
                  },
                    opacity ${
                      animationProps.animationDuration || "1s"
                    } ease-in-out`,
            transform: getTransform(index),
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

QImageAnimation.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  animationProps: PropTypes.shape({
    animationDelay: PropTypes.string,
    animationDirection: PropTypes.string, // "left", "right", "top", "bottom"
    animationDuration: PropTypes.string,
    animationEasing: PropTypes.string,
  }),
};

export default QImageAnimation;
QImageAnimation.displayName = "QImageAnimation";