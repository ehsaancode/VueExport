import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { get, setFormErrorSet, subscribe } from "../../store/index";
import { usePagination } from "../../store/hooks/pagination";

const QDropDown = ({
  options,
  placeHolder = "Select an item",
  width = "100%",
  height = "40px",
  bgColor = "#fff",
  isAbsoluteValue = "false",
  Pagination = "false",
  tailwaindClasses = "",
  cmsFormInputLabel,
  cms_form_Id,
  errorSet,
}) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedErrorSet, setSelectedErrorSet] = useState(null);

  const { setPaginationItemsPerPage } = usePagination();

  /** 🔹 Get errorSet from store */
  const getSelectedErrorSet = useCallback(() => {
    const formErrorSet = get("formErrorSet");
    return formErrorSet?.[cms_form_Id]?.[cmsFormInputLabel] || null;
  }, [cms_form_Id, cmsFormInputLabel]);

  /** 🔹 Sync local state with store */
  useEffect(() => {
    const currentErrorSet = getSelectedErrorSet();
    if (currentErrorSet) {
      setSelectedErrorSet(currentErrorSet);
      setSelectedKey(currentErrorSet.cms_form_dropdown_value || "");
    }
  }, [getSelectedErrorSet]);

  /** 🔹 Initialize errorSet from props */
  useEffect(() => {
    if (cms_form_Id && cmsFormInputLabel && errorSet) {
      let parsedErrorSet = errorSet;
      try {
        if (typeof errorSet === "string") parsedErrorSet = JSON.parse(errorSet);
      } catch (err) {
        console.error("❌ Invalid errorSet JSON:", err);
      }

      const enrichedErrorSet = {
        ...parsedErrorSet,
        cms_form_dropdown_value: parsedErrorSet?.cms_form_dropdown_value || "",
      };

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: enrichedErrorSet,
      });

      setSelectedErrorSet(enrichedErrorSet);
      setSelectedKey(enrichedErrorSet.cms_form_dropdown_value || "");
    }
  }, [cms_form_Id, cmsFormInputLabel, errorSet]);

  /** 🔹 Normalize dropdown options */
  const dropdownOptions = useMemo(() => {
    let opts = selectedErrorSet?.cms_form_input_Options || options || [];
    if (typeof opts === "string") {
      try {
        opts = JSON.parse(opts);
      } catch (e) {
        console.error("❌ Invalid cms_form_input_Options JSON:", opts);
        opts = [];
      }
    }

    if (opts?.values && Array.isArray(opts.values)) return opts.values;
    if (Array.isArray(opts)) return opts;

    return [];
  }, [selectedErrorSet, options]);

  /** 🔹 Handle selection */
  const handleSelect = useCallback(
    (option) => {
      setSelectedKey(option.v);
      setIsOpen(false);

      if (!selectedErrorSet) return;

      const updatedErrorSet = {
        ...selectedErrorSet,
        cms_form_dropdown_value: option.v,
      };

      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: updatedErrorSet,
      });

      setSelectedErrorSet(updatedErrorSet);

      if (Pagination === "true") {
        setPaginationItemsPerPage(Number(option.l));
      }
    },
    [
      selectedErrorSet,
      cms_form_Id,
      cmsFormInputLabel,
      Pagination,
      setPaginationItemsPerPage,
    ]
  );

  /** 🔹 Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** 🔹 Subscribe to store changes */
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const updatedErrorSet = getSelectedErrorSet();
      if (updatedErrorSet?.cms_form_dropdown_value !== selectedKey) {
        setSelectedErrorSet(updatedErrorSet);
        setSelectedKey(updatedErrorSet?.cms_form_dropdown_value || "");
      }
    });
    return () => unsubscribe();
  }, [getSelectedErrorSet, selectedKey]);

  // Handle bgColor as solid, linear, or radial gradient
  let effectiveBgColor = bgColor;
  let effectiveBgImage = undefined;
  if (bgColor && (bgColor.trim().startsWith("linear-gradient(") || bgColor.trim().startsWith("radial-gradient("))) {
    effectiveBgColor = "transparent";
    effectiveBgImage = bgColor;
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative ${tailwaindClasses}`}
      style={{
      width,
      height,
      position: isAbsoluteValue === "true" ? "absolute" : "relative",
      // backgroundColor: bgColor,
      backgroundColor: effectiveBgColor,
      backgroundImage: effectiveBgImage,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
    }}

    >
      <input
        type="hidden"
        value={selectedKey}
        name={selectedErrorSet?.cms_form_input_Name?.replace(/\s+/g, "_")}
      />

      {/* Dropdown Header */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex justify-between w-full"
      >
        {Array.isArray(dropdownOptions)
          ? dropdownOptions.find((opt) => opt.v === selectedKey)?.l ||
            placeHolder
          : placeHolder}
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </div>

      {/* Dropdown List */}
      {isOpen &&
        Array.isArray(dropdownOptions) &&
        dropdownOptions.length > 0 && (
          <div
            className="absolute w-full border border-gray-300 bg-white shadow-md z-50"
            style={{
              ...(Pagination === "true" ? { bottom: "100%" } : { top: "100%" }),
            }}
          >
            {dropdownOptions.map((option, idx) => {
              const isSelected = selectedKey === option.v;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 cursor-pointer ${
                    isSelected ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  {option.l}
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

QDropDown.propTypes = {
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bgColor: PropTypes.string,
  isAbsoluteValue: PropTypes.string,
  Pagination: PropTypes.string,
  tailwaindClasses: PropTypes.string,
  cmsFormInputLabel: PropTypes.string,
  cms_form_Id: PropTypes.string,
  errorSet: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeHolder: PropTypes.string,
};

QDropDown.displayName = "QDropDown";

export default QDropDown;
