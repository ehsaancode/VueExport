import React, { useRef } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { useTableContext } from "../QTableContext";

const QTableRow = ({
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
  applyIntoTableCell = "",

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

  const { columnWidths } = useTableContext(); // ✅ access widths

  // Count number of children
  const childCount = React.Children.count(children);

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

  // Build dynamic grid class
  // const gridClass = `grid grid-cols-${childCount}`;
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
      {React.Children.map(children, (child, index) => {
        // Extract child classes
        let childClasses = child.props.tailwaindClasses || "";

        // Split into array and remove h-auto
        const childClassesArr = childClasses
          .split(" ")
          .filter((cls) => cls !== "h-auto");

        // Rejoin remaining child classes
        childClasses = childClassesArr.join(" ");

        // Split parent border classes into array
        const parentBorderClasses = (tailwaindClassesBorder || "").split(" ");

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

        // ✅ Step 1: Extract child + common classes
        const childClasse = (childClasses || "").split(" ").filter(Boolean);
        const commonClasses = (commonTailwaindClasses || "")
          .split(" ")
          .filter(Boolean);

        // ✅ Step 2: Remove duplicates from common
        const filteredCommon = commonClasses.filter(
          (cls) => !childClasse.includes(cls)
        );

        // ✅ Step 3: Merge (child first, then remaining common)
        const mergedClasses = [...childClasse, ...filteredCommon].join(" ");

        // ✅ Grab width for this column
        const colWidth = columnWidths[index] || "auto";

        return React.cloneElement(child, {
          tailwaindClasses: sanitizeClasses(
            `${applyIntoTableCell} ${finalBorderClasses} ${mergedClasses} w-[${colWidth}] overflow-hidden`
          ),
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

QTableRow.propTypes = {
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

QTableRow.displayName = "QTableRow";

export default QTableRow;
