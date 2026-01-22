
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";

// import {
//   get,
//   subscribe,
//   setFormErrorSet,
//   getPaginationValues,
//   setPaginationCurrentPage,
// } from "../../store";

// import { generateStyle, HexToFilter } from "../../utils/helper";
// import { runDynamicAnimations } from "../../utils/animationUtils";

// const QIcon = ({
//   height,
//   width,
//   bgColor,
//   isAbsoluteValue,
//   imageFit,
//   alt,
//   bgUrl,
//   isImageFill,
//   action = "",
//   navigation = "",
//   isAnimationP,
//   animationEasing,
//   animationDirection,
//   animationType,
//   animationIterations,
//   animationDelay,
//   animationDuration,
//   isRevarsed,
//   shadowOffsetX,
//   shadowOffsetY,
//   shadowBlurRadius,
//   shadowSpreadRadius = "0px",
//   shadowColor,
//   overflow = "",
//   zIndex,
//   iconLink,
//   Pagination,
//   taggedKey,
//   tailwaindClasses,
//   boxShadow,
//   foreground,
//   useCase,
//   cms_form_Id,
//   cms_form_input_Id,
// }) => {
//   const iconRef = useRef(null);
//   const navigate = useNavigate();

//   /** --------------------------
//    * Pagination Logic
//    -------------------------- */
//   const [paginationValues, setPaginationValuesState] = useState({
//     totalItemsValue: 0,
//     itemsPerPageValue: 5,
//     currentPageValue: 1,
//   });

//   useEffect(() => {
//     const update = () => setPaginationValuesState(getPaginationValues());
//     update();

//     const int = setInterval(update, 120);
//     return () => clearInterval(int);
//   }, []);

//   const { totalItemsValue, itemsPerPageValue, currentPageValue } =
//     paginationValues;

//   const canNextPage = currentPageValue < Math.ceil(totalItemsValue / itemsPerPageValue);
//   const canPreviousPage = currentPageValue > 1;

//   /** --------------------------
//    * Animation on viewport
//    -------------------------- */
//   const [isVisible, setIsVisible] = useState(false);
//   const [hasAnimated, setHasAnimated] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !hasAnimated) {
//           setIsVisible(true);
//           setHasAnimated(true);
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (iconRef.current) observer.observe(iconRef.current);

//     return () => iconRef.current && observer.unobserve(iconRef.current);
//   }, [hasAnimated]);

//   useEffect(() => {
//     if (isAnimationP === "true") {
//       runDynamicAnimations({
//         ref: iconRef,
//         isVisible,
//         animationType,
//         animationDirection,
//         animationEasing,
//         animationIterations,
//         animationDelay,
//         animationDuration,
//         isRevarsed,
//       });
//     }
//   }, [isVisible]);

//   /** --------------------------
//    * Generate Image Styles
//    -------------------------- */
//   const baseImageStyle = useMemo(
//     () =>
//       generateStyle({
//         width,
//         height,
//         isAbsoluteValue,
//         bgColor,
//         bgUrl,
//         isImageFill,
//         overflow,
//         zIndex,
//         imageFit,
//         boxShadow,
//         ...(foreground && {
//           background: foreground,
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }),
//       }),
//     [width, height, isAbsoluteValue, bgColor, bgUrl, isImageFill, overflow, zIndex, imageFit, boxShadow, foreground]
//   );

//   const imageStyle = {
//     ...baseImageStyle,
//     cursor: Pagination === "true" ? "pointer" : "default",
//   };

//   const imageStyle1 = {
//     ...imageStyle,
//     cursor: !canNextPage ? "not-allowed" : "pointer",
//     opacity: !canNextPage ? 0.5 : 1,
//     pointerEvents: !canNextPage ? "none" : "auto",
//   };

//   const imageStyle2 = {
//     ...imageStyle,
//     cursor: !canPreviousPage ? "not-allowed" : "pointer",
//     opacity: !canPreviousPage ? 0.5 : 1,
//     pointerEvents: !canPreviousPage ? "none" : "auto",
//   };

//   /** --------------------------
//    * Error Set & Trailing Icon Logic
//    -------------------------- */
//   const [selectedErrorSet, setSelectedErrorSet] = useState(null);
//   const [clickIndexState, setClickIndexState] = useState(false);

//   const getSelectedErrorSet = useCallback(() => {
//     const global = get("formErrorSet");
//     return global?.[cms_form_Id]?.[cms_form_input_Id];
//   }, [cms_form_Id, cms_form_input_Id]);

