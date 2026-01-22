import React, { useRef } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { TableProvider } from "../QTableContext";

const QTable = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  isImageFill,
  isAbsoluteValue,
  overflow,
  zIndex,
  onClick = "",
  action = "",
  navigation = "",
  children,
  tailwaindClasses = "",
  commonTailwaindClasses = "",

  forwardCommonWidth,
  forwardCommonHeight,
  forwardCommonColor,
  forwardCommonBgColor,
  forwardCommonBgUrl,

  widthCommon,
  heightCommon,
  colorCommon,
  bgColorCommon,
  bgUrlCommon,
}) => {
  const tableWrapperRef = useRef(null);
  const navigate = useNavigate();

  // Navigation handler
  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to") {
      navigate(`/${navigation}`);
    }
  };

  // Inline styles with fallbacks
  const containerStyle = {
    ...generateStyle({
      width: width ?? forwardCommonWidth,
      height: height ?? forwardCommonHeight,
      color: color ?? forwardCommonColor,
     // bgColor: bgColor ?? forwardCommonBgColor,
      bgUrl: bgUrl ?? forwardCommonBgUrl,
      isAbsoluteValue,
      isImageFill,
      overflow,
      onClick,
      zIndex,
    }),
    display: "flex",
    flexDirection: "column",
    
  };

  // ✅ Extract only border-related Tailwind classes
  const borderClasses = tailwaindClasses
    .split(" ")
    .filter((cls) => cls.startsWith("border"))
    .join(" ");

  return (
    <TableProvider>
      <div
        ref={tableWrapperRef}
        onClick={onClick === "Yes" ? handleClick : undefined}
        style={containerStyle}
        className={tailwaindClasses}
      >
        {React.Children.map(children, (child) => {
          const childClasses = (child.props.tailwaindClasses || "")
            .split(" ")
            .filter(Boolean);
          const commonClasses = (commonTailwaindClasses || "")
            .split(" ")
            .filter(Boolean);

          // Remove any class from commonTailwaindClasses that already exists in child
          const filteredCommon = commonClasses.filter(
            (cls) => !childClasses.includes(cls)
          );

          // Merge child classes first, then remaining common classes
          const mergedClasses = [...childClasses, ...filteredCommon].join(" ");

          return React.cloneElement(child, {
            tailwaindClasses: mergedClasses,
            tailwaindClassesBorder: borderClasses, // ✅ Pass border classes separately
            forwardCommonWidth: widthCommon,
            forwardCommonHeight: heightCommon,
            forwardCommonColor: colorCommon,
            forwardCommonBgColor: bgColorCommon,
            forwardCommonBgUrl: bgUrlCommon,
          });
        })}
      </div>
    </TableProvider>
  );
};

QTable.propTypes = {
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
  forwardCommonWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forwardCommonHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  forwardCommonColor: PropTypes.string,
  forwardCommonBgColor: PropTypes.string,
  forwardCommonBgUrl: PropTypes.string,
  widthCommon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heightCommon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colorCommon: PropTypes.string,
  bgColorCommon: PropTypes.string,
  bgUrlCommon: PropTypes.string,
};

QTable.displayName = "QTable";

export default QTable;
