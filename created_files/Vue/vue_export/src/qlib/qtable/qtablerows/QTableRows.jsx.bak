import React, { useRef } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";

const QTableRows = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  isImageFill,
  isAbsoluteValue,
  overflow,
  zIndex,
  // Navigation
  onClick = "",
  action = "",
  navigation = "",
  children,
  tailwaindClasses = "",
  commonTailwaindClasses = "",

  // ✅ Forwarded common props
  forwardCommonWidth,
  forwardCommonHeight,
  forwardCommonColor,
  forwardCommonBgColor,
  forwardCommonBgUrl,

  // ✅ Local optional common props
  widthCommon,
  heightCommon,
  colorCommon,
  bgColorCommon,
  bgUrlCommon,

  tailwaindClassesBorder,
}) => {
  const tableWrapperRef = useRef(null);
  const navigate = useNavigate();

  // Handle navigation click
  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to") {
      navigate(`/${navigation}`);
    }
  };

  // ✅ Inline styles with fallbacks
  const containerStyle = {
    ...generateStyle({
      width: width ?? forwardCommonWidth,
      height: height ?? forwardCommonHeight,
      color: color ?? forwardCommonColor,
      bgColor: bgColor ?? forwardCommonBgColor,
      bgUrl: bgUrl ?? forwardCommonBgUrl,
      isAbsoluteValue,
      isImageFill,
      overflow,
      onClick,
      zIndex,
    }),
  };

  // ✅ Utility to sanitize unwanted defaults
  const sanitizeClasses = (classes) =>
    (classes || "")
      .split(" ")
      .filter((cls) => {
        if (!cls) return false;

        // Explicit unwanted classes
        if (cls === "w-[auto]" || cls === "h-auto") return false;

        // Match responsive variants like sm:h-auto, md:h-auto, etc.
        if (/^[a-z]+:h-auto$/.test(cls)) return false;
        if (/^[a-z]+:w-\[auto\]$/.test(cls)) return false;

        return true;
      })
      .join(" ");

  return (
    <div
      ref={tableWrapperRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
      className={sanitizeClasses(tailwaindClasses)}
    >
      {React.Children.map(children, (child) => {
        // ✅ Step 1: Extract child + common classes
        const childClasse = (child.props.tailwaindClasses || "")
          .split(" ")
          .filter(Boolean);
        const commonClasses = (commonTailwaindClasses || "")
          .split(" ")
          .filter(Boolean);

        // ✅ Step 2: Remove duplicates from common
        const filteredCommon = commonClasses.filter(
          (cls) => !childClasse.includes(cls)
        );

         // Convert tailwaindClasses into array safely
        const tailwindClassesArr = Array.isArray(tailwaindClasses)
          ? tailwaindClasses
          : (tailwaindClasses ? tailwaindClasses.split(" ") : []);

        // ✅ Remove any class from tailwaindClasses that already exists in filteredCommon or childClasse
        const filteredTailwind = tailwindClassesArr.filter(
          (cls) => !filteredCommon.includes(cls) && !childClasse.includes(cls)
        );


          // ✅ Merge in order: child → filteredCommon → filteredTailwind
        const mergedClasses = [...childClasse, ...filteredCommon, ...filteredTailwind]
          .filter(Boolean)
          .join(" ");

        // ✅ Step 4: Clone element with merged + sanitized classes
        return React.cloneElement(child, {
          tailwaindClasses: sanitizeClasses(mergedClasses),
          // Forward your other props
          forwardCommonWidth: widthCommon,
          forwardCommonHeight: heightCommon,
          forwardCommonColor: colorCommon,
          forwardCommonBgColor: bgColorCommon,
          forwardCommonBgUrl: bgUrlCommon,
          tailwaindClassesBorder: tailwaindClassesBorder,
          applyIntoTableCell: commonTailwaindClasses,
        });
      })}
    </div>
  );
};

QTableRows.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  isAbsoluteValue: PropTypes.bool,
  overflow: PropTypes.string,
  zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  children: PropTypes.node,
  tailwaindClasses: PropTypes.string,
  commonTailwaindClasses: PropTypes.string,

  // ✅ Forwarded props
  forwardCommonWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forwardCommonHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  forwardCommonColor: PropTypes.string,
  forwardCommonBgColor: PropTypes.string,
  forwardCommonBgUrl: PropTypes.string,

  // ✅ Local common props
  widthCommon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heightCommon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colorCommon: PropTypes.string,
  bgColorCommon: PropTypes.string,
  bgUrlCommon: PropTypes.string,
};

QTableRows.displayName = "QTableRows";

export default QTableRows;
