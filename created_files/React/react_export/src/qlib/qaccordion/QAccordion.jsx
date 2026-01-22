import React, { createContext, useState } from "react";
export const AccordionContext = createContext();
import PropTypes from "prop-types";
import { convertedWidth, convertedHeight } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";

const QAccordion = ({ children, tailwaindClasses,
 width,
  height,
  positionedLeft,
  positionedTop,
  positionedRight,
  positionedBottom,
  color,
  bgColor,
  bgUrl,
  isImageFill,

  isAbsoluteValue,
  onClick = "",
  action = "",
  navigation = "",

  // ✅ Added to fix no-undef errors
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
  boxShadow,
  foreground,
  style
}) => {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prevItems) => {
      return prevItems.map((item) =>
        item.index === index ? { ...item, open: !item.open } : item
      );
    });
  };

  // Initialize items dynamically
  React.useEffect(() => {
    if (openItems.length === 0) {
      setOpenItems(
        React.Children.map(children, (_, i) => ({ index: i, open: false }))
      );
    }
  }, [children, openItems]);


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
        overflow,
        onClick,
        zIndex,
        fontSize,
        fontWeight,
        textAlign,
        fontFamily,
        fontStyle,
        imageFit,
        decoration,
        boxShadow,
      }),
      ...(foreground
        ? {
            background: foreground,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }
        : {}),
    };


return (
  <AccordionContext.Provider value={{ openItems, toggleItem }}>
    <div
     // style={containerStyle}
       style={{
          ...containerStyle,
          ...style
        }}
      className={`accordion flex flex-col gap-[20px] ${tailwaindClasses}`}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { index }) // ✅ inject index here
          : child
      )}
    </div>
  </AccordionContext.Provider>
);

};

export default QAccordion;
QAccordion.displayName = 'QAccordion';








