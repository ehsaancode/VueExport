import React, { useContext } from "react";
import { AccordionContext } from "./QAccordion";

// Helper to detect AccordionBody by its display name
const isAccordionBody = (child) =>
  child?.type?.displayName === "QAccordionBody" || child?.type?.name === "QAccordionBody";

// Helper to detect Icon tag (optional: you can improve this check if needed)
const isIcon = (child) =>
  child?.type?.displayName === "QIcon" || child?.type?.name === "QIcon";

const QAccordionItem = ({ children, index }) => {
  const { openItems, toggleItem } = useContext(AccordionContext);

  const isOpen = openItems.find((item) => item.index === index)?.open || false;

  const childrenArray = React.Children.toArray(children);

  const titleChildren = childrenArray.filter((child) => !isAccordionBody(child));
  const bodyChild = childrenArray.find((child) => isAccordionBody(child));

  const iconChild = titleChildren.find(isIcon);
  const otherTitleChildren = titleChildren.filter((child) => !isIcon(child));

  return (
    <div className="accordion-item">
      <div
        className="accordion-title flex flex-row justify-between items-center"
        style={{ cursor: "pointer" }}
        onClick={() => toggleItem(index)}
      >
        {/* Render non-icon title content first */}
        {otherTitleChildren}
        {/* Then render the icon */}
        <div className="mr-[10px]">
                  {iconChild}
        </div>
      </div>

      <div
        className="accordion-content"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {bodyChild}
      </div>
    </div>
  );
};

QAccordionItem.displayName = "QAccordionItem";

export default QAccordionItem;
