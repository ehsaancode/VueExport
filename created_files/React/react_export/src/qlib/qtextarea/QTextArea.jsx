// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import PropTypes from "prop-types";
// import { get, setFormErrorSet, subscribe } from "../../store/index";

// const QTextArea = ({
//   width,
//   height,
//   color,
//   bgColor,
//   bgUrl,
//   headerText = "",
//   tailwaindClasses = "",
//   placeHolder = "",
//   errorSet,
//   cmsFormInputLabel,
//   cms_form_Id,
//   maxWords = "20",
//   showNumberCount = "1",
//   showResizeButton = "1",
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [value, setValue] = useState("");
//   const [selectedErrorSet, setSelectedErrorSet] = useState(null);

//   /** 🔹 Deep clone helper */
//   const deepClone = (obj) =>
//     typeof structuredClone === "function"
//       ? structuredClone(obj)
//       : JSON.parse(JSON.stringify(obj));

//   /** 🔹 Get selected error set from utility state */
//   const getSelectedErrorSet = useCallback(() => {
//     const formErrorSet = get("formErrorSet");
//     return formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel]
//       ? deepClone(formErrorSet[cms_form_Id][cmsFormInputLabel])
//       : null;
//   }, [cms_form_Id, cmsFormInputLabel]);

//   /** 🔹 Sync with global store */
//   useEffect(() => {
//     const currentErrorSet = getSelectedErrorSet();

//     if (currentErrorSet?.cms_form_text_area_value !== undefined) {
//       setSelectedErrorSet(currentErrorSet);
//       setValue(currentErrorSet.cms_form_text_area_value);
//     } else if (errorSet) {
//       // Dispatch initial errorSet if provided
//       let parsedErrorSet = errorSet;
//       try {
//         if (typeof errorSet === "string") {
//           parsedErrorSet = JSON.parse(errorSet);
//         }
//       } catch (err) {
//         console.error("Invalid errorSet JSON:", err);
//       }

//       const enrichedErrorSet = {
//         ...parsedErrorSet,
//         cms_form_text_area_value:
//           parsedErrorSet?.cms_form_text_area_value || "",
//       };

//       setFormErrorSet({
//         cms_form_Id,
//         cmsFormInputLabel,
//         errorSet: deepClone(enrichedErrorSet),
//       });

//       setSelectedErrorSet(enrichedErrorSet);
//       setValue(enrichedErrorSet.cms_form_text_area_value);
//     }

//     // 🔹 Subscribe to store updates
//     const unsubscribe = subscribe(() => {
//       const updatedErrorSet = getSelectedErrorSet();
//       setSelectedErrorSet((prev) => {
//         if (
//           updatedErrorSet?.cms_form_text_area_value !== value ||
//           JSON.stringify(updatedErrorSet) !== JSON.stringify(prev)
//         ) {
//           setValue(updatedErrorSet?.cms_form_text_area_value || "");
//           return updatedErrorSet;
//         }
//         return prev;
//       });
//     });

//     return () => unsubscribe();
//   }, [getSelectedErrorSet, errorSet, cms_form_Id, cmsFormInputLabel, value]);

//   /** 🔹 Format placeholder */
//   const formattedHeaderText = useMemo(
//     () =>
//       placeHolder
//         .replace(/_/g, " ")
//         .replace(/\b\w/g, (char) => char.toUpperCase()),
//     [placeHolder]
//   );

//   /** 🔹 Styles */
//   const containerStyle = useMemo(
//     () => ({
//       width,
//       height,
//       color,
//       backgroundColor:  bgColor || "transparent",
//       ...(bgUrl &&
//         bgUrl !== "undefined" && {
//           backgroundImage: `url(${bgUrl})`,
//         }),
//       resize: showResizeButton === "1" ? "both" : "none",
//     }),
//     [width, height, color, bgColor, bgUrl, isHovered, showResizeButton]
//   );

//   /** 🔹 Validation + sync cms_form_text_area_value */
//   const checkInputFunction = useCallback(
//     (inputValue) => {
//       if (!selectedErrorSet) return;

//       if (
//         showNumberCount === "1" &&
//         inputValue.length > parseInt(maxWords, 10)
//       ) {
//         return; // enforce char limit
//       }

//       setValue(inputValue);

//       let updatedErrorSet = deepClone(selectedErrorSet);
//       updatedErrorSet.cms_form_text_area_value = inputValue;

