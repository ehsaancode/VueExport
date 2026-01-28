import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QStickyHeader = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  isImageFill,
  children,
  isAbsoluteValue,
  overflow,
  zIndex,
  imageFit,
  decoration,
  textDirection,
  onClick = "",
  action = "",
  navigation = "",
  tailwaindClasses,
  boxShadow,
  foreground,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick === "Yes") {
      if (action === "Navigate to" && navigation) {
        navigate(`/${navigation}`);
      }
    }
  };

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
      zIndex,
      imageFit,
      decoration,
      textDirection,
      boxShadow,
    }),
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
    position: isAbsoluteValue ? "absolute" : "sticky",
    top: isAbsoluteValue ? undefined : "0px",
    zIndex: zIndex ?? 999,
 
  
  };

  return (
    <div
      className={tailwaindClasses || ""}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
    >
      {children}
    </div>
  );
};

QStickyHeader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  boxShadow: PropTypes.string,
  foreground: PropTypes.string,
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imageFit: PropTypes.string,
  decoration: PropTypes.string,
  textDirection: PropTypes.string,
};

export default QStickyHeader;
QStickyHeader.displayName = "QStickyHeader";
