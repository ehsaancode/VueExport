import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import { usePagination } from "../../store/hooks/pagination";
import { runDynamicAnimations } from "../../utils/animationUtils";
import { extractFontFamily } from "../../utils/helper";


const QParagraph = ({
  width,
  height,
  headerText = "",
  bgColor,
  color,
  bgUrl,
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
  isRevarsed,
  overflow = "",
  maxValue,
  minValue,
  midValue,
  zIndex,
  Pagination,
  tailwaindClasses,
  boxShadow,
  foreground,
  textDecorationLine,
  style
}) => {
  const paragraphRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [Text, setheaderText] = useState(headerText);
  const font = extractFontFamily(tailwaindClasses);

  // Observer for when paragraph enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true); // Prevents the animation from running again
        }
      },
      { threshold: 0.2 }
    );

    if (paragraphRef.current) {
      observer.observe(paragraphRef.current);
    }

    return () => {
      if (paragraphRef.current) {
        observer.unobserve(paragraphRef.current);
      }
    };
  }, [hasAnimated]);

  // Apply animation based on visibility and isRevarsed

  useEffect(() => {
    if (!isVisible || !isAnimationP) return;
    if (String(isAnimationP) === "true") {
      runDynamicAnimations({
        ref: paragraphRef,
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
    }

    // const types = animationType.split(",").map((s) => s.trim());
    // const directions = animationDirection.split(",").map((s) => s.trim());
    // const easings = animationEasing.split(",").map((s) => s.trim());
    // const iterations = animationIterations.split(",").map((s) => s.trim());
    // const delays = animationDelay.split(",").map((s) => s.trim());
    // const durations = (animationDuration || "1s")
    //   .split(",")
    //   .map((s) => s.trim());

    // const reversedFlags = isRevarsed.split(",").map((s) => s.trim());

    // if (types.includes("rotate")) {
    //   document.body.style.overflowY = "hidden";
    // }

    // const runAnimationsSequentially = async () => {
    //   for (let i = 0; i < types.length; i++) {
    //     const type = types[i];
    //     const animationDirection = directions[i] || "none";
    //     const easing = easings[i] || "ease-in";
    //     const rawInvalidValues = [
    //       "loop",
    //       "",
    //       "null",
    //       "Null",
    //       null,
    //       undefined,
    //       "undefined",
    //     ];

    //     // Normalize all invalid values to lowercase strings
    //     const invalidValues = rawInvalidValues.map((v) =>
    //       (v ?? "").toString().toLowerCase()
    //     );

    //     // Normalize current iteration value
    //     const currentValue = (iterations[i] ?? "").toString().toLowerCase();

    //     // Final iteration decision
    //     const iteration = invalidValues.includes(currentValue)
    //       ? "infinite"
    //       : iterations[i] || "1";
    //     const delay = delays[i] || "1s";
    //     const duration = durations[i] || "1s";

    //     const isReversedBool = reversedFlags[i] === "true";
    //     const delayInMs = parseFloat(delay) * 1000;
    //     const uniqueAnimationName = `anim-${type}-${animationDirection}-${i}`;
    //     const styleId = `style-${uniqueAnimationName}`;

    //     const translateAxis =
    //       animationDirection === "top" || animationDirection === "bottom"
    //         ? "Y"
    //         : animationDirection === "left" || animationDirection === "right"
    //         ? "X"
    //         : "";

    //     const translateValue =
    //       animationDirection === "top"
    //         ? "-100%"
    //         : animationDirection === "bottom"
    //         ? "100%"
    //         : animationDirection === "left"
    //         ? "-100%"
    //         : animationDirection === "right"
    //         ? "100%"
    //         : "0%";

    //     const animationKeyframes = {
    //       slide: `
    //    @keyframes ${uniqueAnimationName} {
    //      0% { 
    //        transform: translate${translateAxis}(${
    //         easing === "ease-in" ? translateValue : "0%"
    //       }); 
    //        opacity: ${easing === "ease-in" ? "0" : "1"}; 
    //      }
    //      50% { 
    //        transform: translate${translateAxis}(0); 
    //        opacity: 1; 
    //      }
    //      100% { 
    //        transform: translate${translateAxis}(${
    //         easing === "ease-out"
    //           ? translateValue
    //           : isReversedBool
    //           ? animationDirection === "top"
    //             ? "-100%"
    //             : animationDirection === "bottom"
    //             ? "100%"
    //             : animationDirection === "left"
    //             ? "-100%"
    //             : animationDirection === "right"
    //             ? "100%"
    //             : "0%"
    //           : "0%"
    //       }); 
    //        opacity: ${easing === "ease-out" || isReversedBool ? "0" : "1"}; 
    //      }
    //    }
    //                `,

    //       blur: `
    //                @keyframes ${uniqueAnimationName} {
    //                  0% { 
    //                    transform: translate${translateAxis}(${
    //         easing === "ease-in" || easing === "none" ? translateValue : "0%"
    //       }); 
    //                    filter: blur(${
    //                      easing === "ease-in" || easing === "none"
    //                        ? "10px"
    //                        : isReversedBool
    //                        ? "0px"
    //                        : "0px"
    //                    }); 
    //                    opacity: ${
    //                      easing === "ease-in" || easing === "none" ? "0" : "1"
    //                    }; 
    //                  }
                 
    //                  50% { 
    //                    transform: translate${translateAxis}(0); 
    //                    filter: blur(0px); 
    //                    opacity: 1; 
    //                  }
                 
    //                  100% { 
    //                    transform: translate${translateAxis}(${
    //         easing === "ease-out" || isReversedBool ? translateValue : "0%"
    //       }); 
    //                    filter: blur(${
    //                      easing === "ease-out" || isReversedBool
    //                        ? "10px"
    //                        : "0px"
    //                    }); 
    //                    opacity: ${
    //                      easing === "ease-out" || isReversedBool ? "0" : "1"
    //                    }; 
    //                  }
    //                }
    //              `,

    //       shake: `
    //              @keyframes ${uniqueAnimationName} {
    //                0% { transform: ${getShakeTransform(
    //                  "start",
    //                  isReversedBool
    //                )}; }
    //                25% { transform: ${getShakeTransform(
    //                  "mid1",
    //                  isReversedBool
    //                )}; }
    //                50% { transform: ${getShakeTransform(
    //                  "mid2",
    //                  isReversedBool
    //                )}; }
    //                75% { transform: ${getShakeTransform(
    //                  "mid3",
    //                  isReversedBool
    //                )}; }
    //                100% { transform: ${getShakeTransform(
    //                  "end",
    //                  isReversedBool
    //                )}; }
    //              }
    //            `,

    //       fade: `
    //                @keyframes ${uniqueAnimationName} {
    //                  0% {
    //                    transform: translate${translateAxis}(${
    //         easing === "ease-in" ? translateValue : "0%"
    //       });
    //                    opacity: ${easing === "ease-in" ? "0" : "1"};
    //                  }
    //                  50% {
    //                    transform: translate${translateAxis}(0%);
    //                    opacity: 1;
    //                  }
    //                  100% {
    //                    transform: translate${translateAxis}(${
    //         easing === "ease-out" ? translateValue : "0%"
    //       });
    //                    opacity: ${easing === "ease-out" ? "0" : "1"};
    //                  }
    //                }
    //              `,

    //       rotate: `
    //         @keyframes ${uniqueAnimationName} {
    //           0% { transform: rotate(${isReversedBool ? "360deg" : "0deg"}); }
    //           100% { transform: rotate(${isReversedBool ? "0deg" : "360deg"}); }
    //         }
    //       `,

    //       scale: `
    //                @keyframes ${uniqueAnimationName} {
    //                  0% {
    //                    transform: scale(${
    //                      easing === "ease-in"
    //                        ? isReversedBool
    //                          ? "1.2"
    //                          : "0.8"
    //                        : "1"
    //                    });
    //                    opacity: ${easing === "ease-in" ? "0" : "1"};
    //                  }
    //                  50% {
    //                    transform: scale(1);
    //                    opacity: 1;
    //                  }
    //                  100% {
    //                    transform: scale(${
    //                      easing === "ease-out"
    //                        ? isReversedBool
    //                          ? "0.8"
    //                          : "1.2"
    //                        : "1"
    //                    });
    //                    opacity: ${easing === "ease-out" ? "0" : "1"};
    //                  }
    //                }
    //              `,

    //       bounce: `
    //                     @keyframes ${uniqueAnimationName} {
    //                       0%, 100% { transform: translateY(0); opacity: 1; }
    //                       50% { transform: translateY(-20px); opacity: 1; }
    //                     }
    //                   `,

    //       flip: `
    //                   @keyframes ${uniqueAnimationName} {
    //                     0% { 
    //                       transform: perspective(400px) ${getFlipTransform(
    //                         "start"
    //                       )}; 
    //                       opacity: 0; 
    //                     }
    //                     50% { 
    //                       transform: perspective(400px) ${getFlipTransform(
    //                         "middle"
    //                       )}; 
    //                       opacity: 1; 
    //                     }
    //                     100% { 
    //                       transform: perspective(400px) ${getFlipTransform(
    //                         "end"
    //                       )}; 
    //                       opacity: 0; 
    //                     }
    //                   }
    //                 `,

    //       skew: `
    //                 @keyframes ${uniqueAnimationName} {
    //                   0% { transform: skew(${
    //                     isReversedBool ? "-20deg" : "20deg"
    //                   }); opacity: 0; }
    //                   50% { transform: skew(0deg); opacity: 1; }
    //                   100% { transform: skew(${
    //                     isReversedBool ? "20deg" : "0deg"
    //                   }); opacity: 1; }
    //                 }
    //               `,

    //       zoom: `
    //                     @keyframes ${uniqueAnimationName} {
    //                       0% { transform: scale(${
    //                         isReversedBool ? "1.5" : "0.5"
    //                       }); opacity: 0; }
    //                       50% { transform: scale(1); opacity: 1; }
    //                       100% { transform: scale(${
    //                         isReversedBool ? "0.5" : "1.5"
    //                       }); opacity: 0; }
    //                     }
    //                   `,

    //       saturate: `
    //                   @keyframes ${uniqueAnimationName} {
    //                     0% {
    //                      background: black;
    //                       transform: translate${translateAxis}(${
    //         easing === "ease-in" ? translateValue : "0%"
    //       });
    //                       filter: saturate(${isReversedBool ? "200%" : "50%"});
    //                       opacity: ${easing === "ease-in" ? "0" : "0"};
    //                     }
    //                     50% {
    //                        background: black;
    //                       transform: translate${translateAxis}(0);
    //                       filter: saturate(100%);
    //                       opacity: 1;
    //                     }
    //                     100% {
    //                       transform: translate${translateAxis}(${
    //         easing === "ease-out"
    //           ? translateValue
    //           : isReversedBool
    //           ? animationDirection === "top"
    //             ? "-100%"
    //             : animationDirection === "bottom"
    //             ? "100%"
    //             : animationDirection === "left"
    //             ? "-100%"
    //             : animationDirection === "right"
    //             ? "100%"
    //             : "0%"
    //           : "0%"
    //       });
    //                       filter: saturate(${isReversedBool ? "50%" : "200%"});
    //                       opacity: ${
    //                         easing === "ease-out" || isReversedBool ? "0" : "1"
    //                       };
    //                     }
    //                   }
    //                 `,
    //     };

    //     const keyframes = animationKeyframes[type];
    //     if (!keyframes) continue;

    //     if (!document.getElementById(styleId)) {
    //       const styleTag = document.createElement("style");
    //       styleTag.id = styleId;
    //       styleTag.innerHTML = keyframes;
    //       document.head.appendChild(styleTag);
    //     }

    //     const el = paragraphRef.current;

    //     if (el) {
    //       // Step 1: Reset styles cleanly
    //       el.style.animation = "none";
    //       el.style.opacity = "0";

    //       // Step 2: Force DOM reflow
    //       void el.offsetWidth;

    //       // Step 3: Assign animation properties via shorthand OR individually
    //       const fullAnimation =
    //         type === "rotate"
    //           ? `${uniqueAnimationName} ${duration} linear ${delay} ${iteration} forwards`
    //           : `${uniqueAnimationName} ${duration} ${easing} ${delay} ${iteration} forwards`;
    //       // Step 4: Apply after DOM settles (microtask)
    //       requestAnimationFrame(() => {
    //         el.style.animation = fullAnimation;
    //         el.style.opacity = "1";
    //       });
    //     }

    //     // if (iteration !== "infinite") {
    //     //   await new Promise((res) => setTimeout(res, delayInMs + 1100));
    //     // }

    //     const durationInMs = parseFloat(duration) * 1000 || 1000;
    //     const repeatCount =
    //       iteration === "infinite" ? 1 : parseInt(iteration) || 1;
    //     const totalDuration = delayInMs + durationInMs * repeatCount;

    //     if (iteration !== "infinite") {
    //       await new Promise((res) => setTimeout(res, totalDuration));
    //     }
    //   }
    // };

    // runAnimationsSequentially();

    // return () => {
    //   document.body.style.overflowY = "auto";

    //   types.forEach((type, i) => {
    //     const animationDirection = directions[i] || "none";
    //     const styleId = `style-anim-${type}-${animationDirection}-${i}`;
    //     const existing = document.getElementById(styleId);
    //     if (existing) document.head.removeChild(existing);
    //   });
    // };
  }, [
    isVisible,
    isAnimationP,
    animationType,
    animationDirection,
    animationEasing,
    animationIterations,
    animationDelay,
    isRevarsed,
  ]);

  // const getShakeTransform = (position, isReversedBool) => {
  //   const offset = isReversedBool ? -5 : 5;
  //   const reverseOffset = offset * -1;

  //   switch (animationDirection) {
  //     case "top":
  //     case "bottom":
  //       return position === "start"
  //         ? "translateY(0)"
  //         : position === "mid1"
  //         ? `translateY(${reverseOffset}px)`
  //         : position === "mid2"
  //         ? `translateY(${offset}px)`
  //         : position === "mid3"
  //         ? `translateY(${reverseOffset}px)`
  //         : "translateY(0)";

  //     case "left":
  //     case "right":
  //       return position === "start"
  //         ? "translateX(0)"
  //         : position === "mid1"
  //         ? `translateX(${reverseOffset}px)`
  //         : position === "mid2"
  //         ? `translateX(${offset}px)`
  //         : position === "mid3"
  //         ? `translateX(${reverseOffset}px)`
  //         : "translateX(0)";

  //     default:
  //       return position === "start"
  //         ? "translateY(0)"
  //         : position === "mid1"
  //         ? `translateY(${reverseOffset}px)`
  //         : position === "mid2"
  //         ? `translateY(${offset}px)`
  //         : position === "mid3"
  //         ? `translateY(${reverseOffset}px)`
  //         : "translateY(0)";
  //   }
  // };

  // const getFlipTransform = (position) => {
  //   const isReversedBool = isRevarsed === true || isRevarsed === "true";

  //   switch (animationDirection) {
  //     case "top":
  //       return position === "start"
  //         ? `rotateX(${isReversedBool ? "-180deg" : "0deg"})`
  //         : position === "middle"
  //         ? `rotateX(0deg)`
  //         : `rotateX(${isReversedBool ? "0deg" : "-180deg"})`;

  //     case "bottom":
  //       return position === "start"
  //         ? `rotateX(${isReversedBool ? "180deg" : "0deg"})`
  //         : position === "middle"
  //         ? `rotateX(0deg)`
  //         : `rotateX(${isReversedBool ? "0deg" : "180deg"})`;

  //     case "left":
  //       return position === "start"
  //         ? `rotateY(${isReversedBool ? "-180deg" : "0deg"})`
  //         : position === "middle"
  //         ? `rotateY(0deg)`
  //         : `rotateY(${isReversedBool ? "0deg" : "-180deg"})`;

  //     case "right":
  //       return position === "start"
  //         ? `rotateY(${isReversedBool ? "180deg" : "0deg"})`
  //         : position === "middle"
  //         ? `rotateY(0deg)`
  //         : `rotateY(${isReversedBool ? "0deg" : "180deg"})`;

  //     default:
  //       return position === "start"
  //         ? `rotateY(${isReversedBool ? "-180deg" : "0deg"})`
  //         : position === "middle"
  //         ? `rotateY(0deg)`
  //         : `rotateY(${isReversedBool ? "0deg" : "-180deg"})`;
  //   }
  // };

  const handleClick = () => {
    if (onClick === "Yes") {
      switch (action) {
        case "Navigate to":
          navigate(`/${navigation}`);
          break;
        default:
          break;
      }
    }
  };

  const matchStroke = tailwaindClasses.match(/stroke-\[(\d+px)\]/);
  const matchStrokeColor = tailwaindClasses.match(
    /strokeColor-\[#([0-9A-Fa-f]{6,8})\]/
  );
  const strokeWidth = matchStroke?.[1] ?? null;
  const fullStrokeColor = matchStrokeColor?.[1] ?? null;
  const strokeColor = fullStrokeColor
    ? `#${fullStrokeColor}` // keep all 6 or 8 hex characters
    : null;

  // Apply animation styles
  const paragraphStyle = {
    margin: "0px",
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      bgColor,
      bgUrl,
      color,
      overflow,
      onClick,
      zIndex,
      boxShadow,
    }),

    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),

    ...(strokeWidth && strokeColor
      ? {
          WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
          color: "transparent", // Only if outlined text is active
        }
      : {}),
    textDecorationLine: textDecorationLine,
    // ...(isAnimationP === "true" && !hasAnimated && { opacity: 0 }),
    ...(isAnimationP === "true" && animationType?.toLowerCase() !== "none" && !hasAnimated && { opacity: 0 }),
      ...(font ? { fontFamily: font } : {}), // ✅ FIX

  };

  //***********Shimmar Effect *************//
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // delay in ms

    return () => clearTimeout(timeout);
  }, []);

  //***********Shimmar Effect *************//

  const { totalItemsValue, itemsPerPageValue, currentPageValue } =
    usePagination();
  const totalPages = Math.ceil(totalItemsValue / itemsPerPageValue);

  useEffect(() => {
    if (Pagination == "true" && isNaN(parseInt(headerText)) === false) {
      const start = (currentPageValue - 1) * itemsPerPageValue + 1;
      const end = Math.min(
        currentPageValue * itemsPerPageValue,
        totalItemsValue
      );
      setheaderText(`${start} to ${end} of ${totalItemsValue}`);
    }
  }, [currentPageValue, itemsPerPageValue, totalItemsValue, Pagination]);

  return (
    <>
      <p
        ref={paragraphRef}
        className={`${tailwaindClasses}`}
       // style={paragraphStyle}
        style={{
          ...paragraphStyle,
          ...style
        }}
        onClick={onClick === "Yes" ? handleClick : undefined}

         dangerouslySetInnerHTML={{
          __html: String(Text ?? "").replace(/\n/g, "<br/>"),
        }}

      ></p>
    </>
  );
};

QParagraph.propTypes = {
  headerText: PropTypes.string.isRequired,
  fontSize: PropTypes.string,
  color: PropTypes.string,
  fontWeight: PropTypes.string,
  textAlign: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.string,
  positionedLeft: PropTypes.string,
  positionedTop: PropTypes.string,
  positionedRight: PropTypes.string,
  positionedBottom: PropTypes.string,
  fontFamily: PropTypes.string,
  fontStyle: PropTypes.string,
  paddingLeft: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingRight: PropTypes.string,
  paddingBottom: PropTypes.string,
  marginLeft: PropTypes.string,
  marginTop: PropTypes.string,
  marginRight: PropTypes.string,
  marginBottom: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  shadowColor: PropTypes.string,
  shadowBlurRadius: PropTypes.string,
  shadowOffsetX: PropTypes.string,
  shadowOffsetY: PropTypes.string,
  shadowSpreadRadius: PropTypes.string,
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
};

export default QParagraph;

QParagraph.displayName = "QParagraph";
