import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { get, setFormErrorSet, subscribe } from "../../store";

const QMultiSelectDropdown = forwardRef(
  (
    {
      items = [],
      initialSelectedValues = [],
      onSelectionChange,
      hasImage = true,
      hasCheckbox = true,
      hasSearch = true,
      selectAllOption = true,
      width = "100%",
      height = "auto",
      margin = "0",
      padding = "0",
      textColor = "#333",
      placeholder = "Select items...",
      hoverColor = "#f0f0f0",
      selectedItemColor = "#e0e7ff",
      checkboxFillColor = "#4f46e5",
      chipBgColor = "#e0e7ff",
      chipBorderColor = "#c7d2fe",
      dropdownBorderColor = "#ccc",
      tailwindClasses = "",
      bgColor = "transparent",
      cmsFormInputLabel = "",
      cms_form_Id = "",
      errorSet = {},
      headerText = "",
    },
    ref
  ) => {
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [parsedErrorSet, setParsedErrorSet] = useState({});

    /** 🔹 Initialize selected items from initialSelectedValues */
    useEffect(() => {
      const initial = items.filter((item) =>
        initialSelectedValues.includes(item.value)
      );
      setSelectedItems(initial);
    }, [initialSelectedValues, items]);

    /** 🔹 Parse errorSet from props and sync with store */
    useEffect(() => {
      let parsed = {};
      try {
        parsed = typeof errorSet === "string" ? JSON.parse(errorSet) : errorSet;
      } catch (err) {
        console.error("❌ Invalid errorSet JSON:", err);
      }
      const normalized = {
        ...parsed,
        cms_form_input_Required_validation: "No",
        cms_form_check_value: initialSelectedValues,
      };
      setParsedErrorSet(normalized);
      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: normalized,
      });
    }, [cms_form_Id, cmsFormInputLabel, errorSet, initialSelectedValues]);

    /** 🔹 Subscribe to store changes */
    useEffect(() => {
      const unsubscribe = subscribe(() => {
        const updatedErrorSet =
          get("formErrorSet")?.[cms_form_Id]?.[cmsFormInputLabel];
        if (updatedErrorSet) {
          setParsedErrorSet(updatedErrorSet);
          const updatedItems = items.filter((item) =>
            (updatedErrorSet.cms_form_check_value || []).includes(item.value)
          );
          setSelectedItems(updatedItems);
        }
      });
      return () => unsubscribe();
    }, [cms_form_Id, cmsFormInputLabel, items]);

    /** 🔹 Close dropdown on outside click */
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** 🔹 Filter items based on searchTerm */
    const filteredItems = useMemo(
      () =>
        items.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      [items, searchTerm]
    );

    /** 🔹 Sync selected items to errorSet */
    const syncErrorSet = useCallback(
      (newSelected) => {
        if (!parsedErrorSet) return;
        const updated = {
          ...parsedErrorSet,
          cms_form_check_value: newSelected.map((i) => i.value),
          cms_form_input_Required_validation:
            parsedErrorSet.cms_form_input_Required === "1" &&
            newSelected.length === 0
              ? "Yes"
              : "No",
        };
        setParsedErrorSet(updated);
        setFormErrorSet({
          cms_form_Id,
          cmsFormInputLabel,
          errorSet: updated,
        });
      },
      [parsedErrorSet, cms_form_Id, cmsFormInputLabel]
    );

    /** 🔹 Toggle single item */
    const handleItemClick = useCallback(
      (item) => {
        const exists = selectedItems.some((si) => si.value === item.value);
        const newSelected = exists
          ? selectedItems.filter((si) => si.value !== item.value)
          : [...selectedItems, item];
        setSelectedItems(newSelected);
        syncErrorSet(newSelected);
        onSelectionChange?.(newSelected.map((i) => i.value));
      },
      [selectedItems, onSelectionChange, syncErrorSet]
    );

    /** 🔹 Select / unselect all visible items */
    const handleSelectAll = () => {
      const allVisibleSelected =
        filteredItems.length > 0 &&
        filteredItems.every((item) =>
          selectedItems.some((si) => si.value === item.value)
        );

      const newSelected = allVisibleSelected
        ? selectedItems.filter(
            (item) => !filteredItems.some((fi) => fi.value === item.value)
          )
        : [
            ...selectedItems,
            ...filteredItems.filter(
              (item) => !selectedItems.some((si) => si.value === item.value)
            ),
          ];

      setSelectedItems(newSelected);
      syncErrorSet(newSelected);
      onSelectionChange?.(newSelected.map((i) => i.value));
    };

    const isAllSelected =
      filteredItems.length > 0 &&
      filteredItems.every((item) =>
        selectedItems.some((si) => si.value === item.value)
      );

    /** 🔹 Expose validation via ref */
    const validate = useCallback(() => {
      if (!parsedErrorSet) return true;
      const updated = {
        ...parsedErrorSet,
        cms_form_input_Required_validation:
          parsedErrorSet.cms_form_input_Required === "1" &&
          selectedItems.length === 0
            ? "Yes"
            : "No",
      };
      setParsedErrorSet(updated);
      setFormErrorSet({
        cms_form_Id,
        cmsFormInputLabel,
        errorSet: updated,
      });
      return updated.cms_form_input_Required_validation === "No";
    }, [parsedErrorSet, selectedItems, cms_form_Id, cmsFormInputLabel]);

    useImperativeHandle(ref, () => ({ validate }));

    const inputName =
      parsedErrorSet?.cms_form_input_Name?.replace(/\s+/g, "_") || "";

    return (
      <div
        ref={dropdownRef}
        className={`relative ${tailwindClasses}`}
        style={{
          width,
          height,
          margin,
          padding,
          color: textColor,
          // backgroundColor: bgColor,
          ...(bgColor && (bgColor.includes("linear-gradient") || bgColor.includes("radial-gradient"))
            ? { backgroundImage: bgColor, backgroundColor: "transparent" }
            : { backgroundColor: bgColor }),
        }}
      >
        {headerText && <label className="block mb-1">{headerText}</label>}

        {/* Hidden inputs */}
        {selectedItems.map((item) => (
          <input
            key={item.value}
            type="hidden"
            name={inputName}
            value={item.value}
          />
        ))}

        {/* Input field */}
        <div
          className="flex justify-between items-center border rounded px-3 py-2 cursor-pointer"
          style={{ borderColor: dropdownBorderColor }}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <span
                  key={item.value}
                  className="flex items-center rounded-full text-sm px-2 py-1"
                  style={{
                    backgroundColor: chipBgColor,
                    border: chipBorderColor
                      ? `1px solid ${chipBorderColor}`
                      : 0,
                  }}
                >
                  {item.label}
                  <button
                    type="button"
                    className="ml-2 font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <span
            className="ml-2 transition-transform"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </div>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute left-0 right-0 border rounded-b bg-white z-50 max-h-72 flex flex-col shadow">
            {hasSearch && (
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            )}

            {selectAllOption && hasCheckbox && (
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                onClick={handleSelectAll}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  readOnly
                  style={{ accentColor: checkboxFillColor }}
                />
                <span>Select All</span>
              </div>
            )}

            <div className="overflow-y-auto max-h-56">
              {filteredItems.map((item) => {
                const isSelected = selectedItems.some(
                  (si) => si.value === item.value
                );
                return (
                  <div
                    key={item.value}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    style={{
                      backgroundColor: isSelected
                        ? selectedItemColor
                        : "transparent",
                    }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={(e) =>
                      !isSelected &&
                      (e.currentTarget.style.backgroundColor = hoverColor)
                    }
                    onMouseLeave={(e) =>
                      !isSelected &&
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {hasCheckbox && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        style={{ accentColor: checkboxFillColor }}
                      />
                    )}
                    {hasImage && item.image && (
                      <img
                        src={item.image}
                        alt={item.label}
                        className="w-6 h-6 rounded object-cover"
                      />
                    )}
                    <span className="flex-1">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

QMultiSelectDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  initialSelectedValues: PropTypes.array,
  onSelectionChange: PropTypes.func,
  hasImage: PropTypes.bool,
  hasCheckbox: PropTypes.bool,
  hasSearch: PropTypes.bool,
  selectAllOption: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textColor: PropTypes.string,
  placeholder: PropTypes.string,
  hoverColor: PropTypes.string,
  selectedItemColor: PropTypes.string,
  checkboxFillColor: PropTypes.string,
  chipBgColor: PropTypes.string,
  chipBorderColor: PropTypes.string,
  dropdownBorderColor: PropTypes.string,
  tailwindClasses: PropTypes.string,
  bgColor: PropTypes.string,
  cmsFormInputLabel: PropTypes.string,
  cms_form_Id: PropTypes.string,
  errorSet: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  headerText: PropTypes.string,
};

QMultiSelectDropdown.displayName = "QMultiSelectDropdown";

export default QMultiSelectDropdown;