//       if (selectedErrorSet?.cms_form_input_On_Change_Validation === "1") {
//         const { cms_form_input_Required, cms_form_input_Regex } =
//           selectedErrorSet;

//         if (cms_form_input_Required === "1" && !inputValue.trim()) {
//           updatedErrorSet.cms_form_input_Required_validation = "Yes";
//           updatedErrorSet.cms_form_input_Regex_validation = "No";
//         } else if (cms_form_input_Regex) {
//           const regex = new RegExp(cms_form_input_Regex);
//           updatedErrorSet.cms_form_input_Regex_validation = regex.test(
//             inputValue
//           )
//             ? "No"
//             : "Yes";
//           updatedErrorSet.cms_form_input_Required_validation = "No";
//         } else {
//           updatedErrorSet.cms_form_input_Required_validation = "No";
//           updatedErrorSet.cms_form_input_Regex_validation = "No";
//         }
//       }

//       setFormErrorSet({
//         cms_form_Id,
//         cmsFormInputLabel,
//         errorSet: updatedErrorSet,
//       });

//       setSelectedErrorSet(updatedErrorSet);
//     },
//     [
//       selectedErrorSet,
//       cms_form_Id,
//       cmsFormInputLabel,
//       maxWords,
//       showNumberCount,
//     ]
//   );

//   return (
//     <div className="relative w-full">
//       <textarea
//         className={`${tailwaindClasses} custom-textarea w-full`}
//         placeholder={formattedHeaderText}
//         name={`${selectedErrorSet?.cms_form_input_Name}`?.replace(/\s+/g, "_")}
//         style={containerStyle}
//         value={value}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onChange={(e) => checkInputFunction(e.target.value)}
//       />

//       {/* Character count */}
//       {showNumberCount === "1" && (
//         <div className="absolute bottom-2 right-3 text-xs text-gray-500">
//           {value.length}/{maxWords}
//         </div>
//       )}
//     </div>
//   );
// };

// QTextArea.propTypes = {
//   width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   color: PropTypes.string,
//   bgColor: PropTypes.string,
//   bgUrl: PropTypes.string,
//   tailwaindClasses: PropTypes.string,
//   headerText: PropTypes.string,
//   placeHolder: PropTypes.string,
//   errorSet: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//   cmsFormInputLabel: PropTypes.string,
//   cms_form_Id: PropTypes.string,
//   maxWords: PropTypes.string,
//   showNumberCount: PropTypes.string,
//   showResizeButton: PropTypes.string,
// };

// QTextArea.displayName = "QTextArea";
// export default QTextArea;








import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { get, setFormErrorSet, subscribe } from "../../store/index";

