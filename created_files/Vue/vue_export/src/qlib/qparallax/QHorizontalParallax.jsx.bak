import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QHorizontalParallax = ({
  width,
  height,
  padding,
  margin,
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
  mainAlignment,
  crossAlignment,
  shadowSpreadRadius,
  shadowBlurRadius,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor,
  children,
  onClick = "",
  action = "",
  navigation = "",

  // ✅ Add all missing props here to fix `no-undef`
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
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  overflow,
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

    display: "flex",
    flexDirection: "row", // Changed to horizontal direction
   // overflow: "hidden",

  };

  const containerRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    const handleScroll = (event) => {
      const container = containerRef.current;
      if (!container) return;

      const {
        scrollLeft,
        scrollWidth,
        clientWidth,
        scrollTop,
        scrollHeight,
        clientHeight,
      } = container;

      // Debugging: Log scroll event to verify container is being targeted
     

      // Track the scroll direction (down or up)
      setScrollDirection(event.deltaY > 0 ? "down" : "up");

      // If in vertical scroll mode inside the container
      if (isVertical) {
        // Allow page scroll when we reach the bottom of the container
        if (scrollDirection === "down" && scrollTop + clientHeight >= scrollHeight - 10) {
          document.body.style.overflowY = "auto"; // Enable page scroll
        }
        if (scrollDirection === "up" && scrollTop <= 0) {
          setIsVertical(false); // Switch back to horizontal scrolling
          document.body.style.overflowY = "auto"; // Enable page scroll
        }
        return; // Exit early to continue vertical scroll behavior
      }

      // Horizontal scroll within the container
      container.scrollLeft += event.deltaY;

      // Switch to vertical scrolling once horizontal scroll reaches the right end
      if (scrollDirection === "down" && scrollLeft + clientWidth >= scrollWidth - 10) {
        setIsVertical(true); // Switch to vertical scroll mode
        document.body.style.overflowY = "auto"; // Enable page scroll
      }

      // Switch to vertical scrolling once horizontal scroll reaches the left end
      if (scrollDirection === "up" && scrollLeft <= 0) {
        setIsVertical(true); // Switch to vertical scroll mode
        document.body.style.overflowY = "auto"; // Enable page scroll
      }

      // Prevent the default behavior when scrolling horizontally
      event.preventDefault();
    };

    const container = containerRef.current;

    // Ensure that the container exists before adding event listener
    if (container) {
      container.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      // Cleanup event listener
      if (container) {
        container.removeEventListener("wheel", handleScroll);
      }
    };
  }, [isVertical, scrollDirection]);

  useEffect(() => {
    // Ensure container is resized correctly and observe size changes
    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      console.log("Container resized:", container.getBoundingClientRect());
    });
    if (container) {
      resizeObserver.observe(container);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return <div   className={`${tailwaindClasses}`}   onClick={onClick === "Yes" ? handleClick : undefined} ref={containerRef}  style={containerStyle}>{children}</div>;
};

QHorizontalParallax.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.string,
  margin: PropTypes.string,
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
  children: PropTypes.node,
};

export default QHorizontalParallax;

QHorizontalParallax.displayName = 'QHorizontalParallax';








