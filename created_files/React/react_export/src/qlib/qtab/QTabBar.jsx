import React, { useState, Children, cloneElement } from "react";

const QTabBar = ({
  dividerColor = "",
  indicatorColor = "",
  tabHeaderSize = "",
  dividerSize = "",
  indicatorHeight = "3px",
  children,
  tailwaindClasses = "",
  tabDirection = "Top", // Top | Bottom | Left | Right
  bgColor = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const headers = [];
  const bodies = [];

  Children.forEach(children, (child, index) => {
    if (child?.type?.displayName === "QTab") {
      const tabChildren = Children.toArray(child.props.children);

      const header = tabChildren.find(
        (c) =>
          c?.type?.displayName === "QTabHeader" ||
          c?.type?.name === "QTabHeader"
      );

      const body = tabChildren.find(
        (c) =>
          c?.type?.displayName === "QTabBody" ||
          c?.type?.name === "QTabBody"
      );

      if (header) {
        // Make headers fill space properly (equal width in horizontal, full width in vertical)
        const headerTailClasses = `${header.props.tailwaindClasses || ""} ${
          tabDirection === "Left" || tabDirection === "Right" ? "w-full" : "flex-1"
        }`.trim();

        headers.push(
          cloneElement(header, {
            onClick: () => setActiveIndex(index),
            isActive: index === activeIndex,
            indicatorColor,
            tabDirection,
            indicatorHeight,
            tailwaindClasses: headerTailClasses,
            key: `header-${index}`,
          })
        );
      }

      if (body) {
        // Body must take all remaining space → this is the main fix for distortion
        const bodyTailClasses = `${body.props.tailwaindClasses || ""} flex-1 ${
          tabDirection === "Left" || tabDirection === "Right" ? "h-full" : "w-full"
        }`.trim();

        bodies.push(
          cloneElement(body, {
            isVisible: index === activeIndex,
            tailwaindClasses: bodyTailClasses,
            key: `body-${index}`,
          })
        );
      }
    }
  });

  const isVertical = tabDirection === "Left" || tabDirection === "Right";

  // Main container direction
  const directionMap = {
    Top: "flex-col",
    Bottom: "flex-col-reverse",
    Left: "flex-row",
    Right: "flex-row-reverse",
  };

  // Headers container border + size (properly handles Bottom & Right)
  let headersClass = "flex ";
  let headersStyle = {};

  switch (tabDirection) {
    case "Top":
      headersClass += "flex-row border-b w-full";
      headersStyle = {
        height: tabHeaderSize,
        borderBottomColor: dividerColor,
        borderBottomWidth: dividerSize,
      };
      break;
    case "Bottom":
      headersClass += "flex-row border-t w-full";
      headersStyle = {
        height: tabHeaderSize,
        borderTopColor: dividerColor,
        borderTopWidth: dividerSize,
      };
      break;
    case "Left":
      headersClass += "flex-col border-r";
      headersStyle = {
        width: tabHeaderSize,
        borderRightColor: dividerColor,
        borderRightWidth: dividerSize,
      };
      break;
    case "Right":
      headersClass += "flex-col border-l";
      headersStyle = {
        width: tabHeaderSize,
        borderLeftColor: dividerColor,
        borderLeftWidth: dividerSize,
      };
      break;
  }

  return (
    <div
      className={`flex ${directionMap[tabDirection]} ${tailwaindClasses}`}
      style={{ background: bgColor }}
      // No extra gap — the border acts as the divider
    >
      {/* Tab headers */}
      <div className={headersClass} style={headersStyle}>
        {headers}
      </div>

      {/* Active tab body only */}
      {bodies[activeIndex]}
    </div>
  );
};

QTabBar.displayName = "QTabBar";
export default QTabBar;