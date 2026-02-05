import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QStickyHeader = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  isImageFill,
  children,
  isAbsoluteValue,
  overflow,
  zIndex,
  imageFit,
  decoration,
  textDirection,
  onClick = "",
  action = "",
  navigation = "",
  tailwaindClasses,
  boxShadow,
  foreground,
}) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerWidth, setHeaderWidth] = useState("100%");
  const headerRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleClick = () => {
    if (onClick === "Yes") {
      if (action === "Navigate to" && navigation) {
        navigate(`/${navigation}`);
      }
    }
  };

  // Use ResizeObserver to sync Header Height -> Wrapper Height
  // And Wrapper Width -> Header Width (when fixed)
  useEffect(() => {
    if (!headerRef.current || !wrapperRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === headerRef.current) {
           // Capture header height including potential margins if possible, 
           // but traditionally offsetHeight is robust enough for block elements without external margins.
           // Since tailwind classes are inside, offsetHeight captures padding/content.
           setHeaderHeight(entry.target.offsetHeight);
        }
        if (entry.target === wrapperRef.current) {
           // Capture wrapper width to apply to fixed header
           setHeaderWidth(entry.target.offsetWidth);
        }
      }
    });

    resizeObserver.observe(headerRef.current);
    resizeObserver.observe(wrapperRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Initial measurement to prevent jump on mount
  React.useLayoutEffect(() => {
      if(headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
      if(wrapperRef.current) setHeaderWidth(wrapperRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        // Use a threshold close to 0 but allowing for sub-pixel precision issues.
        // rect.top <= 0
        const rect = wrapperRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount/update to catch initial state
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      zIndex,
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
    position: isAbsoluteValue ? "absolute" : isSticky ? "fixed" : "relative",
    top: isAbsoluteValue ? undefined : isSticky ? "0px" : undefined,
    width: isSticky && !isAbsoluteValue ? headerWidth : (width || "100%"),
    zIndex: zIndex ?? 999,
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        height: isSticky && !isAbsoluteValue ? headerHeight : "auto",
      }}
    >
      <div
        ref={headerRef}
        className={tailwaindClasses || ""}
        onClick={onClick === "Yes" ? handleClick : undefined}
        style={containerStyle}
      >
        {children}
      </div>
    </div>
  );
};

QStickyHeader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  boxShadow: PropTypes.string,
  foreground: PropTypes.string,
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imageFit: PropTypes.string,
  decoration: PropTypes.string,
  textDirection: PropTypes.string,
};

export default QStickyHeader;
QStickyHeader.displayName = "QStickyHeader";