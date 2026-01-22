import React from "react";

const QCarousel = ({ children, tailwaindClasses = "" }) => {
  return (
    <div className={`${tailwaindClasses}`}>
      
        {children}
     
    </div>
  );
};

QCarousel.displayName = "QCarousel";
export default QCarousel;
