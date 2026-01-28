
import React, { useEffect, useState, Children } from "react";
import { useLocation } from "react-router-dom";

const QDrawer = ({
  position = "left",
  width,
  height,
  bgColor,
  color = "rgba(14, 33, 61, 1.00)",
  children,
  tailwaindClasses
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const lastSegment = location.pathname.split("/").filter(Boolean).pop();
   useEffect(() => {
       setIsOpen(false)
  }, [lastSegment]);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const getTransform = () => {
    if (isOpen) return "translateX(0)";
    return position === "right" ? "translateX(100%)" : "translateX(-100%)";
  };

  const allChildren = Children.toArray(children);

  const drawerBody = allChildren.find(
    (child) => child?.type?.displayName === "QDrawerBody"
  );

  const otherChildren = allChildren.filter(
    (child) => child?.type?.displayName !== "QDrawerBody"
  );
//style={{ textAlign: "end" }}
  return (
    <div className={`${tailwaindClasses}`} >
      {/* QDrawer Panel with only DrawerBody */}
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          zIndex: 999999,
          ...(position === "left"
            ? { left: 0, right: "unset" }
            : { right: 0, left: "unset" }),
          transform: getTransform(),
          transition: "transform 0.4s ease-in-out",
          overflowY: "auto",
          willChange: "transform",
        }}
      >
        {drawerBody}
      </div>

      {/* Toggle Button & All Other Children */}
      <div>
        <button
          style={{
            zIndex: 1100,
            cursor: "pointer"
          }}
          onClick={toggleDrawer}
        >
          {/** Optional: place a hardcoded or dynamic icon here */}
          {otherChildren}
        </button>

        {/* All other components under the button */}
        
      </div>
    </div>
  );
};

export default QDrawer;
QDrawer.displayName = "QDrawer";