//   useEffect(() => {
//     const update = () => {
//       const formData = getSelectedErrorSet();
//       if (formData) setSelectedErrorSet(formData);
//     };

//     update();
//     const unsub = subscribe(update);
//     return () => unsub();
//   }, [getSelectedErrorSet]);

//   const onClick = () => {
//     if (useCase === "trailingIcon") {
//       const newValue = !clickIndexState;
//       setClickIndexState(newValue);

//       const updatedErrorSet = {
//         ...(selectedErrorSet ?? {}),
//         clickValue: newValue,
//       };

//       setFormErrorSet({
//         cms_form_Id,
//         cmsFormInputLabel: cms_form_input_Id,
//         errorSet: updatedErrorSet,
//       });

//       setSelectedErrorSet(updatedErrorSet);
//       return;
//     }

//     /** Pagination Controls */
//     if (Pagination === "true") {
//       if (taggedKey === "increment" && canNextPage) {
//         setPaginationCurrentPage(currentPageValue + 1);
//       } else if (taggedKey === "decrement" && canPreviousPage) {
//         setPaginationCurrentPage(currentPageValue - 1);
//       }
//       return;
//     }

//     /** Navigation Action */
//     if (navigation) navigate(navigation);
//   };

//   /** -------------------------- */
//   return (
//     <img
//       ref={iconRef}
//       src={iconLink}
//       alt={alt}
//       onClick={onClick}
//       className={tailwaindClasses || ""}
//       style={
//         taggedKey === "increment"
//           ? imageStyle1
//           : taggedKey === "decrement"
//           ? imageStyle2
//           : imageStyle
//       }
//     />
//   );
// };

// QIcon.propTypes = {
//   height: PropTypes.string,
//   width: PropTypes.string,
//   bgColor: PropTypes.string,
//   imageFit: PropTypes.string,
//   alt: PropTypes.string,
//   iconLink: PropTypes.string,
//   Pagination: PropTypes.string,
//   taggedKey: PropTypes.string,
//   tailwaindClasses: PropTypes.string,
//   foreground: PropTypes.string,
//   useCase: PropTypes.string,
//   cms_form_Id: PropTypes.string,
//   cms_form_input_Id: PropTypes.string,
// };

// export default QIcon;
// QIcon.displayName = "QIcon";



import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import {
  get,
  subscribe,
  setFormErrorSet,
  getPaginationValues,
  setPaginationCurrentPage,
} from "../../store";

import { generateStyle } from "../../utils/helper";
import { runDynamicAnimations } from "../../utils/animationUtils";

