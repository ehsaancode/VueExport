
// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { get, subscribe } from "../../store/index";

// const QRepeat = ({
//   children,
//   applyIntoTableCell,
//   tailwaindClasses,
//   widgetId,
//   repeaterDefaultData = [],
// }) => {
//   const [dataRepeat, setDataRepeat] = useState();
//   const [targetKey, setTargetKey] = useState();

//   const textComponents = [
//     "QText",
//     "QParagraph",
//     "QTextH1",
//     "QTextH2",
//     "QTextH3",
//     "QTextH4",
//     "QTextH5",
//     "QTextH6",
//     "QButton",
//   ];

//   useEffect(() => {
//     const unsubscribe = subscribe(() => {
//       const newValue = get(widgetId);
//       setDataRepeat(newValue);

//       const datasetPath = get(widgetId + "_dataset_path");
//       if (datasetPath) setTargetKey(datasetPath);
//     });
//     return () => unsubscribe();
//   }, []);

//   const selectedData = repeaterDefaultData;

//   const processElement = (element, row, rowIndex) => {
//     if (!React.isValidElement(element)) return element;

//     const typeName = element.type?.displayName || element.type?.name;
//     const updatedProps = {};

//     if (textComponents.includes(typeName) && element.props.tagKey) {
//       updatedProps.headerText = row[element.props.tagKey] ?? "";
//     }

//     if (typeName === "QImage" && element.props.tagKey) {
//       updatedProps.bgUrl = row[element.props.tagKey] ?? "";
//     }

//     // 🔹 If element is QActionFlow, inject index
//     if (typeName === "QActionFlow") {
//       updatedProps.index = rowIndex;
//       updatedProps["data-index"] = rowIndex;
//     }

//     const newChildren = element.props.children
//       ? React.Children.map(element.props.children, (child) =>
//           processElement(child, row, rowIndex)
//         )
//       : element.props.children;

//     return React.cloneElement(element, {
//       ...element.props,
//       ...updatedProps,
//       children: newChildren,
//       applyIntoTableCell,
//     });
//   };

//   return (
//     <>
//       {selectedData.map((row, rowIndex) =>
//         React.Children.map(children, (child) =>
//           processElement(child, row, rowIndex)
//         )
//       )}
//     </>
//   );
// };

// QRepeat.propTypes = {
//   children: PropTypes.node,
//   applyIntoTableCell: PropTypes.string,
//   targetKey: PropTypes.string,
//   tailwaindClasses: PropTypes.string,
//   dataRepeat: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
// };

// QRepeat.displayName = "QRepeat";

// export default QRepeat;





import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { get, subscribe } from "../../store/index";

const QRepeat = ({
  children,
  applyIntoTableCell,
  tailwaindClasses,
  widgetId,
  repeaterDefaultData = [],
  loading
}) => {
  const [dataRepeat, setDataRepeat] = useState();
  const [targetKey, setTargetKey] = useState();
  
 

  const textComponents = [
    "QText",
    "QParagraph",
    "QTextH1",
    "QTextH2",
    "QTextH3",
    "QTextH4",
    "QTextH5",
    "QTextH6",
    "QButton",
  ];

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const newValue = get(widgetId);
      setDataRepeat(newValue);

      const datasetPath = get(widgetId + "_dataset_path");
      if (datasetPath) setTargetKey(datasetPath);
    });
    return () => unsubscribe();
  }, []);

  const selectedData = repeaterDefaultData;
  //console.log(selectedData)

const processElement = (element, row, rowIndex) => {
  if (!React.isValidElement(element)) return element;

  const typeName = element.type?.displayName || element.type?.name;

  let newProps = { ...element.props };

  if (textComponents.includes(typeName) && element.props.tagKey) {
    newProps.headerText = row[element.props.tagKey] ?? "";
  }

  if (typeName === "QImage" && element.props.tagKey) {
    newProps.bgUrl = row[element.props.tagKey] ?? "";
  }

  if (typeName === "QActionFlow") {
    newProps.index = rowIndex;
    newProps["data-index"] = rowIndex;
  }

  // 🔥 Rebuild children every render ALWAYS
  const newChildren = React.Children.toArray(element.props.children).map(
    (child) => processElement(child, row, rowIndex)
  );

  return React.createElement(element.type, {
    key: `${rowIndex}-${typeName}-${Math.random()}`,   // 🔥 Force replace element
    ...newProps,
    children: newChildren,
  });
};


  return (
   <>
      {/* {loading && selectedData?.map((row, rowIndex) =>
        React.Children.map(children, (child) =>
          processElement(
            React.cloneElement(child, { key: row.cart_id || rowIndex }),
            row,
            rowIndex
          )
        )
      )} */}

       { selectedData?.map((row, rowIndex) =>
        React.Children.map(children, (child) =>
          processElement(
            React.cloneElement(child, { key: row.cart_id || rowIndex }),
            row,
            rowIndex
          )
        )
      )}
    </>

  );
};

QRepeat.propTypes = {
  children: PropTypes.node,
  applyIntoTableCell: PropTypes.string,
  targetKey: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  dataRepeat: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

QRepeat.displayName = "QRepeat";

export default QRepeat;