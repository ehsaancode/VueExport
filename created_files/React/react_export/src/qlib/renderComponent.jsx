import React from "react";
import componentsMap from "./componentsMap";

export const renderComponent = ({ type, props = {}, children = [] }, key, index) => {
  const Component = componentsMap[type] || type;

  if (!Component || (typeof Component !== "string" && typeof Component !== "function")) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  // ✅ Custom: render props.children directly without mapping children
  if (type === "QCustom") {
    return (
      <Component key={key} {...props}>
        {props.children ?? null}
      </Component>
    );
  }

  // ✅ AccordionItem / Tab
  if (type === "QAccordionItem" || type === "QTab") {
    return (
      <Component key={key} index={index} {...props}>
        {children.map((child, childIndex) =>
          renderComponent(child, `${key}-${childIndex}`, childIndex)
        )}
      </Component>
    );
  }

  // ✅ Normal case
  return (
    <Component key={key} {...props}>
      {children.map((child, childIndex) =>
        renderComponent(child, `${key}-${childIndex}`, childIndex)
      )}
    </Component>
  );
};
