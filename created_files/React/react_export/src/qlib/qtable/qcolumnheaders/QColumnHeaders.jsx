import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useTableContext } from "../QTableContext";

const QColumnHeaders = ({
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
  forwardCommonText,

  // ✅ Local common props
  widthCommon,
  heightCommon,
  colorCommon,
  bgColorCommon,
  bgUrlCommon,

  tailwaindClassesBorder,
}) => {
  const tableWrapperRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Local state for column widths

  const { setColumnWidths } = useTableContext();

  // Count children for grid layout
  const childCount = React.Children.count(children);

  useEffect(() => {
    const widths = React.Children.map(children, (child) => {
      const tw = child?.props?.tailwaindClasses || "";
      const match = tw.match(/w-\[(.+?)\]/);
      return child?.props?.width || (match ? match[1] : "auto");
    });

    setColumnWidths(widths);
  }, [children, setColumnWidths]);

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
    // display: "grid",
    // gridTemplateColumns: `repeat(${childCount}, minmax(auto, auto))`,
  };

  //const gridClass = `grid grid-cols-${childCount}`;
  const gridClass = `flex flex-row`;

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
      className={`${tailwaindClasses} ${gridClass}`}
    >
      {React.Children.map(children, (child) => {
        // Extract child classes
        const childClasses = child.props.tailwaindClasses || "";

        // Convert all to clean arrays
        const childClasse = (child.props.tailwaindClasses || "")
          .split(" ")
          .filter(Boolean);

        const commonClasses = (commonTailwaindClasses || "")
          .split(" ")
          .filter(Boolean);

        // Remove any class from commonTailwaindClasses that already exists in child
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

        

        // Split both parent border classes and child classes into arrays
        const parentBorderClasses = (tailwaindClassesBorder || "").split(" ");
        const childClassesArr = childClasses.split(" ");

        // ✅ Filter out border classes already present in child
        const filteredBorderClasses = parentBorderClasses.filter(
          (cls) =>
            !childClassesArr.some(
              (childCls) =>
                (cls.startsWith("border-t") &&
                  childCls.startsWith("border-t")) ||
                (cls.startsWith("border-r") &&
                  childCls.startsWith("border-r")) ||
                (cls.startsWith("border-b") &&
                  childCls.startsWith("border-b")) ||
                (cls.startsWith("border-l") && childCls.startsWith("border-l"))
            )
        );

        const finalBorderClasses = filteredBorderClasses.join(" ");

        let margedChildClasses = `${mergedClasses} ${finalBorderClasses}`;
        // Sanitize unwanted defaults
        margedChildClasses = sanitizeClasses(margedChildClasses);

        return React.cloneElement(child, {
          tailwaindClasses: `${margedChildClasses || ""} overflow-hidden`,
          forwardCommonWidth: widthCommon,
          forwardCommonHeight: heightCommon,
          forwardCommonColor: colorCommon,
          forwardCommonBgColor: bgColorCommon,
          forwardCommonBgUrl: bgUrlCommon,
        });
      })}
    </div>
  );
};

QColumnHeaders.propTypes = {
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

QColumnHeaders.displayName = "QColumnHeaders";

export default QColumnHeaders;