const QTextArea = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  headerText = "",
  tailwaindClasses = "",
  placeHolder = "",
  errorSet,
  cmsFormInputLabel,
  cms_form_Id,
  maxWords = "20",
  showNumberCount = "1",
  showResizeButton = "1",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [value, setValue] = useState("");
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);

  /** 🔹 Deep clone helper */
  const deepClone = (obj) =>
    typeof structuredClone === "function"
      ? structuredClone(obj)
      : JSON.parse(JSON.stringify(obj));

  /** 🔹 Get selected error set from utility state */
  const getSelectedErrorSet = useCallback(() => {
    const formErrorSet = get("formErrorSet");
    return formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel]
      ? deepClone(formErrorSet[cms_form_Id][cmsFormInputLabel])
      : null;
  }, [cms_form_Id, cmsFormInputLabel]);


    useEffect(() => {
      if (!cms_form_Id || !cmsFormInputLabel) return;
  
      let parsed = errorSet;
  
      if (typeof errorSet === "string") {
        try {
          parsed = JSON.parse(errorSet);
        } catch {
          console.error("Invalid errorSet JSON:", errorSet);
          return;
        }
      }
  
      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: parsed,
      });
  
      setSelectedErrorSet(parsed);
    }, [cms_form_Id, cmsFormInputLabel, errorSet]);
    

  /** 🔹 Sync with global store */
  useEffect(() => {
    const currentErrorSet = getSelectedErrorSet();

    if (currentErrorSet?.cms_form_text_area_value !== undefined) {
      setSelectedErrorSet(currentErrorSet);
      setValue(currentErrorSet.cms_form_text_area_value);
    } else if (errorSet) {
      // Dispatch initial errorSet if provided
      let parsedErrorSet = errorSet;
      try {
        if (typeof errorSet === "string") {
          parsedErrorSet = JSON.parse(errorSet);
        }
      } catch (err) {
        console.error("Invalid errorSet JSON:", err);
      }

      const enrichedErrorSet = {
        ...parsedErrorSet,
        cms_form_text_area_value:
          parsedErrorSet?.cms_form_text_area_value || "",
      };

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: deepClone(enrichedErrorSet),
      });

      setSelectedErrorSet(enrichedErrorSet);
      setValue(enrichedErrorSet.cms_form_text_area_value);
    }

    // 🔹 Subscribe to store updates
    const unsubscribe = subscribe(() => {
      const updatedErrorSet = getSelectedErrorSet();
      setSelectedErrorSet((prev) => {
        if (
          updatedErrorSet?.cms_form_text_area_value !== value ||
          JSON.stringify(updatedErrorSet) !== JSON.stringify(prev)
        ) {
          setValue(updatedErrorSet?.cms_form_text_area_value || "");
          return updatedErrorSet;
        }
        return prev;
      });
    });

    return () => unsubscribe();
  }, [getSelectedErrorSet, errorSet, cms_form_Id, cmsFormInputLabel, value]);

  /** 🔹 Format placeholder */
  const formattedHeaderText = useMemo(
    () =>
      placeHolder
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    [placeHolder]
  );

  /** 🔹 Styles */
  const containerStyle = useMemo(
    () => ({
      width,
      height,
      color,
      backgroundColor:  bgColor || "transparent",
      ...(bgUrl &&
        bgUrl !== "undefined" && {
          backgroundImage: `url(${bgUrl})`,
        }),
      resize: showResizeButton === "1" ? "both" : "none",
    }),
    [width, height, color, bgColor, bgUrl, isHovered, showResizeButton]
  );

  /** 🔹 Validation + sync cms_form_text_area_value */
  const checkInputFunction = useCallback(
    (inputValue) => {
      if (!selectedErrorSet) return;

      if (
        showNumberCount === "1" &&
        inputValue.length > parseInt(maxWords, 10)
      ) {
        return; // enforce char limit
      }

      setValue(inputValue);

      let updatedErrorSet = deepClone(selectedErrorSet);
      updatedErrorSet.cms_form_text_area_value = inputValue;

      if (selectedErrorSet?.cms_form_input_On_Change_Validation === "1") {
        const { cms_form_input_Required, cms_form_input_Regex } =
          selectedErrorSet;

        if (cms_form_input_Required === "1" && !inputValue.trim()) {
          updatedErrorSet.cms_form_input_Required_validation = "Yes";
          updatedErrorSet.cms_form_input_Regex_validation = "No";
        } else if (cms_form_input_Regex) {
          const regex = new RegExp(cms_form_input_Regex);
          updatedErrorSet.cms_form_input_Regex_validation = regex.test(
            inputValue
          )
            ? "No"
            : "Yes";
          updatedErrorSet.cms_form_input_Required_validation = "No";
        } else {
          updatedErrorSet.cms_form_input_Required_validation = "No";
          updatedErrorSet.cms_form_input_Regex_validation = "No";
        }
      }

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: updatedErrorSet,
      });

      setSelectedErrorSet(updatedErrorSet);
    },
    [
      selectedErrorSet,
      cms_form_Id,
      cmsFormInputLabel,
      maxWords,
      showNumberCount,
    ]
  );

  return (
    <div className="relative w-full">
      <textarea
        className={`${tailwaindClasses} custom-textarea w-full`}
        placeholder={formattedHeaderText}
        name={`${selectedErrorSet?.cms_form_input_Name}`?.replace(/\s+/g, "_")}
        style={containerStyle}
        value={value}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onChange={(e) => checkInputFunction(e.target.value)}
      />

      {/* Character count */}
      {showNumberCount === "1" && (
        <div className="absolute bottom-2 right-3 text-xs text-gray-500">
          {value.length}/{maxWords}
        </div>
      )}
    </div>
  );
};

QTextArea.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  headerText: PropTypes.string,
  placeHolder: PropTypes.string,
  errorSet: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cmsFormInputLabel: PropTypes.string,
  cms_form_Id: PropTypes.string,
  maxWords: PropTypes.string,
  showNumberCount: PropTypes.string,
  showResizeButton: PropTypes.string,
};

QTextArea.displayName = "QTextArea";
export default QTextArea;
