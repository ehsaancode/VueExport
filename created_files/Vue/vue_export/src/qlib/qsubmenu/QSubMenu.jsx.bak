

import React from "react";

const QSubMenu = ({
  isOpen,
  children,
  left,
  top,
  onMouseEnter,
  onMouseLeave
}) => {
  
  // if (!isOpen || !children) return null;

  return (
    <div
      style={{
        visibility: isOpen ? "visible" : "hidden",
        opacity: isOpen ? 1 : 0,
        position: "absolute",
        transition: "opacity 0.01s ease",
        top: left === '0' ? "30px" : '0px',
        left: left === '0' ? "0px" : "100%",
        zIndex: 9999,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default QSubMenu;
QSubMenu.displayName = 'QSubMenu';
