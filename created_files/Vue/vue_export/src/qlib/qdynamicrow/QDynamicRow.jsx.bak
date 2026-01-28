import React from "react";
import PropTypes from "prop-types";

const QDynamicRow = ({ children, commonTailwaindClasses }) => {
  const tableData = [
    {
      img_url: "https://www.w3schools.com/html/pic_trulli.jpg",
      text1: "React",
      text3: "JavaScript",
      text4: "Programming",
    },
    {
      text3: "Bonjour",
      img_url: "https://www.w3schools.com/html/img_girl.jpg",
      text2: "Réagir",
      text1: "TypeScript",
      text4: "Programmation",
    },
    {
      img_url: "https://www.w3schools.com/html/img_chania.jpg",
      text1: "Hola",
      text2: "Reaccionar",
      text3: "Next",
      text4: "Programación",
    },
  ];

  const textComponents = [
    "QParagraph",
    "QTextH1",
    "QTextH2",
    "QTextH3",
    "QTextH4",
    "QTextH5",
    "QTextH6",
    "QButton",
  ];

  return (
    <>
      {tableData.map((row, rowIndex) => {
        const tableRow = React.Children.only(children);

        const newRow = React.cloneElement(tableRow, {
          key: rowIndex,
          commonTailwaindClasses, // pass to row
          children: React.Children.map(tableRow.props.children, (cell) => {
            if (!React.isValidElement(cell)) return cell;

            const newCellChildren = React.Children.map(
              cell.props.children,
              (child) => {
                if (!React.isValidElement(child)) return child;

                const typeName = child.type?.displayName || child.type?.name;
                let updatedProps = {};

                if (textComponents.includes(typeName)) {
                  // Match headerText with key in tableData
                  const headerKey = child.props.headerText;
                  updatedProps.headerText = row[headerKey] ?? "";
                } else if (typeName === "QImage") {
                  const headerKey = child.props.bgUrl || "bgUrl";
                  updatedProps.bgUrl = row[headerKey] ?? "";
                } else if (typeName === "QIcon") {
                  const headerKey = child.props.headerText;
                  updatedProps.iconLink = row[headerKey] ?? "";
                }
                return React.cloneElement(child, {
                  ...child.props,
                  ...updatedProps,
                });
              }
            );
            return React.cloneElement(cell, {
              ...cell.props,
              children: newCellChildren,
              commonTailwaindClasses,
            });
          }),
        });

        return newRow;
      })}
    </>
  );
};

QDynamicRow.propTypes = {
  children: PropTypes.node.isRequired,
  commonTailwaindClasses: PropTypes.string,
};

QDynamicRow.displayName = "QDynamicRow";

export default QDynamicRow;
