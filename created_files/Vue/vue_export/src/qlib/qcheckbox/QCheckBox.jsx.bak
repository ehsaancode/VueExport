import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { get, setFormErrorSet, subscribe } from "../../store/index";

const QCheckBox = ({
  placeHolder = "",
  options,
  width,
  height,
  bgColor,
  isAbsoluteValue,
  flexDirection = "vertical",
  tailwaindClasses = "",
  cmsFormInputLabel,
  cms_form_Id,
  errorSet,
  activeColor = "#42A5F5",
  inactiveColor = "#E0E0E0",
  size = "24px",
  radius = "20%",
  fillColor = "#E0E0E0",
  style
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);

  /** 🔹 Helper: get error set from store */
  const getSelectedErrorSet = useCallback(() => {
    const formErrorSet = get("formErrorSet");
    return formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel];
  }, [cms_form_Id, cmsFormInputLabel]);

  /** 🔹 Initialize state on mount */
  useEffect(() => {
    const currentErrorSet = getSelectedErrorSet();
    if (currentErrorSet) {
      setSelectedErrorSet(currentErrorSet);
      setSelectedValues(currentErrorSet?.cms_form_check_value || []);
    } else if (errorSet) {
      // parse errorSet if needed
      let parsedErrorSet = errorSet;
      try {
        if (typeof errorSet === "string") parsedErrorSet = JSON.parse(errorSet);
      } catch (err) {
        console.error("❌ Invalid errorSet JSON:", err);
      }

      const enrichedErrorSet = {
        ...parsedErrorSet,
        cms_form_check_value: Array.isArray(
          parsedErrorSet?.cms_form_check_value
        )
          ? parsedErrorSet.cms_form_check_value
          : [],
      };

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: enrichedErrorSet,
      });

      setSelectedErrorSet(enrichedErrorSet);
      setSelectedValues(enrichedErrorSet.cms_form_check_value);
    }
  }, [getSelectedErrorSet, cms_form_Id, cmsFormInputLabel, errorSet]);

  /** 🔹 Subscribe to store updates */
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const updatedErrorSet = getSelectedErrorSet();
      setSelectedErrorSet((prev) => {
        if (JSON.stringify(updatedErrorSet) !== JSON.stringify(prev)) {
          setSelectedValues(updatedErrorSet?.cms_form_check_value || []);
          return updatedErrorSet;
        }
        return prev;
      });
    });

    return () => unsubscribe();
  }, [getSelectedErrorSet]);

  /** 🔹 Normalize options */
  const normalizedOptions = useMemo(() => {
    let opts = selectedErrorSet?.cms_form_input_Options || options || [];
    if (typeof opts === "string") {
      try {
        opts = JSON.parse(opts);
      } catch (e) {
        console.error("❌ Invalid cms_form_input_Options JSON:", opts);
        opts = {};
      }
    }
    const values = opts?.values || [];
    return Array.isArray(values)
      ? values.map((opt) =>
          typeof opt === "string" ? [opt, opt] : [opt.v, opt.l]
        )
      : Object.entries(values || {});
  }, [selectedErrorSet, options]);

  /** 🔹 Validation + update */
  const updateValidation = useCallback(
    (updatedArray) => {
      if (!selectedErrorSet) return;

      let updatedErrorSet = {
        ...selectedErrorSet,
        cms_form_check_value: updatedArray,
      };

      if (selectedErrorSet?.cms_form_input_On_Change_Validation === "1") {
        if (
          selectedErrorSet.cms_form_input_Required === "1" &&
          updatedArray.length === 0
        ) {
          updatedErrorSet.cms_form_input_Required_validation = "Yes";
          updatedErrorSet.cms_form_input_Regex_validation = "No";
        } else if (selectedErrorSet.cms_form_input_Regex) {
          try {
            const regex = new RegExp(selectedErrorSet.cms_form_input_Regex);
            updatedErrorSet.cms_form_input_Regex_validation = updatedArray.some(
              (val) => regex.test(val)
            )
              ? "No"
              : "Yes";
          } catch (err) {
            console.error("❌ Invalid regex:", err);
            updatedErrorSet.cms_form_input_Regex_validation = "No";
          }
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
    [selectedErrorSet, cms_form_Id, cmsFormInputLabel]
  );

  /** 🔹 Handle checkbox click */
  const handleCheckboxChange = useCallback(
    (value) => {
      const updated = selectedValues.includes(value)
        ? selectedValues.filter((val) => val !== value)
        : [...selectedValues, value];

      setSelectedValues(updated);
      updateValidation(updated);
    },
    [selectedValues, updateValidation]
  );

  /** 🔹 Styles */
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: flexDirection === "vertical" ? "column" : "row",
      gap: "10px",
    }),
    [flexDirection]
  );

  const labelStyle = useMemo(
    () => ({
      width,
      height,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      position: isAbsoluteValue === "true" ? "absolute" : "static",
      cursor: "pointer",
    }),
    [width, height, isAbsoluteValue]
  );

  return (
    <div
      className={`checkbox-container ${tailwaindClasses}`}
      //style={containerStyle}
       style={{
          ...containerStyle,
          ...style
        }}
      
    >
      {normalizedOptions.map(([value, label]) => {
        const isChecked = selectedValues.includes(value);
        return (
          <label key={value} style={labelStyle}>
            <input
              type="checkbox"
              value={value}
              name={`${selectedErrorSet?.cms_form_input_Name}`?.replace(
                /\s+/g,
                "_"
              )}
              checked={isChecked}
              onChange={() => handleCheckboxChange(value)}
              style={{ display: "none" }}
            />
            <span
              style={{
                display: "inline-block",
                width: size,
                height: size,
                borderRadius: radius,
                backgroundColor: isChecked ? activeColor : fillColor,
                position: "relative",
                transition: "all 0.2s ease",
                border: isChecked
                  ? `3px solid ${activeColor}`
                  : `2px solid ${inactiveColor}`,
              }}
            >
              {isChecked && (
                <svg
                  viewBox="0 0 24 24"
                  width={parseInt(size) - 6}
                  height={parseInt(size) - 6}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fill: "white",
                  }}
                >
                  <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
                </svg>
              )}
            </span>
            {label}
          </label>
        );
      })}
    </div>
  );
};

QCheckBox.propTypes = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  width: PropTypes.string,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  isAbsoluteValue: PropTypes.string,
  flexDirection: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  cmsFormInputLabel: PropTypes.string,
  cms_form_Id: PropTypes.string,
  errorSet: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  placeHolder: PropTypes.string,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  size: PropTypes.string,
  radius: PropTypes.string,
  fillColor: PropTypes.string,
};

QCheckBox.displayName = "QCheckBox";
export default QCheckBox;
