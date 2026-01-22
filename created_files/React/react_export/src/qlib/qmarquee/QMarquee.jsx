import React from "react";
import PropTypes from "prop-types";
import {convertedWidth, convertedHeight} from '../../utils/helper';
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";


const QMarquee = ({
   width,
  height,
  padding,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  margin,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  positionedLeft,
  positionedTop,
  positionedRight,
  positionedBottom,
  color,
  bgColor,
  borderRadius,
  borderColor,
  borderWidth,
  bgUrl,
  isImageFill,

  widthType,
  heightType,
  children,
  widthPercent,
  heightPercent,
  alignment,
  mainAlignment,
  crossAlignment,
  borderTLR,
  borderTRR,
  borderBLR,
  borderBRR,
  borderTW,
  borderTC,
  borderBW,
  borderBC,
  borderLW,
  borderLC,
  borderRW,
  borderRC,

  shadowSpreadRadius,
  shadowBlurRadius,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor,
  onClick = "",
  action = "",
  navigation = "",

  // Newly added props to fix no-undef
  isAbsoluteValue,
  overflow,
  zIndex,
  fontSize,
  fontWeight,
  textAlign,
  fontFamily,
  fontStyle,
  imageFit,
  decoration,
  textDirection,
tailwaindClasses
  }) => {

  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick === "Yes") {
      switch (action) {
        case "Navigate to":
          navigate(`/${navigation}`);
          break;
      }
     
    }
  }; 
  

  // Inline styles for the div container
  const containerStyle = {
   
    ...generateStyle({
                    width,
                    height,
                    isAbsoluteValue,
                    positionedLeft,
                    positionedTop,
                    positionedRight,
                    positionedBottom,
                    bgColor,
                    bgUrl,
                    isImageFill,
                    color,
                    borderRadius,
                    borderTLR,
                    borderTRR,
                    borderBLR,
                    borderBRR,
                    borderWidth,
                    borderColor,
                    borderTW,
                    borderBW,
                    borderLW,
                    borderRW,
                    borderTC,
                    borderBC,
                    borderLC,
                    borderRC,
                    paddingLeft,
                    paddingRight,
                    paddingTop,
                    paddingBottom,
                    marginLeft,
                    marginRight,
                    marginTop,
                    marginBottom,
                    shadowOffsetX,
                    shadowOffsetY,
                    shadowBlurRadius,
                    shadowSpreadRadius,
                    shadowColor,
                    overflow,
                    mainAlignment,
                    crossAlignment,
                    onClick,
                    zIndex,
                    fontSize,
                    fontWeight,
                    textAlign,
                    fontFamily,
                    fontStyle,
                    imageFit,
                    decoration,
                    textDirection
    
      }),

    display: "flex",
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
    alignItems: "center"
    

  };

  const contentStyle = {
    display: "flex",
    flexWrap: "nowrap",
    minWidth: "200%", // Ensure the content is at least twice as wide as the container
    animation: "marqueeAnimation 25s linear infinite",
    willChange: "transform", // Optimizes performance and reduces flicker
    transition: "transform 25s linear",
    justifyContent: "center",
    alignItems: "center",
    height: '100%'
  };

  // Define keyframes inside a <style> tag dynamically
    const marqueeAnimation = `
    @keyframes marqueeAnimation {
    from {
        transform: translateX(0%);
    }
    to {
        transform: translateX(-50%);
    }
    }
    `;

  return <>
    <style>{marqueeAnimation}</style>
  <div style={containerStyle}     
 onClick={onClick === "Yes" ? handleClick : undefined}  className={`${tailwaindClasses}`}>
    <div style={contentStyle}>
    {children}
    {children}
    </div>
  </div>
  </>
};

// PropTypes for validation
QMarquee.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.string,
  paddingLeft: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingRight: PropTypes.string,
  paddingBottom: PropTypes.string,
  margin: PropTypes.string,
  marginLeft: PropTypes.string,
  marginTop: PropTypes.string,
  marginRight: PropTypes.string,
  marginBottom: PropTypes.string,
  positionedLeft: PropTypes.string,
  positionedTop: PropTypes.string,
  positionedRight: PropTypes.string,
  positionedBottom: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  shadowBlurRadius: PropTypes.string,
  shadowColor: PropTypes.string,
  shadowOffsetX: PropTypes.string,
  shadowOffsetY: PropTypes.string,
  shadowSpreadRadius: PropTypes.string,
  mainAlignment: PropTypes.string,
  crossAlignment: PropTypes.string,
  widthType: PropTypes.string,
  heightType: PropTypes.string,
  children: PropTypes.node,
};

export default QMarquee;
QMarquee.displayName = 'QMarquee';
