import React, { useRef } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";

const QTableWrapper = ({
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

  // ✅ Common props
  widthCommon,
  heightCommon,
  colorCommon,
  bgColorCommon,
  bgUrlCommon,
}) => {
  const tableWrapperRef = useRef(null);
  const navigate = useNavigate();

  // Handle navigation click
  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to") {
      navigate(`/${navigation}`);
    }
  };

  // Inline styles for wrapper
  const containerStyle = {
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      bgColor,
      bgUrl,
      isImageFill,
      color,
      overflow,
      onClick,
      zIndex,
      maxValue,
      minValue,
      midValue,
    }),
  };

  return (
  <div
    ref={tableWrapperRef}
    onClick={onClick === "Yes" ? handleClick : undefined}
    style={containerStyle}
    className={`${tailwaindClasses} overflow-auto scrollbar-hide`}

  >
    {React.Children.map(children, (child) => {
      const childClasses = child.props.tailwaindClasses || "";
      const commonClasses = commonTailwaindClasses || "";

      // Split classes into arrays
      const childArr = childClasses.split(" ").filter(Boolean);
      const commonArr = commonClasses.split(" ").filter(Boolean);

      // Remove any class from common that exists in child
      const filteredCommonArr = commonArr.filter(cls => !childArr.includes(cls));

      // Merge classes
      const mergedClasses = [...filteredCommonArr, ...childArr].join(" ");

      return React.cloneElement(child, {
        tailwaindClasses: mergedClasses,
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

QTableWrapper.propTypes = {
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

  // ✅ forwarded props
  widthCommon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  heightCommon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colorCommon: PropTypes.string,
  bgColorCommon: PropTypes.string,
  bgUrlCommon: PropTypes.string,
  textCommon: PropTypes.string,
};

QTableWrapper.displayName = "QTableWrapper";

export default QTableWrapper;
