


import React from "react";
import { formSubmit } from "../../utils/formSubmit";

const QActionFlow = ({ actions = {}, triggers = {}, children, index, actionable = true }) => {
  const triggerFunctions = { formSubmit };

  const handleAction = async (actionItem, event) => {
    if (!actionItem) return;

    const payload = { ...event, index };

    if (typeof actionItem === "string" && actions[actionItem]) {
      await actions[actionItem](payload);
      return;
    }

    if (typeof actionItem === "function") {
      await actionItem(payload);
      return;
    }

    if (typeof actionItem === "object" && actionItem.fn) {
      const fn = triggerFunctions[actionItem.fn];
      if (fn) await fn(actionItem.args || {}, payload);
    }
  };

  const eventHandlers = {};
  Object.entries(triggers).forEach(([triggerName, actionConfig]) => {
    eventHandlers[triggerName] = async (event) => {
      // ✅ Stop outer wrapper if this is an inner actionable
      if (actionable && event.currentTarget !== event.target) {
        event.stopPropagation?.();
      }

      const rowIndex = index ?? 0;
      event.index = rowIndex;

      try {
        if (Array.isArray(actionConfig)) {
          for (const actionItem of actionConfig) await handleAction(actionItem, event);
        } else {
          await handleAction(actionConfig, event);
        }
      } catch (err) {
        console.error(`Error in ${triggerName}:`, err);
      }
    };
  });

  const childrenArray = React.Children.toArray(children);

  const hasQForm = childrenArray.some(
    (child) =>
      React.isValidElement(child) &&
      (child.type?.displayName === "QForm" || child.type?.name === "QForm")
  );
  if (hasQForm) return <>{children}</>;

    const hasQButton = childrenArray.some(
    (child) =>
      React.isValidElement(child) &&
       (child.type?.displayName === "QButton" || child.type?.name === "QButton" 
      || child.type?.displayName === "QDiv" || child.type?.name === "QDiv"
      ||   child.type?.displayName === "QFlex" || child.type?.name === "QFlex" 
      || child.type?.displayName === "QFullWidth" || child.type?.name === "QFullWidth" 
       
      )
  );


  const wrapperStyle =
    typeof index === "number" && !isNaN(index) || hasQButton
      ? { display: "contents" }
     // : { display: "inline-block", width: "inherit" };
      : { display: "inline-block", width: "" };

  return (
    <div
      style={wrapperStyle}
      {...eventHandlers}
      data-index={index}
      data-actionable={actionable ? "true" : undefined} // mark actionable
    >
      {children}
    </div>
  );
};

export default QActionFlow;
QActionFlow.displayName = "QActionFlow";



