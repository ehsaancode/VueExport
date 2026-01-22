import React, { useRef } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";

const QTableCell = ({
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

  // ✅ Forwarded common props
  forwardCommonWidth,
  forwardCommonHeight,
  forwardCommonColor,
  forwardCommonBgColor,
  forwardCommonBgUrl,
}) => {
  const tableWrapperRef = useRef(null);
  const navigate = useNavigate();

  // Handle navigation click
  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to") {
      navigate(`/${navigation}`);
    }
  };

  // ✅ Inline styles with forward fallback
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
   // border: "1px solid #ccc", // Example border for table cell
  };

  return (
    <div
      ref={tableWrapperRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
      className={tailwaindClasses}
    >
      {children}
    </div>
  );
};

QTableCell.propTypes = {
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

  // ✅ Forwarded props
  forwardCommonWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forwardCommonHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forwardCommonColor: PropTypes.string,
  forwardCommonBgColor: PropTypes.string,
  forwardCommonBgUrl: PropTypes.string,
};

QTableCell.displayName = "QTableCell";

export default QTableCell;
