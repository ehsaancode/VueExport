import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { get, setFormErrorSet, subscribe } from "../../store/index";

const QRadio = ({
  placeHolder = "",
  options,
  width,
  height,
  bgColor,
  isAbsoluteValue,
  flexDirection = "horizontal",
  tailwaindClasses = "",
  cmsFormInputLabel,
  cms_form_Id,
  errorSet,
  activeColor = "#42A5F5",
  inactiveColor = "#E0E0E0",
  size = "24px",
  radius = "50%",
  fillColor = "#E0E0E0",
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);

  /** 🔹 Deep clone helper */
  const deepClone = (obj) =>
    typeof structuredClone === "function"
      ? structuredClone(obj)
      : JSON.parse(JSON.stringify(obj));

  /** 🔹 Get error set from global store as a mutable object */
  const getSelectedErrorSet = useCallback(() => {
    const formErrorSet = get("formErrorSet");
    const errorObj = formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel];
    return errorObj ? deepClone(errorObj) : null;
  }, [cms_form_Id, cmsFormInputLabel]);

  /** 🔹 SINGLE useEffect for all state management */
  useEffect(() => {
    const currentErrorSet = getSelectedErrorSet();

    if (currentErrorSet?.cms_form_radio_value !== undefined) {
      setSelectedErrorSet(currentErrorSet);
      setSelectedValue(currentErrorSet.cms_form_radio_value);
    } else if (errorSet) {
      // If no value in the store, and initial props exist, dispatch them.
      let parsedErrorSet = errorSet;
      try {
        if (typeof errorSet === "string") {
          parsedErrorSet = JSON.parse(errorSet);
        }
      } catch (err) {
        console.error("❌ Invalid errorSet JSON:", err);
      }

      const valueToSet = parsedErrorSet.cms_form_radio_value || "";

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: deepClone({
          ...parsedErrorSet,
          cms_form_radio_value: valueToSet,
        }),
      });

      setSelectedValue(valueToSet);
      setSelectedErrorSet({
        ...parsedErrorSet,
        cms_form_radio_value: valueToSet,
      });
    }

    // Subscribe to store changes to keep local state in sync with global store
    const unsubscribe = subscribe(() => {
      const updatedErrorSet = getSelectedErrorSet();
      setSelectedErrorSet((prev) => {
        if (
          updatedErrorSet?.cms_form_radio_value !== selectedValue ||
          JSON.stringify(updatedErrorSet) !== JSON.stringify(prev)
        ) {
          setSelectedValue(updatedErrorSet?.cms_form_radio_value || "");
          return updatedErrorSet;
        }
        return prev;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [
    getSelectedErrorSet,
    errorSet,
    cms_form_Id,
    cmsFormInputLabel,
    selectedValue,
  ]);

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

  /** 🔹 Validation & update store */
  const handleSelectedRadio = useCallback(
    (selected) => {
      if (!selectedErrorSet) return;

      const clonedErrorSet = deepClone(selectedErrorSet);

      clonedErrorSet.cms_form_radio_value = selected;
      clonedErrorSet.cms_form_input_Required_validation =
        clonedErrorSet.cms_form_input_Required === "1" && !selected
          ? "Yes"
          : "No";
      clonedErrorSet.cms_form_input_Regex_validation = "No";

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: clonedErrorSet,
      });

      setSelectedErrorSet(clonedErrorSet);
    },
    [selectedErrorSet, cms_form_Id, cmsFormInputLabel]
  );

  /** 🔹 Handle radio change */
  const handleRadioChange = useCallback(
    (option) => {
      setSelectedValue(option);
      handleSelectedRadio(option);
    },
    [handleSelectedRadio]
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
      className={`radio-container ${tailwaindClasses}`}
      style={containerStyle}
    >
      {normalizedOptions.map(([key, value]) => {
        const isChecked = selectedValue === key;
        return (
          <label key={key} style={labelStyle}>
            <input
              type="radio"
              value={key}
              name={`${selectedErrorSet?.cms_form_input_Name}`?.replace(
                /\s+/g,
                "_"
              )}
              checked={isChecked}
              onChange={() => handleRadioChange(key)}
              style={{ display: "none" }}
            />
            <span
              style={{
                display: "inline-block",
                width: size,
                height: size,
                borderRadius: radius,
                backgroundColor: isChecked ? "" : fillColor,
                position: "relative",
                transition: "all 0.2s ease",
                border: isChecked
                  ? `2px solid ${activeColor}`
                  : `2px solid ${inactiveColor}`,
              }}
            >
              {isChecked && (
                <svg
                  viewBox="0 0 24 24"
                  width={size ? parseInt(size) - 6 : 18}
                  height={size ? parseInt(size) - 6 : 18}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fill: activeColor,
                  }}
                >
                  <circle cx="12" cy="12" r="7" />
                </svg>
              )}
            </span>
            {value}
          </label>
        );
      })}
    </div>
  );
};

QRadio.propTypes = {
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

QRadio.displayName = "QRadio";
export default QRadio;
