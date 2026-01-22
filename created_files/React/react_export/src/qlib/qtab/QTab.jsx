import React from "react";

const QTab = ({ children, tailwaindClasses = "" }) => {
  return <div className={tailwaindClasses}>{children}</div>;
};

QTab.displayName = "QTab";
export default QTab;
