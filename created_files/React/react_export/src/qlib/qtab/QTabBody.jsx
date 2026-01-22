import React from "react";

const QTabBody = ({ children, isVisible, tailwaindClasses = "" }) => {
  if (!isVisible) return null;
  return <div className={tailwaindClasses}>{children}</div>;
};

QTabBody.displayName = "QTabBody";
export default QTabBody;
