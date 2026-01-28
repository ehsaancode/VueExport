import React from "react";

const QMenu = ({ id, children, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="cursor-pointer relative h-auto"
      onMouseEnter={onMouseEnter} // Prevent closing when hovering
      onMouseLeave={onMouseLeave} // Only close when fully outside
    >
      {children}
    </div>
  );
};

export default QMenu;

QMenu.displayName = 'QMenu';

