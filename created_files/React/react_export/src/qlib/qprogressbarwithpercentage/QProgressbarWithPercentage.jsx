import React, { useEffect, useRef, useState } from "react";

const QProgressbarWithPercentage = ({
  shape = "horizontal",
  direction = "leftToRight",
  thickness = "20px",
  activeColor = "#04ff00ff",
  inActiveColor = "#ccc",
  tooltipColor = "#2c1dd2ff",
  tooltipBackgroundColor = "#b1d861ff",
  value = 0,
  autoSlide = true,
  intervalDuration = 300,
  onChange = () => {},
}) => {
  const barRef = useRef(null);
  const [progress, setProgress] = useState(autoSlide ? 0 : value);
  const [isInView, setIsInView] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isHorizontal = shape?.toLowerCase?.() === "horizontal";

  // Track intersection to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;

        setIsInView(visible);

        if (visible && autoSlide && progress < 100 && !isAnimating) {
          setIsAnimating(true);
        }
      },
      { threshold: 0.3 }
    );

    if (barRef.current) observer.observe(barRef.current);
    return () => {
      if (barRef.current) observer.unobserve(barRef.current);
    };
  }, [autoSlide, progress, isAnimating]);

  // Animate only when in view and progress < 100
  useEffect(() => {
    let interval;

    if (isInView && autoSlide && progress < 100 && isAnimating) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          onChange(next);

          if (next >= 100) {
            clearInterval(interval);
            setIsAnimating(false);
            return 100;
          }

          return next;
        });
      }, intervalDuration);
    }

    return () => clearInterval(interval);
  }, [isInView, autoSlide, progress, isAnimating]);

  const getActiveBarStyles = () => {
    if (isHorizontal) {
      const isRightToLeft = direction === "rightToLeft";
      return {
        backgroundColor: activeColor,
        width: `${progress}%`,
        height: thickness,
        position: "absolute",
        [isRightToLeft ? "right" : "left"]: 0,
        top: 0,
        borderRadius: "999px",
        transition: "width 0.2s linear",
      };
    } else {
      const isTopToBottom = direction === "leftToRight";
      return {
        backgroundColor: activeColor,
        width: thickness,
        height: `${progress}%`,
        position: "absolute",
        left: 0,
        [isTopToBottom ? "top" : "bottom"]: 0,
        borderRadius: "999px",
        transition: "height 0.2s linear",
      };
    }
  };

  const getTooltipStyles = () => {
    if (isHorizontal) {
      const isRightToLeft = direction === "rightToLeft";
      const leftPosition = isRightToLeft
        ? `calc(${100 - progress}% )`
        : `calc(${progress}% )`;

      return {
        position: "absolute",
        top: `-40px`,
        left: leftPosition,
        transform: "translateX(-50%)",
        backgroundColor: tooltipBackgroundColor,
        color: tooltipColor,
        padding: "6px 10px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
        textAlign: "center",
        zIndex: 5,
      };
    } else {
      const isTopToBottom = direction === "leftToRight";
      const topPosition = isTopToBottom
        ? `calc(${progress}% )`
        : `calc(${100 - progress}% )`;

      return {
        position: "absolute",
        left: `calc(100% + 12px)`,
        top: topPosition,
        transform: "translateY(-50%)",
        backgroundColor: tooltipBackgroundColor,
        color: tooltipColor,
        padding: "6px 10px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
        textAlign: "center",
        zIndex: 5,
      };
    }
  };

  const getTooltipTailStyles = () => {
    if (isHorizontal) {
      return {
        content: "''",
        position: "absolute",
        bottom: -6,
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: `6px solid ${tooltipBackgroundColor}`,
      };
    } else {
      return {
        content: "''",
        position: "absolute",
        top: "50%",
        left: -6,
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "6px solid transparent",
        borderBottom: "6px solid transparent",
        borderRight: `6px solid ${tooltipBackgroundColor}`,
      };
    }
  };

  return (
    <div
      ref={barRef}
      className="relative"
      style={{
        width: isHorizontal ? "100%" : thickness,
        height: isHorizontal ? thickness : "400px",
        backgroundColor: inActiveColor,
        borderRadius: "999px",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Active Bar */}
      <div style={getActiveBarStyles()} />

      {/* Tooltip */}
      <div style={getTooltipStyles()}>
        {Math.round(progress)}%
        <div style={getTooltipTailStyles()} />
      </div>
    </div>
  );
};

QProgressbarWithPercentage.displayName = "QProgressbarWithPercentage";
export default QProgressbarWithPercentage;