const QIcon = ({
  height,
  width,
  bgColor,
  isAbsoluteValue,
  imageFit,
  alt,
  bgUrl,
  isImageFill,
  action = "",
  navigation = "",
  isAnimationP,
  animationEasing,
  animationDirection,
  animationType,
  animationIterations,
  animationDelay,
  animationDuration,
  isRevarsed,
  maxValue,
  minValue,
  shadowOffsetX,
  shadowOffsetY,
  shadowBlurRadius,
  shadowSpreadRadius = "0px",
  shadowColor,
  overflow = "",
  zIndex,
  iconLink,
  Pagination,
  taggedKey,
  tailwaindClasses,
  boxShadow,
  foreground,
  useCase,
  cms_form_Id,
  cms_form_input_Id,

  // ⬇⬇ NEW PROP (BackDrop injects this)
  onClick: externalOnClick,
}) => {
  const iconRef = useRef(null);
  const navigate = useNavigate();

  /** Pagination state */
  const [paginationValues, setPaginationValuesState] = useState({
    totalItemsValue: 0,
    itemsPerPageValue: 5,
    currentPageValue: 1,
  });

  useEffect(() => {
    const update = () => setPaginationValuesState(getPaginationValues());
    update();
    const int = setInterval(update, 120);
    return () => clearInterval(int);
  }, []);

  const { totalItemsValue, itemsPerPageValue, currentPageValue } = paginationValues;

  const canNextPage = currentPageValue < Math.ceil(totalItemsValue / itemsPerPageValue);
  const canPreviousPage = currentPageValue > 1;

  /** Animation on scroll */
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsVisible(true);
        setHasAnimated(true);
      }
    });

    if (iconRef.current) observer.observe(iconRef.current);
    return () => iconRef.current && observer.unobserve(iconRef.current);
  }, [hasAnimated]);

  useEffect(() => {
    if (isAnimationP === "true") {
      runDynamicAnimations({
        ref: iconRef,
        isVisible,
        animationType,
        animationDirection,
        animationEasing,
        animationIterations,
        animationDelay,
        animationDuration,
        isRevarsed,
        maxValue,
        minValue,
      });
    }
  }, [isVisible]);

  /** style logic */
  const baseImageStyle = useMemo(
    () =>
      generateStyle({
        width,
        height,
        isAbsoluteValue,
        bgColor,
        bgUrl,
        isImageFill,
        overflow,
        zIndex,
        imageFit,
        boxShadow,
        ...(foreground && {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }),
      }),
    [width, height, isAbsoluteValue, bgColor, bgUrl, isImageFill, overflow, zIndex, imageFit, boxShadow, foreground]
  );

  const imageStyle = { ...baseImageStyle, cursor: "pointer" };

  const imageStyle1 = {
    ...imageStyle,
    cursor: !canNextPage ? "not-allowed" : "pointer",
    opacity: !canNextPage ? 0.5 : 1,
    pointerEvents: !canNextPage ? "none" : "auto",
  };

  const imageStyle2 = {
    ...imageStyle,
    cursor: !canPreviousPage ? "not-allowed" : "pointer",
    opacity: !canPreviousPage ? 0.5 : 1,
    pointerEvents: !canPreviousPage ? "none" : "auto",
  };

  /** trailing icon */
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);
  const [clickIndexState, setClickIndexState] = useState(false);

  const getSelectedErrorSet = useCallback(() => {
    const global = get("formErrorSet");
    return global?.[cms_form_Id]?.[cms_form_input_Id];
  }, [cms_form_Id, cms_form_input_Id]);

  useEffect(() => {
    const update = () => {
      const formData = getSelectedErrorSet();
      if (formData) setSelectedErrorSet(formData);
    };
    update();
    const unsub = subscribe(update);
    return () => unsub();
  }, [getSelectedErrorSet]);

  /** -------------------------
   * INTERNAL CLICK HANDLER
   -------------------------- */
  const handleInternalClick = () => {
    // trailing icon
    if (useCase === "trailingIcon") {
      const newValue = !clickIndexState;
      setClickIndexState(newValue);

      const updatedErrorSet = {
        ...(selectedErrorSet ?? {}),
        clickValue: newValue,
      };

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel: cms_form_input_Id,
        errorSet: updatedErrorSet,
      });

      setSelectedErrorSet(updatedErrorSet);
      return;
    }

    // pagination
    if (Pagination === "true") {
      if (taggedKey === "increment" && canNextPage) {
        setPaginationCurrentPage(currentPageValue + 1);
      } else if (taggedKey === "decrement" && canPreviousPage) {
        setPaginationCurrentPage(currentPageValue - 1);
      }
      return;
    }

    // normal navigation
    if (navigation) navigate(navigation);
  };

  /** -------------------------
   * FINAL CLICK HANDLER
   -------------------------- */
  const handleClick = (e) => {
    // 1. Run gallery/backdrop click first (close/next/prev)
    if (externalOnClick) externalOnClick(e);

    // 2. Run internal click logic (pagination/trailing/navigation)
    handleInternalClick(e);
  };

  const hasForeground = (foreground && foreground !== "undefined") || tailwaindClasses?.includes("text-");

  const activeStyle =
    taggedKey === "increment"
      ? imageStyle1
      : taggedKey === "decrement"
        ? imageStyle2
        : imageStyle;

  if (hasForeground) {
    const fgStyle =
      foreground && foreground !== "undefined"
        ? { background: foreground }
        : { backgroundColor: "currentColor" };

    return (
      <div
        ref={iconRef}
        aria-label={alt}
        role="img"
        onClick={handleClick}
        className={tailwaindClasses || ""}
        style={{
          ...activeStyle,
          display: activeStyle.display || "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            maskImage: `url(${iconLink})`,
            WebkitMaskImage: `url(${iconLink})`,
            maskSize: imageFit === "cover" ? "cover" : imageFit === "fill" ? "100% 100%" : "contain",
            WebkitMaskSize: imageFit === "cover" ? "cover" : imageFit === "fill" ? "100% 100%" : "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            ...fgStyle,
          }}
        />
      </div>
    );
  }

  return (
    <img
      ref={iconRef}
      src={iconLink}
      alt={alt}
      onClick={handleClick}
      className={tailwaindClasses || ""}
      style={activeStyle}
    />
  );
};

QIcon.displayName = "QIcon";
export default QIcon;
