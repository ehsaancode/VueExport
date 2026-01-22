



// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import PropTypes from "prop-types";
// import { get, setFormErrorSet, subscribe } from "../../store/index";

// const QInputText = ({
//   width,
//   height,
//   color,
//   bgColor,
//   bgUrl,
//   leftPadding = "",
//   fontSize = "",
//   shadowSpreadRadius = "0px",
//   shadowBlurRadius = "0px",
//   shadowOffsetX = "0px",
//   shadowOffsetY = "0px",
//   shadowColor = "transparent",
//   headerText = "",
//   tailwaindClasses = "",
//   placeHolder = "",
//   placeHolderFontSize = "",
//   placeHolderFontWeight = "normal",
//   placeHolderTextColor = "inherit",
//   errorSet,
//   cmsFormInputLabel,
//   cms_form_Id,
//   textInputType = "text", // email/number/text/password
//   readOnly = "false",
//   disabled = "false",
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [selectedErrorSet, setSelectedErrorSet] = useState(null);

//   // 🔹 Get error set from global store
//   const getSelectedErrorSet = useCallback(() => {
//     const formErrorSet = get("formErrorSet");
//     return formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel];
//   }, [cms_form_Id, cmsFormInputLabel]);

//   // 🔹 Sync selectedErrorSet from store
//   useEffect(() => {
//     const currentErrorSet = getSelectedErrorSet();

//     setSelectedErrorSet(currentErrorSet);
//   }, [getSelectedErrorSet]);

//   // 🔹 Register error set initially
//   useEffect(() => {
//     if (cms_form_Id && cmsFormInputLabel && errorSet) {
//       let parsedErrorSet = errorSet;
//       try {
//         if (typeof errorSet === "string") {
//           parsedErrorSet = JSON.parse(errorSet);
//         }
//       } catch (err) {
//         console.error("Invalid errorSet JSON:", err);
//       }

//       setFormErrorSet({
//         cms_form_Id,
//         cmsFormInputLabel,
//         errorSet: parsedErrorSet,
//       });
//       setSelectedErrorSet(parsedErrorSet);
//     }
//   }, [cms_form_Id, cmsFormInputLabel, errorSet]);





//   const [selectedErrorSet1, setSelectedErrorSet1] = useState(null);


//    useEffect(() => {
//       const updateErrorSet = () => {
//         const formErrorSet = get("formErrorSet");
//         const currentErrorSet = formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel];
//               console.log("currentErrorSet", currentErrorSet);

//         setSelectedErrorSet1(currentErrorSet);
//       };
  
//       // Run initially
//       updateErrorSet();
  
//       // Subscribe to store changes
//       const unsubscribe = subscribe(updateErrorSet);
  
//       return () => unsubscribe();
//     }, [cms_form_Id, cmsFormInputLabel]);




//   // 🔹 Placeholder formatting
//   const formattedHeaderText = useMemo(
//     () =>
//       placeHolder
//         .replace(/_/g, " ")
//         .replace(/\b\w/g, (char) => char.toUpperCase()),
//     [placeHolder]
//   );

//   // 🔹 Input style
//   const containerStyle = useMemo(
//     () => ({
//       width,
//       height,
//       color,
//       backgroundColor: isHovered ? "" : bgColor || "transparent",
//       boxShadow: `${shadowOffsetX} ${shadowOffsetY} ${shadowBlurRadius} ${shadowSpreadRadius} ${shadowColor}`,
//       ...(bgUrl &&
//         bgUrl !== "undefined" && {
//           backgroundImage: `url(${bgUrl})`,
//         }),
//       paddingLeft: leftPadding,
//       fontSize,
//     }),
//     [
//       width,
//       height,
//       color,
//       bgColor,
//       isHovered,
//       shadowOffsetX,
//       shadowOffsetY,
//       shadowBlurRadius,
//       shadowSpreadRadius,
//       shadowColor,
//       bgUrl,
//       leftPadding,
//       fontSize,
//     ]
//   );

//   // 🔹 Validation function (now includes min/max)
//   const checkInputFunction = useCallback(
//     (value) => {
//       if (!selectedErrorSet) return;

