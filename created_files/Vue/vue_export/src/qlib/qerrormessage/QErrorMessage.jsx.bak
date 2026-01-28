// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { generateStyle } from "../../utils/helper";
// import { get, subscribe } from "../../store/index";

// const QErrorMessage = ({
//   width,
//   height,
//   bgColor,
//   bgUrl,
//   isImageFill,
//   cms_form_input_Id = "",
//   cms_form_Id = "",
//   isAbsoluteValue,
//   zIndex,
//   tailwaindClasses,
//   backgroundSize,
//   boxShadow,
//   textShadow,
// }) => {
//   const [selectedErrorSet, setSelectedErrorSet] = useState(null);

//   // Update error state when store changes
//   useEffect(() => {
//     const updateErrorSet = () => {
//       const formErrorSet = get("formErrorSet");
//       const currentErrorSet = formErrorSet?.[cms_form_Id]?.[cms_form_input_Id];
//       setSelectedErrorSet(currentErrorSet);
//     };

//     // Run initially
//     updateErrorSet();

//     // Subscribe to store changes
//     const unsubscribe = subscribe(updateErrorSet);

//     return () => unsubscribe();
//   }, [cms_form_Id, cms_form_input_Id]);

//   const containerStyle = {
//     ...generateStyle(
//       Object.fromEntries(
//         Object.entries({
//           width,
//           height,
//           isAbsoluteValue,
//           bgColor,
//           bgUrl,
//           isImageFill,
//           zIndex,
//           backgroundSize,
//           boxShadow,
//           textShadow,
//         }).filter(([, val]) => val !== undefined && val !== null && val !== "")
//       )
//     ),
//   };

//   return (
//     <div style={containerStyle} className={`${tailwaindClasses || ""}`}>
//       {selectedErrorSet?.cms_form_input_Required_validation === "Yes"
//         ? selectedErrorSet?.cms_form_input_Required_Msg
//         : ""}
//       {selectedErrorSet?.cms_form_input_Regex_validation === "Yes"
//         ? selectedErrorSet?.cms_form_input_Regex_Msg
//         : ""}
//     </div>
//   );
// };

// QErrorMessage.propTypes = {
//   width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   bgColor: PropTypes.string,
//   bgUrl: PropTypes.string,
//   isImageFill: PropTypes.bool,
//   cms_form_input_Id: PropTypes.string,
//   cms_form_Id: PropTypes.string,
//   errorMes: PropTypes.node,
//   isAbsoluteValue: PropTypes.bool,
//   onClick: PropTypes.string,
//   action: PropTypes.string,
//   navigation: PropTypes.string,
//   zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   tailwaindClasses: PropTypes.string,
//   backgroundSize: PropTypes.string,
//   boxShadow: PropTypes.string,
//   textShadow: PropTypes.string,
// };

// export default QErrorMessage;
// QErrorMessage.displayName = "QErrorMessage";









import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../utils/helper";
import { get, subscribe } from "../../store/index";

const QErrorMessage = ({
  width,
  height,
  bgColor,
  bgUrl,
  isImageFill,
  cms_form_input_Id = "",
  cms_form_Id = "",
  isAbsoluteValue,
  zIndex,
  tailwaindClasses,
  backgroundSize,
  boxShadow,
  textShadow,
}) => {
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);

  // Update error state when store changes
  useEffect(() => {
    const updateErrorSet = () => {
      const formErrorSet = get("formErrorSet");
      const currentErrorSet = formErrorSet?.[cms_form_Id]?.[cms_form_input_Id];
      setSelectedErrorSet(currentErrorSet);
    };

    // Run initially
    updateErrorSet();

    // Subscribe to store changes
    const unsubscribe = subscribe(updateErrorSet);

    return () => unsubscribe();
  }, [cms_form_Id, cms_form_input_Id]);

  const containerStyle = {
    ...generateStyle(
      Object.fromEntries(
        Object.entries({
          width,
          height,
          isAbsoluteValue,
          bgColor,
          bgUrl,
          isImageFill,
          zIndex,
          backgroundSize,
          boxShadow,
          textShadow,
        }).filter(([, val]) => val !== undefined && val !== null && val !== "")
      )
    ),
  };

  return (
    <div style={containerStyle} className={`${tailwaindClasses || ""}`}>
      {/* Required Validation */}
      {selectedErrorSet?.cms_form_input_Required_validation === "Yes"
        ? selectedErrorSet?.cms_form_input_Required_Msg
        : ""}

      {/* Regex Validation */}
      {selectedErrorSet?.cms_form_input_Regex_validation === "Yes"
        ? selectedErrorSet?.cms_form_input_Regex_Msg
        : ""}

      {/* Min Length Validation */}
      {selectedErrorSet?.cms_form_input_Min_validation === "Yes"
        ? selectedErrorSet?.cms_form_input_Min_Msg
        : ""}

      {/* Max Length Validation */}
      {selectedErrorSet?.cms_form_input_Max_validation === "Yes"
        ? selectedErrorSet?.cms_form_input_Max_Msg
        : ""}
    </div>
  );
};

QErrorMessage.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  cms_form_input_Id: PropTypes.string,
  cms_form_Id: PropTypes.string,
  errorMes: PropTypes.node,
  isAbsoluteValue: PropTypes.bool,
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tailwaindClasses: PropTypes.string,
  backgroundSize: PropTypes.string,
  boxShadow: PropTypes.string,
  textShadow: PropTypes.string,
};

export default QErrorMessage;
QErrorMessage.displayName = "QErrorMessage";

