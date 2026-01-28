export const runDynamicAnimations = async ({
  ref,
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
}) => {
  if (!isVisible || !isAnimationP) return;

  // const types = animationType.split(",").map((s) => s.trim());
  // const directions = animationDirection.split(",").map((s) => s.trim());
  // const easings = animationEasing.split(",").map((s) => s.trim());

  //convert to lowercase
  const types = animationType.split(",").map((s) => s.trim().toLowerCase());
  const directions = animationDirection.split(",").map((s) => s.trim().toLowerCase());
  const easings = animationEasing.split(",").map((s) => s.trim().toLowerCase());


  const iterations = animationIterations.split(",").map((s) => s.trim());
  const delays = animationDelay.split(",").map((s) => s.trim());
  const durations = (animationDuration || "1s").split(",").map((s) => s.trim());

  const reversedFlags =
    typeof isRevarsed === "string"
      ? isRevarsed.split(",").map((s) => s.trim())
      : [String(isRevarsed)];

  const maxValues = (maxValue || "").split(",").map((s) => s.trim());
  const minValues = (minValue || "").split(",").map((s) => s.trim());

  if (types.includes("rotate")) {
    document.body.style.overflowY = "hidden";
  }

  const getShakeTransform = (position, isReversedBool) => {
    const offset = isReversedBool ? -5 : 5;
    const reverseOffset = offset * -1;

    switch (animationDirection) {
      case "top":
      case "bottom":
        return position === "start"
          ? "translateY(0)"
          : position === "mid1"
          ? `translateY(${reverseOffset}px)`
          : position === "mid2"
          ? `translateY(${offset}px)`
          : position === "mid3"
          ? `translateY(${reverseOffset}px)`
          : "translateY(0)";

      case "left":
      case "right":
        return position === "start"
          ? "translateX(0)"
          : position === "mid1"
          ? `translateX(${reverseOffset}px)`
          : position === "mid2"
          ? `translateX(${offset}px)`
          : position === "mid3"
          ? `translateX(${reverseOffset}px)`
          : "translateX(0)";

      default:
        return position === "start"
          ? "translateY(0)"
          : position === "mid1"
          ? `translateY(${reverseOffset}px)`
          : position === "mid2"
          ? `translateY(${offset}px)`
          : position === "mid3"
          ? `translateY(${reverseOffset}px)`
          : "translateY(0)";
    }
  };

  const getBounceTransform = (stage, direction = "top", isReversed = false) => {
    const bounceDistance = stage === "mid" ? 20 : 0;
    const sign = (stage === "mid" ? 1 : 0) * (isReversed ? -1 : 1);

    switch (direction) {
      case "top":
        return `translateY(${sign * -bounceDistance}px)`;
      case "bottom":
        return `translateY(${sign * bounceDistance}px)`;
      case "left":
        return `translateX(${sign * -bounceDistance}px)`;
      case "right":
        return `translateX(${sign * bounceDistance}px)`;
      default:
        return `translateY(${sign * -bounceDistance}px)`; // default: top bounce
    }
  };

  const getScaleTranslate = (stage, direction = "top", isReversed = false) => {
    const distance = stage === "middle" ? 0 : 10;
    const sign = isReversed ? -1 : 1;
    const value = distance * sign;

    switch (direction) {
      case "top":
        return `translateY(${stage === "middle" ? "0" : -value}px)`;
      case "bottom":
        return `translateY(${stage === "middle" ? "0" : value}px)`;
      case "left":
        return `translateX(${stage === "middle" ? "0" : -value}px)`;
      case "right":
        return `translateX(${stage === "middle" ? "0" : value}px)`;
      default:
        return "";
    }
  };

  const getFlipTransform = (stage, direction = "left", isReversed = false) => {
    let angle;
    switch (stage) {
      case "start":
        angle = isReversed ? 180 : -180;
        break;
      case "middle":
        angle = 0;
        break;
      case "end":
        angle = isReversed ? -180 : 180;
        break;
      default:
        angle = 0;
    }

    switch (direction) {
      case "top":
      case "bottom":
        return `rotateX(${direction === "top" ? angle : -angle}deg)`;
      case "left":
      case "right":
      default:
        return `rotateY(${direction === "left" ? angle : -angle}deg)`;
    }
  };

  const getSkewAxis = (direction = "left") => {
    switch (direction) {
      case "top":
      case "bottom":
        return "Y"; // vertical skew
      case "left":
      case "right":
      default:
        return "X"; // horizontal skew
    }
  };

  const getZoomTranslate = (stage, direction = "top", isReversed = false) => {
    const distance = stage === "middle" ? 0 : 20;
    const sign = isReversed ? -1 : 1;
    const offset = distance * sign;

    switch (direction) {
      case "top":
        return `translateY(${-offset}px)`;
      case "bottom":
        return `translateY(${offset}px)`;
      case "left":
        return `translateX(${-offset}px)`;
      case "right":
        return `translateX(${offset}px)`;
      default:
        return ""; // No direction, pure zoom
    }
  };

  const getTranslateAxis = (direction = "left") => {
    return ["top", "bottom"].includes(direction) ? "Y" : "X";
  };

  const getTranslateValue = (direction = "left", isReversed = false) => {
    const value = isReversed ? -100 : 100;

    switch (direction) {
      case "top":
        return `${-value}%`;
      case "bottom":
        return `${value}%`;
      case "left":
        return `${-value}%`;
      case "right":
        return `${value}%`;
      default:
        return "0%";
    }
  };

  const runAnimationsSequentially = async () => {
    for (let i = 0; i < types.length; i++) {
      //  alert(types.length)
      const type = types[i];
      // const animationDirection = directions[i]=='none' ? 'top' : directions[i] || "none";
      const animationDirection = directions[i] || "none";
      const easing = easings[i] || "ease-in";
      const rawInvalidValues = [
        "loop",
        "",
        "null",
        "Null",
        null,
        undefined,
        "undefined",
      ];

      // Normalize all invalid values to lowercase strings
      const invalidValues = rawInvalidValues.map((v) =>
        (v ?? "").toString().toLowerCase()
      );

      // Normalize current iteration value
      const currentValue = (iterations[i] ?? "").toString().toLowerCase();

      // Final iteration decision
      const iteration = invalidValues.includes(currentValue)
        ? "infinite"
        : iterations[i] || "1";
      const delay = delays[i] || "1s";
      //nc
      const duration = durations[i] || "1s";
      // const duration = durations[i] * 1000 || "3s";

      const isReversedBool = reversedFlags[i] === "true";
      const delayInMs = parseFloat(delay) * 1000;
      const uniqueAnimationName = `anim-${type}-${animationDirection}-${i}`;
      const styleId = `style-${uniqueAnimationName}`;

      const translateAxis =
        animationDirection === "top" || animationDirection === "bottom"
          ? "Y"
          : animationDirection === "left" || animationDirection === "right"
          ? "X"
          : "";

      const translateValue =
        animationDirection === "top"
          ? "-100%"
          : animationDirection === "bottom"
          ? "100%"
          : animationDirection === "left"
          ? "-100%"
          : animationDirection === "right"
          ? "100%"
          : "0%";

      const animationKeyframes = {
        //nc
        slide: `
                @keyframes ${uniqueAnimationName} {
                  0% {
                    transform: translate${translateAxis}(${easing === "ease-in" || easing === "none" ? translateValue : "0%"
        });
        
                    opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"};
                  }
                  50% {
                    transform: translate${translateAxis}(0);
                    opacity: 1;
                  }
                  100% {
                    transform: translate${translateAxis}(${
          easing === "ease-out"
          
            ? translateValue
            : isReversedBool
            ? animationDirection === "top"
              ? "-100%"
              : animationDirection === "bottom"
              ? "100%"
              : animationDirection === "left"
              ? "-100%"
              : animationDirection === "right"
              ? "100%"
              : "0%"
            : "0%"
        });
                    opacity: ${
                      easing === "ease-out" || isReversedBool ? "0" : "1"
                    };
                  }
                }
                `,

        blur: `
                @keyframes ${uniqueAnimationName} {
                  0% {
                    transform: translate${translateAxis}(${
          easing === "ease-in" || easing === "none" ? translateValue : "0%"
        });
                    filter: blur(${
                      easing === "ease-in" || easing === "none"
                        ? "10px"
                        : isReversedBool
                        ? "0px"
                        : "0px"
                    });
                    opacity: ${
                      easing === "ease-in" || easing === "none" ? "0" : "1"
                    };
                  }

                  50% {
                    transform: translate${translateAxis}(0);
                    filter: blur(0px);
                    opacity: 1;
                  }

                  100% {
                    transform: translate${translateAxis}(${
          easing === "ease-out" || isReversedBool ? translateValue : "0%"
        });
                    filter: blur(${
                      easing === "ease-out" || isReversedBool ? "10px" : "0px"
                    });
                    opacity: ${
                      easing === "ease-out" || isReversedBool ? "0" : "1"
                    };
                  }
                }
              `,

        shake: `
          @keyframes ${uniqueAnimationName} {
            0% {
              transform: ${getShakeTransform(
                "start",
                isReversedBool,
                animationDirection
              )};
              opacity: ${easing === "ease-in" ? "0" : "1"};
            }
            25% {
              transform: ${getShakeTransform(
                "mid1",
                isReversedBool,
                animationDirection
              )};
            }
            50% {
              transform: ${getShakeTransform(
                "mid2",
                isReversedBool,
                animationDirection
              )};
            }
            75% {
              transform: ${getShakeTransform(
                "mid3",
                isReversedBool,
                animationDirection
              )};
            }
            100% {
              transform: ${getShakeTransform(
                "end",
                isReversedBool,
                animationDirection
              )};
              opacity: ${easing === "ease-out" ? "0" : "1"};
            }
          }
        `,

        fade: `
                @keyframes ${uniqueAnimationName} {
                  0% {
                    transform: translate${translateAxis}(${easing === "ease-in" || easing === "none" ? translateValue : "0%"
        });
                    opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
          };
                  }
                  50% {
                    transform: translate${translateAxis}(0%);
                    opacity: 1;
                  }
                  100% {
                    transform: translate${translateAxis}(${
          easing === "ease-out" ? translateValue : "0%"
        });
                    opacity: ${easing === "ease-out" ? "0" : "1"};
                  }
                }
              `,

        rotate: `
            @keyframes ${uniqueAnimationName} {
              0% {
                transform: rotate(0deg);
                opacity: ${easing === "ease-in" ? "0" : "1"}
              }
              100% {
                transform: rotate(${
                  animationDirection === "left" || animationDirection === "top"
                    ? "-360deg"
                    : "360deg"
                });
                opacity: ${easing === "ease-out" ? "0" : "1"};
              }
            }
          `,

        // scale: `
        //   @keyframes ${uniqueAnimationName} {
        //     0% {
        //       transform: scale(${easing === "ease-in" || easing === "none"
        //     ? isReversedBool
        //       ? maxValues[i] || "1.2"
        //       : minValues[i] || "0.8"
        //     : "1"
        //       }) ${getScaleTranslate(
        //   "start",
        //   animationDirection,
        //   isReversedBool
        // )};
        //       opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
        //   };
        //     }
        //     50% {
        //       transform: scale(1) ${getScaleTranslate(
        //         "middle",
        //         animationDirection,
        //         isReversedBool
        //       )};
        //       opacity: 1;
        //     }
        //     100% {
        //       transform: scale(${easing === "ease-out" ? (isReversedBool ? minValues[i] || "0.8" : maxValues[i] || "1.2") : "1"
        //       }) ${getScaleTranslate(
        //   "end",
        //   animationDirection,
        //   isReversedBool
        // )};
        //       opacity: ${easing === "ease-out" ? "0" : "1"};
        //     }
        //   }
        // `,

        scale: `
          @keyframes ${uniqueAnimationName} {
            0% {
              transform: scale(${isReversedBool ? maxValues[i] || "1.2" : minValues[i] || "0.8"
          }) ${getScaleTranslate("start", animationDirection, isReversedBool)};
              opacity: ${easing === "ease-in" || easing === "both" ? "0" : "1"
          };
            }
            50% {
              transform: scale(1) ${getScaleTranslate(
            "middle",
            animationDirection,
            isReversedBool
          )};
              opacity: 1;
            }
            100% {
              transform: scale(${isReversedBool ? minValues[i] || "0.8" : maxValues[i] || "1.2"
          }) ${getScaleTranslate("end", animationDirection, isReversedBool)};
              opacity: ${easing === "ease-out" || easing === "both" ? "0" : "1"};
            }
          }
        `,

        bounce: `
            @keyframes ${uniqueAnimationName} {
              0% {
                transform: ${getBounceTransform(
                  "start",
                  animationDirection,
                  isReversedBool
                )};
                opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
          };
              }
              50% {
                transform: ${getBounceTransform(
                  "mid",
                  animationDirection,
                  isReversedBool
                )};
                opacity: 1;
              }
              100% {
                transform: ${getBounceTransform(
                  "end",
                  animationDirection,
                  isReversedBool
                )};
                opacity: ${easing === "ease-out" ? "0" : "1"};
              }
            }
        `,

        flip: `
            @keyframes ${uniqueAnimationName} {
              0% {
                transform: perspective(400px) ${getFlipTransform(
                  "start",
                  animationDirection,
                  isReversedBool
                )};
                opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
          };
              }
              50% {
                transform: perspective(400px) ${getFlipTransform(
                  "middle",
                  animationDirection,
                  isReversedBool
                )};
                opacity: 1;
              }
              100% {
                transform: perspective(400px) ${getFlipTransform(
                  "end",
                  animationDirection,
                  isReversedBool
                )};
                opacity: ${easing === "ease-out" ? "0" : "1"};
              }
            }
        `,

        skew: `
          @keyframes ${uniqueAnimationName} {
            0% {
              transform: skew${getSkewAxis(animationDirection)}(${
          isReversedBool ? "-20deg" : "20deg"
        });
               opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
          };
            }
            50% {
              transform: skew${getSkewAxis(animationDirection)}(0deg);
              opacity: 1;
            }
            100% {
              transform: skew${getSkewAxis(animationDirection)}(${
          isReversedBool ? "20deg" : "0deg"
        });
              opacity: ${easing === "ease-out" ? "0" : "1"};
            }
          }
        `,

        zoom: `
          @keyframes ${uniqueAnimationName} {
            0% {
              transform: scale(${
                isReversedBool ? "1.5" : "0.5"
              }) ${getZoomTranslate(
          "start",
          animationDirection,
          isReversedBool
        )};
              opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
          };
            }
            50% {
              transform: scale(1) ${getZoomTranslate(
                "middle",
                animationDirection,
                isReversedBool
              )};
              opacity: 1;
            }
            100% {
              transform: scale(${
                isReversedBool ? "0.5" : "1.5"
              }) ${getZoomTranslate("end", animationDirection, isReversedBool)};
              opacity: ${easing === "ease-out" ? "0" : "1"};
            }
          }
      `,

        saturate: `
          @keyframes ${uniqueAnimationName} {
            0% {
              background: black;
              transform: translate${getTranslateAxis(animationDirection)}(${easing === "ease-in" || easing === "none"
            ? getTranslateValue(animationDirection, isReversedBool)
            : "0%"
        });
              filter: saturate(${isReversedBool ? "200%" : "50%"});
              opacity: ${easing === "ease-in" || easing === "none" ? "0" : "1"
          };
            }
            50% {
              background: black;
              transform: translate${getTranslateAxis(animationDirection)}(0);
              filter: saturate(100%);
              opacity: 1;
            }
            100% {
              transform: translate${getTranslateAxis(animationDirection)}(${
          easing === "ease-out"
            ? getTranslateValue(animationDirection, isReversedBool)
            : isReversedBool
            ? getTranslateValue(animationDirection, true)
            : "0%"
        });
              filter: saturate(${isReversedBool ? "50%" : "200%"});
              opacity: ${easing === "ease-out" || isReversedBool ? "0" : "1"};
            }
          }
        `,
      };

      const keyframes = animationKeyframes[type];
      if (!keyframes) continue;

      if (!document.getElementById(styleId)) {
        const styleTag = document.createElement("style");
        styleTag.id = styleId;
        styleTag.innerHTML = keyframes;
        document.head.appendChild(styleTag);
      }

      const el = ref.current;

      if (el) {
        // Step 1: Reset styles cleanly
        el.style.animation = "none";
        el.style.opacity = "0";

        // Step 2: Force DOM reflow
        void el.offsetWidth;

        // Step 3: Assign animation properties via shorthand OR individually
        // const fullAnimation = `${uniqueAnimationName} ${duration}  ${easing} ${delay} ${iteration} forwards`;
        
        //nc
        const validEasing = !easing || easing === "none" ? "linear" : easing;
        // 👇 Add conditional logic here
        const fullAnimation =
          type === "rotate"
            ? `${uniqueAnimationName} ${duration} linear ${delay} ${iteration} both`
            // : `${uniqueAnimationName} ${duration} ${easing} ${delay} ${iteration} forwards`;
            //nc
            : `${uniqueAnimationName} ${duration} ${validEasing} ${delay} ${iteration} both`;

        // Step 4: Apply after DOM settles (microtask)
        requestAnimationFrame(() => {
          el.style.animation = fullAnimation;
          el.style.opacity = "1";
        });
      }

      // if (iteration !== "infinite") {
      //   await new Promise((res) => setTimeout(res, delayInMs + 1100));
      // }

      const durationInMs = parseFloat(duration) * 1000 || 1000;
      const repeatCount =
        iteration === "infinite" ? 1 : parseInt(iteration) || 1;
      const totalDuration = delayInMs + durationInMs * repeatCount;

      if (iteration !== "infinite") {
        await new Promise((res) => setTimeout(res, totalDuration));
      }
    }
  };

  runAnimationsSequentially();

  return () => {
    document.body.style.overflowY = "auto";

    types.forEach((type, i) => {
      const animationDirection = directions[i] || "none";
      const styleId = `style-anim-${type}-${animationDirection}-${i}`;
      const existing = document.getElementById(styleId);
      if (existing) document.head.removeChild(existing);
    });
  };
};