//       const {
//         cms_form_input_Required,
//         cms_form_input_Regex,
//         cms_form_input_Min,
//         cms_form_input_Min_Msg,
//         cms_form_input_Max,
//         cms_form_input_Max_Msg,
//       } = selectedErrorSet;

//       let updatedErrorSet = { ...selectedErrorSet };

//       // Required validation
//       if (cms_form_input_Required === "1" && !value.trim()) {
//         updatedErrorSet = {
//           ...updatedErrorSet,
//           cms_form_input_Required_validation: "Yes",
//           validationMessage: selectedErrorSet.cms_form_input_Required_Msg,
//            cms_form_input_Regex_validation: "No",
//            cms_form_input_Min_validation: "No",
//            cms_form_input_Max_validation: "No"
//         };
//       }
//       // Regex validation
//       else if (cms_form_input_Regex) {
//         const regex = new RegExp(cms_form_input_Regex);
//         updatedErrorSet = {
//           ...updatedErrorSet,
//           cms_form_input_Min_validation: "No",
//            cms_form_input_Max_validation: "No",
//            cms_form_input_Required_validation: "No",
//           cms_form_input_Regex_validation: regex.test(value) ? "No" : "Yes",
//           validationMessage: regex.test(value)
//             ? ""
//             : selectedErrorSet.cms_form_input_Regex_Msg,
//         };
//       }
//       // 🔹 Min length validation
//       else if (
//         cms_form_input_Min &&
//         value.length < parseInt(cms_form_input_Min, 10)
//       ) {
//         updatedErrorSet = {
//           ...updatedErrorSet,
//           cms_form_input_Min_validation: "Yes",
//            cms_form_input_Max_validation: "No",
//            cms_form_input_Required_validation: "No",
//            cms_form_input_Regex_validation: "No",
//           validationMessage: cms_form_input_Min_Msg,
//         };
//       }
//       // 🔹 Max length validation
//       else if (
//         cms_form_input_Max &&
//         value.length > parseInt(cms_form_input_Max, 10)
//       ) {
//         updatedErrorSet = {
//           ...updatedErrorSet,
//           cms_form_input_Max_validation: "Yes",
//           cms_form_input_Required_validation: "No",
//           cms_form_input_Regex_validation: "No",
//           cms_form_input_Min_validation: "No",
//           validationMessage: cms_form_input_Max_Msg,
//         };
//       } else {
//         updatedErrorSet = {
//           ...updatedErrorSet,
//           cms_form_input_Required_validation: "No",
//           cms_form_input_Regex_validation: "No",
//           cms_form_input_Min_validation: "No",
//           cms_form_input_Max_validation: "No",
//           validationMessage: "",
//         };
//       }

//       // Update store and local state
//       setFormErrorSet({
//         cms_form_Id,
//         cmsFormInputLabel,
//         errorSet: updatedErrorSet,
//       });

//       setSelectedErrorSet(updatedErrorSet);
//     },
//     [selectedErrorSet, cms_form_Id, cmsFormInputLabel]
//   );

//   return (
//     <>
//       {/* Dynamic placeholder style */}
//       <style>
//         {`
//           .custom-input::placeholder {
//             color: ${placeHolderTextColor};
//             font-size: ${placeHolderFontSize};
//             font-weight: ${placeHolderFontWeight};
//           }
//         `}
//       </style>

//       <input
//         className={`${tailwaindClasses} custom-input`}
//         placeholder={formattedHeaderText}
//         readOnly={readOnly === "true"}
//         disabled={disabled === "true"}
//         type={
//           textInputType === "email"
//             ? "text"
//             : textInputType === "phone_number"
//             ? "number"
//             : textInputType
//         }
//         name={`${selectedErrorSet?.cms_form_input_Name}`?.replace(/\s+/g, "_")}
//         style={containerStyle}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onChange={
//           selectedErrorSet?.cms_form_input_On_Change_Validation === "1"
//             ? (e) => checkInputFunction(e.target.value)
//             : undefined
//         }
//       />
//     </>
//   );
// };

