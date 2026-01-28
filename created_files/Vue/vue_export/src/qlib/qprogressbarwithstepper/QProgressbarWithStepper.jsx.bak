import React, { useEffect, useRef, useState } from "react";
 
const QProgressbarWithStepper = ({
  step = 5,
  shape = "horizontal", // "horizontal" | "vertical"
  direction = "leftToRight", // "leftToRight" | "rightToLeft"
  activeColor = "#00ff4c",
  inActiveColor = "#cccccc",
  thickness = "4px",
  iconSize = "40px",
  tailwaindClasses = "",
  intervalDuration = 500,
}) => {
  const containerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const isVertical = shape.toLowerCase() === "vertical";
  const isReverse = direction === "rightToLeft";
 
  const steps = Array.from({ length: step });
  if (isReverse) steps.reverse();
 
  // Start animation only when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [hasStarted]);
 
  // Animate progress one by one
  useEffect(() => {
    let interval;
    if (hasStarted && currentStep < step - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= step - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, intervalDuration);
    }
    return () => clearInterval(interval);
  }, [hasStarted, currentStep, step, intervalDuration]);
 
  return (
    <div
      ref={containerRef}
      className={`flex ${
        isVertical ? "flex-col" : "flex-row"
      } ${tailwaindClasses}`}
      style={{
        width: "100%", // respects parent width (e.g. w-[60%])
        height: "100%", // respects parent height
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {steps.map((_, index) => {
        const realIndex = isReverse ? step - 1 - index : index;
        const isActive = realIndex <= currentStep;
        const isLast = index === steps.length - 1;
 
        return (
          <React.Fragment key={index}>
            {/* Step Circle */}
          <div
            style={{
              width: iconSize,
              height: iconSize,
              borderRadius: "50%",
              backgroundColor: isActive ? activeColor : "transparent",
              border: isActive ? "none" : `2px solid ${inActiveColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isActive ? "#fff" : inActiveColor,
              fontWeight: "bold",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {isActive ? "✓" : realIndex + 1}
          </div>
 
            {/* Connector (only render if NOT last circle) */}
            {!isLast && (
              <div
                style={{
                  backgroundColor: isActive ? activeColor : inActiveColor,
                  width: isVertical ? thickness : undefined,
                  height: isVertical ? "100px" : thickness,
                  flexGrow: 1,
                  margin: isVertical ? "4px 0" : "0 8px",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
 
export default QProgressbarWithStepper;
QProgressbarWithStepper.displayName = "QProgressbarWithStepper";