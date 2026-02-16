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
  midValue
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
  const midValues = (midValue || "").split(",").map((s) => s.trim());

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

  //new animation update
  const animationConfigs = {
    zoom: {
      name: "ZOOM",
      minRange: { default: 50 },
      midRange: { default: 120 },
      maxRange: { default: 100 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: scale(${min / 100}); }\n  50%  { transform: scale(${
          mid / 100
        }); }\n  100% { transform: scale(${max / 100}); }`,
    },
    fade: {
      name: "FADE",
      minRange: { default: 0 },
      midRange: { default: 50 },
      maxRange: { default: 100 },
      getKeyframes: (min, mid, max) =>
        `  0%   { opacity: ${min / 100}; }\n  100% { opacity: ${max / 100}; }`,
    },
    slideleftright: {
      name: "SLIDE L↔R",
      minRange: { default: -200 },
      midRange: { default: 0 },
      maxRange: { default: 200 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateX(${min}px); }\n  50%  { transform: translateX(${mid}px); }\n  100% { transform: translateX(${max}px); }`,
    },
    slideinleft: {
      name: "SLIDE IN←",
      minRange: { default: -200 },
      midRange: { default: -100 },
      maxRange: { default: 0 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateX(${min}px); opacity: 0; }\n  50%  { transform: translateX(${mid}px); opacity: 0.5; }\n  100% { transform: translateX(${max}px); opacity: 1; }`,
    },
    slideinright: {
      name: "SLIDE IN→",
      minRange: { default: 200 },
      midRange: { default: 100 },
      maxRange: { default: 0 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateX(${min}px); opacity: 0; }\n  50%  { transform: translateX(${mid}px); opacity: 0.5; }\n  100% { transform: translateX(${max}px); opacity: 1; }`,
    },
    slideoutleft: {
      name: "SLIDE OUT←",
      minRange: { default: 0 },
      midRange: { default: -100 },
      maxRange: { default: -200 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateX(${min}px); opacity: 1; }\n  50%  { transform: translateX(${mid}px); opacity: 0.5; }\n  100% { transform: translateX(${max}px); opacity: 0; }`,
    },
    slideoutright: {
      name: "SLIDE OUT→",
      minRange: { default: 0 },
      midRange: { default: 100 },
      maxRange: { default: 200 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateX(${min}px); opacity: 1; }\n  50%  { transform: translateX(${mid}px); opacity: 0.5; }\n  100% { transform: translateX(${max}px); opacity: 0; }`,
    },
    slideupdown: {
      name: "SLIDE U↔D",
      minRange: { default: -200 },
      midRange: { default: 50 },
      maxRange: { default: 0 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateY(${min}px); }\n  50%  { transform: translateY(${mid}px); }\n  100% { transform: translateY(${max}px); }`,
    },
    slideintop: {
      name: "SLIDE IN↓",
      minRange: { default: -200 },
      midRange: { default: -100 },
      maxRange: { default: 0 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateY(${min}px); opacity: 0; }\n  50%  { transform: translateY(${mid}px); opacity: 0.5; }\n  100% { transform: translateY(${max}px); opacity: 1; }`,
    },
    slideinbottom: {
      name: "SLIDE IN↑",
      minRange: { default: 200 },
      midRange: { default: 100 },
      maxRange: { default: 0 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateY(${min}px); opacity: 0; }\n  50%  { transform: translateY(${mid}px); opacity: 0.5; }\n  100% { transform: translateY(${max}px); opacity: 1; }`,
    },
    slideouttop: {
      name: "SLIDE OUT↑",
      minRange: { default: 0 },
      midRange: { default: -100 },
      maxRange: { default: -200 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateY(${min}px); opacity: 1; }\n  50%  { transform: translateY(${mid}px); opacity: 0.5; }\n  100% { transform: translateY(${max}px); opacity: 0; }`,
    },
    slideoutbottom: {
      name: "SLIDE OUT↓",
      minRange: { default: 0 },
      midRange: { default: 100 },
      maxRange: { default: 200 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: translateY(${min}px); opacity: 1; }\n  50%  { transform: translateY(${mid}px); opacity: 0.5; }\n  100% { transform: translateY(${max}px); opacity: 0; }`,
    },
    blur: {
      name: "BLUR",
      minRange: { default: 0 },
      midRange: { default: 5 },
      maxRange: { default: 10 },
      getKeyframes: (min, mid, max) =>
        `  0%   { filter: blur(${min}px); }\n  50%  { filter: blur(${mid}px); }\n  100% { filter: blur(${max}px); }`,
    },
    rotate: {
      name: "ROTATE",
      minRange: { default: 0 },
      midRange: { default: 180 },
      maxRange: { default: 360 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: rotate(${min}deg); }\n  50%  { transform: rotate(${mid}deg); }\n  100% { transform: rotate(${max}deg); }`,
    },
    shake: {
      name: "SHAKE",
      minRange: { default: -20 },
      midRange: { default: 0 },
      maxRange: { default: 20 },
      getKeyframes: (min, mid, max) =>
        `  0%, 100% { transform: translateX(0); }\n  10%, 30%, 50%, 70%, 90% { transform: translateX(${min}px); }\n  20%, 40%, 60%, 80% { transform: translateX(${max}px); }`,
    },
    flipright: {
      name: "FLIP ➡️",
      minRange: { default: 0 },
      midRange: { default: 90 },
      maxRange: { default: 180 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: rotateY(${min}deg); }\n  50%  { transform: rotateY(${mid}deg); }\n  100% { transform: rotateY(${max}deg); }`,
    },
    flipleft: {
      name: "FLIP ⬅️",
      minRange: { default: 0 },
      midRange: { default: -90 },
      maxRange: { default: -180 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: rotateY(${min}deg); }\n  50%  { transform: rotateY(${mid}deg); }\n  100% { transform: rotateY(${max}deg); }`,
    },
    fliptop: {
      name: "FLIP ⬆️",
      minRange: { default: 0 },
      midRange: { default: 90 },
      maxRange: { default: 180 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: rotateX(${min}deg); }\n  50%  { transform: rotateX(${mid}deg); }\n  100% { transform: rotateX(${max}deg); }`,
    },
    flipbottom: {
      name: "FLIP ⬇️",
      minRange: { default: 0 },
      midRange: { default: -90 },
      maxRange: { default: -180 },
      getKeyframes: (min, mid, max) =>
        `  0%   { transform: rotateX(${min}deg); }\n  50%  { transform: rotateX(${mid}deg); }\n  100% { transform: rotateX(${max}deg); }`,
    },
    saturate: {
      name: "SATURATE",
      minRange: { default: 0 },
      midRange: { default: 100 },
      maxRange: { default: 200 },
      getKeyframes: (min, mid, max) =>
        `  0%   { filter: saturate(${min}%); }\n  50%  { filter: saturate(${max}%); }\n  100% { filter: saturate(${min}%); }`,
    },
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
      // const uniqueAnimationName = `anim-${type}-${animationDirection}-${i}`;

      
      // Values signature for uniqueness
      const valsSignature = `${maxValues[i] || ''}-${minValues[i] || ''}-${midValues[i] || ''}`;
      
      const uniqueAnimationName = `anim-${type}-${animationDirection}-${i}-${valsSignature.replace(/[^a-zA-Z0-9-]/g, "")}`;
      
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

       // Resolve keyframes using animationConfigs if available
      let keyframes = "";
      if (animationConfigs[type]) {
        const config = animationConfigs[type];
        const min =
          minValues[i] !== undefined && minValues[i] !== ""
            ? parseFloat(minValues[i])
            : config.minRange.default;
        const mid =
          midValues[i] !== undefined && midValues[i] !== ""
            ? parseFloat(midValues[i])
            : config.midRange?.default ??
              (min +
                (maxValues[i]
                  ? parseFloat(maxValues[i])
                  : config.maxRange.default)) /
                2;
        const max =
          maxValues[i] !== undefined && maxValues[i] !== ""
            ? parseFloat(maxValues[i])
            : config.maxRange.default;

        keyframes = `
          @keyframes ${uniqueAnimationName} {
            ${config.getKeyframes(min, mid, max)}
          }
        `;
      } else {
        const legacyKeyframes = {
          slide: `
                @keyframes ${uniqueAnimationName} {
                  0% {
                    transform: translate${translateAxis}(${
            easing === "ease-in" || easing === "none" ? translateValue : "0%"
          });
        
                    opacity: ${
                      easing === "ease-in" || easing === "none" ? "0" : "1"
                    };
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

          bounce: `
            @keyframes ${uniqueAnimationName} {
              0% {
                transform: ${getBounceTransform(
                  "start",
                  animationDirection,
                  isReversedBool
                )};
                opacity: ${
                  easing === "ease-in" || easing === "none" ? "0" : "1"
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
                opacity: ${
                  easing === "ease-in" || easing === "none" ? "0" : "1"
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
               opacity: ${
                 easing === "ease-in" || easing === "none" ? "0" : "1"
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

          scale: `
          @keyframes ${uniqueAnimationName} {
            0% {
              transform: scale(${
                isReversedBool ? maxValues[i] || "1.2" : minValues[i] || "0.8"
              }) ${getScaleTranslate(
            "start",
            animationDirection,
            isReversedBool
          )};
              opacity: ${
                easing === "ease-in" || easing === "both" ? "0" : "1"
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
              transform: scale(${
                isReversedBool ? minValues[i] || "0.8" : maxValues[i] || "1.2"
              }) ${getScaleTranslate(
            "end",
            animationDirection,
            isReversedBool
          )};
              opacity: ${
                easing === "ease-out" || easing === "both" ? "0" : "1"
              };
            }
          }
        `,
        };
        keyframes = legacyKeyframes[type];
      }
      if (!keyframes) continue;
      
      const animationKeyframes = keyframes; // Dummy variable to keep logic alignment if needed, but actually we use 'keyframes' below

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

    // Clean up styles
    types.forEach((type, i) => {
      const animationDirection = directions[i] || "none";
      const valsSignature = `${maxValues[i] || ''}-${minValues[i] || ''}-${midValues[i] || ''}`;
      const uniqueAnimationName = `anim-${type}-${animationDirection}-${i}-${valsSignature.replace(/[^a-zA-Z0-9-]/g, "")}`;
      const styleId = `style-${uniqueAnimationName}`;
      
      // Caution: Removing styles might affect other elements using the same animation if not carefully managed.
      // However, since we made IDs unique by values, it should be safe unless multiple elements have exact same values and one unmounts.
      //Ideally we reference count styles, but for now we might leave them or remove them. 
      //If we remove them, and another component is using them, that component's animation breaks.
      //Given the 'uniqueAnimationName' includes params, collisions are improved but duplicates are possible.
      //Safest is NOT to remove styles, or use ref counting.
      //For now, let's KEEP the existing removal logic but update ID to match creation.
      
      const existing = document.getElementById(styleId);
      if (existing) {
         // document.head.removeChild(existing); // Commented out to prevent removing shared styles
      }
    });
  };
};