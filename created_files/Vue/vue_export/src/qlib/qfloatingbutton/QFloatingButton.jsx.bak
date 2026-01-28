import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QFloatingButton = ({
  width,
  height,
  bgColor,
  bgUrl,
  isAbsoluteValue,
  zIndex,
  imageFit,
  decoration,
  textDirection,
  action,
  navigation,
  backgroundSize,
  boxShadow,
  textShadow,
  children,
  tailwaindClasses,
  foreground,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (action === "Navigate to" && navigation) {
      navigate(`/${navigation}`);
    }
  };

  const containerStyle = {
    ...generateStyle({
      width,
      height,
      bgColor,
      bgUrl,
      isAbsoluteValue,
      zIndex,
      imageFit,
      decoration,
      textDirection,
      backgroundSize,
      boxShadow,
      textShadow,
    }),
    ...(foreground
      ? {
          background: foreground,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }
      : {}),
   
    zIndex: zIndex || 1000,
    cursor: "pointer",
    position: "fixed",
   
   
  };

  return (
    <div className={tailwaindClasses || ""} onClick={handleClick} style={containerStyle}>
      {children}
    </div>
  );
};


QFloatingButton.propTypes = {
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isAbsoluteValue: PropTypes.bool,
  zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imageFit: PropTypes.string,
  decoration: PropTypes.string,
  textDirection: PropTypes.string,
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  backgroundSize: PropTypes.string,
  boxShadow: PropTypes.string,
  textShadow: PropTypes.string,
  children: PropTypes.node,
};

export default QFloatingButton;
QFloatingButton.displayName = "QFloatingButton";
