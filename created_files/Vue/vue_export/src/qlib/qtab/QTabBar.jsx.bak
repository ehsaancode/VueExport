
import React, { useState, Children, cloneElement } from "react";

const QTabBar = ({
  dividerColor,
  indicatorColor,
  tabHeaderSize,
  children,
  tailwaindClasses = "",
  dividerSize,
  indicatorHeight,
  tabDirection = "Top", // Top, Bottom, Left, Right
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
        headers.push(
          cloneElement(header, {
            onClick: () => setActiveIndex(index),
            isActive: index === activeIndex,
            indicatorColor,
            tabDirection,
            indicatorHeight,
            key: `header-${index}`,
          })
        );
      }

      if (body) {
        bodies.push(
          cloneElement(body, {
            isVisible: index === activeIndex,
            key: `body-${index}`,
          })
        );
      }
    }
  });

  // Determine flex direction based on tabDirection
  const directionMap = {
    Top: "flex-col",
    Bottom: "flex-col-reverse",
    Left: "flex-row",
    Right: "flex-row-reverse",
  };

  const isVertical = tabDirection === "Left" || tabDirection === "Right";
  const flexDirection = directionMap[tabDirection];

  return (
    <div className={`flex ${flexDirection} ${tailwaindClasses}`} 
      style={isVertical ? { gap: dividerSize } : {}}

        >
      {/* Tab headers */}
      <div
        className={`${isVertical ? "flex-col border-r-[1px]" : "flex-row border-b-[1px]"} flex`}
        style={
          isVertical
            ? { borderRightColor: dividerColor, width: tabHeaderSize }
            : { borderBottomColor: dividerColor, height: tabHeaderSize }
        }
      >
        {headers}
      </div>

      {/* Tab body */}
      <>{bodies[activeIndex]}</>
    </div>
  );
};

QTabBar.displayName = "QTabBar";
export default QTabBar;


