import React, { useState, useEffect, useRef } from "react";

const QDashedProgressbar = ({
  shape = "horizontal",
  thickness = "20px",
  direction = "leftToRight",
  activeColor = "#FF0066",
  inActiveColor = "#909090",
  tailwindClasses = "",
  steps = 8,
  speed = 500,
  loop = false,
  style
})=> {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Start animation only when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect(); // optional: stop observing
        }
      },
      { threshold: 0.3 }
    );
    const current = containerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasStarted]);

  useEffect(() => {
    let interval;
    if (hasStarted) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps - 1) {
            if (!loop) clearInterval(interval);
            return loop ? 0 : steps - 1;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [steps, speed, loop, hasStarted]);

  const isHorizontal = shape.toLowerCase() === "horizontal";
  const isReversed =
    direction.toLowerCase() === "righttoleft" ||
    (direction.toLowerCase() === "bottomtotop" && !isHorizontal);

  const stepHeight = "100px";
  const totalHeight = isHorizontal
    ? thickness
    : `${parseInt(stepHeight) * steps}px`;

  const containerStyle = {
    display: "flex",
    flexDirection: isHorizontal
      ? isReversed
        ? "row-reverse"
        : "row"
      : isReversed
      ? "column-reverse"
      : "column",
    width: isHorizontal ? "100%" : thickness,
    height: isHorizontal ? thickness : totalHeight,
    gap: "4px",
  };

  const stepStyle = {
    flex: isHorizontal ? 1 : "none",
    backgroundColor: inActiveColor,
    borderRadius: "4px",
    transition: "background-color 0.3s ease",
    minWidth: isHorizontal ? "0" : thickness,
    minHeight: isHorizontal ? thickness : stepHeight,
    height: isHorizontal ? "auto" : stepHeight,
  };

  const activeStepStyle = {
    ...stepStyle,
    backgroundColor: activeColor,
  };

  return (
    <div
      className={tailwindClasses}
       style={{
          ...containerStyle,
          ...style
        }}
      ref={containerRef}
    >
      {Array(steps)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            style={index <= currentStep ? activeStepStyle : stepStyle}
          />
        ))}
    </div>
  );
};
export default QDashedProgressbar;
QDashedProgressbar.displayName = "QDashedProgressbar";
