import React from "react";

const QTabBody = ({ children, isVisible, tailwaindClasses = "", bgColor = "" }) => {
  if (!isVisible) return null;
  return (
    <div className={tailwaindClasses} style={{ background: bgColor }}>
      {children}
    </div>
  );
};

QTabBody.displayName = "QTabBody";
export default QTabBody;