// QInputText.propTypes = {
//   width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   color: PropTypes.string,
//   bgColor: PropTypes.string,
//   bgUrl: PropTypes.string,
//   leftPadding: PropTypes.string,
//   fontSize: PropTypes.string,
//   shadowBlurRadius: PropTypes.string,
//   shadowColor: PropTypes.string,
//   shadowOffsetX: PropTypes.string,
//   shadowOffsetY: PropTypes.string,
//   shadowSpreadRadius: PropTypes.string,
//   tailwaindClasses: PropTypes.string,
//   headerText: PropTypes.string,
//   placeHolder: PropTypes.string,
//   placeHolderFontSize: PropTypes.string,
//   placeHolderFontWeight: PropTypes.string,
//   placeHolderTextColor: PropTypes.string,
//   errorSet: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//   cmsFormInputLabel: PropTypes.string,
//   cms_form_Id: PropTypes.string,
// };

// QInputText.displayName = "QInputText";
// export default QInputText;






import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { get, setFormErrorSet, subscribe } from "../../store/index";

const QInputText = ({
  width,
  height,
  color,
  bgColor,
  bgUrl,
  leftPadding = "",
  fontSize = "",
  shadowSpreadRadius = "0px",
  shadowBlurRadius = "0px",
  shadowOffsetX = "0px",
  shadowOffsetY = "0px",
  shadowColor = "transparent",
  tailwaindClasses = "",
  placeHolder = "",
  placeHolderFontSize = "",
  placeHolderFontWeight = "normal",
  placeHolderTextColor = "inherit",

  errorSet,
  cmsFormInputLabel,
  cms_form_Id,

  textInputType = "text",
  readOnly = "false",
  disabled = "false",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);
  const [textInput, setTextInputType] = useState(textInputType);


  // --------------------------------------------------------
  // 🔹 Get errorSet from global store
  // --------------------------------------------------------
  const getSelectedErrorSet = useCallback(() => {
    const formErrorSet = get("formErrorSet");
    return formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel];
  }, [cms_form_Id, cmsFormInputLabel]);

  // --------------------------------------------------------
  // 🔹 Sync with global store continuously
  // --------------------------------------------------------
  useEffect(() => {
    const updateErrorSet = () => {
      const current = getSelectedErrorSet();
      if (current) setSelectedErrorSet(current);
      //console.log(current)
        if(current?.clickValue=== true && current?.trailingIconEnabled===true && 
          current?.trailingIconAction==='Toggle password'
        )
        {
          setTextInputType("text")
        }else  if(current?.clickValue=== false && current?.trailingIconEnabled===true && 
          current?.trailingIconAction==='Toggle password'
        ){
          setTextInputType("password")
        }
    };

    updateErrorSet(); // initial load

    const unsubscribe = subscribe(updateErrorSet);
    return () => unsubscribe();
  }, [getSelectedErrorSet]);

  // --------------------------------------------------------
  // 🔹 Initialize errorSet on mount
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // 🔹 Placeholder formatting
  // --------------------------------------------------------
  const formattedHeaderText = useMemo(() => {
    return placeHolder
      .replace(/_/g, " ")
      .replace(/\b\w/g, (x) => x.toUpperCase());
  }, [placeHolder]);

  // --------------------------------------------------------
  // 🔹 Input container styling
  // --------------------------------------------------------
  const containerStyle = useMemo(
    () => ({
      width,
      height,
      color,
      backgroundColor: isHovered ? bgColor : bgColor || bgColor,
      boxShadow: `${shadowOffsetX} ${shadowOffsetY} ${shadowBlurRadius} ${shadowSpreadRadius} ${shadowColor}`,

      ...(bgUrl &&
        bgUrl !== "undefined" && {
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
        }),

      paddingLeft: leftPadding,
      fontSize,
    }),
    [
      width,
      height,
      color,
      bgColor,
      bgUrl,
      isHovered,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlurRadius,
      shadowSpreadRadius,
      shadowColor,
      leftPadding,
      fontSize,
    ]
  );

  // --------------------------------------------------------
  // 🔹 Validation Function
  // --------------------------------------------------------
  const checkInputFunction = useCallback(
    (value) => {
      if (!selectedErrorSet) return;

      const {
        cms_form_input_Required,
        cms_form_input_Regex,
        cms_form_input_Required_Msg,
        cms_form_input_Regex_Msg,
        cms_form_input_Min,
        cms_form_input_Min_Msg,
        cms_form_input_Max,
        cms_form_input_Max_Msg,
      } = selectedErrorSet;

      let updated = { ...selectedErrorSet };

      // Required
      if (cms_form_input_Required === "1" && !value.trim()) {
        updated = {
          ...updated,
          cms_form_input_Required_validation: "Yes",
          cms_form_input_Regex_validation: "No",
          cms_form_input_Min_validation: "No",
          cms_form_input_Max_validation: "No",
          validationMessage: cms_form_input_Required_Msg,
        };
      }

      // Regex
      else if (cms_form_input_Regex) {
        const regex = new RegExp(cms_form_input_Regex);
        const valid = regex.test(value);

        updated = {
          ...updated,
          cms_form_input_Required_validation: "No",
          cms_form_input_Regex_validation: valid ? "No" : "Yes",
          cms_form_input_Min_validation: "No",
          cms_form_input_Max_validation: "No",
          validationMessage: valid ? "" : cms_form_input_Regex_Msg,
        };
      }

      // Min length
      else if (cms_form_input_Min && value.length < Number(cms_form_input_Min)) {
        updated = {
          ...updated,
          cms_form_input_Min_validation: "Yes",
          cms_form_input_Max_validation: "No",
          cms_form_input_Required_validation: "No",
          cms_form_input_Regex_validation: "No",
          validationMessage: cms_form_input_Min_Msg,
        };
      }

      // Max length
      else if (cms_form_input_Max && value.length > Number(cms_form_input_Max)) {
        updated = {
          ...updated,
          cms_form_input_Max_validation: "Yes",
          cms_form_input_Required_validation: "No",
          cms_form_input_Regex_validation: "No",
          cms_form_input_Min_validation: "No",
          validationMessage: cms_form_input_Max_Msg,
        };
      }

      // All valid
      else {
        updated = {
          ...updated,
          cms_form_input_Required_validation: "No",
          cms_form_input_Regex_validation: "No",
          cms_form_input_Min_validation: "No",
          cms_form_input_Max_validation: "No",
          validationMessage: "",
        };
      }

      // Save to store
      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: updated,
      });

      // Local sync
      setSelectedErrorSet(updated);
    },
    [selectedErrorSet, cms_form_Id, cmsFormInputLabel]
  );

  // --------------------------------------------------------
  // 🔹 Render
  // --------------------------------------------------------
  return (
    <>
      <style>
        {`
          .custom-input::placeholder {
            color: ${placeHolderTextColor};
            font-size: ${placeHolderFontSize};
            font-weight: ${placeHolderFontWeight};
          }
        `}
      </style>

      <input
        className={`${tailwaindClasses} custom-input`}
        placeholder={formattedHeaderText}
        readOnly={readOnly === "true"}
        disabled={disabled === "true"}
        type={
          textInput === "email"
            ? "text"
            : textInput === "phone_number"
            ? "number"
            : textInput
        }
        name={`${selectedErrorSet?.cms_form_input_Name}`?.replace(
          /\s+/g,
          "_"
        )}
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onChange={
          selectedErrorSet?.cms_form_input_On_Change_Validation === "1"
            ? (e) => checkInputFunction(e.target.value)
            : undefined
        }
      />
    </>
  );
};

QInputText.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  bgUrl: PropTypes.string,
  leftPadding: PropTypes.string,
  fontSize: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  placeHolder: PropTypes.string,
  placeHolderFontSize: PropTypes.string,
  placeHolderFontWeight: PropTypes.string,
  placeHolderTextColor: PropTypes.string,
  errorSet: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  cmsFormInputLabel: PropTypes.string,
  cms_form_Id: PropTypes.string,
};

QInputText.displayName = "QInputText";
export default QInputText;
