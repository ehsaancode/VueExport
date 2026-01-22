import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { generateStyle } from "../../utils/helper";
import {
  get,
  setPaginationGlobalSearch,
  setPaginationFilterSearch,
} from "../../store/index";

const QInputSearch = ({
  width,
  height,
  padding,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  margin,
  marginLeft,
  marginTop,
  marginRight,
  marginBottom,
  positionedLeft,
  positionedTop,
  positionedRight,
  positionedBottom,
  color,
  bgColor,
  borderRadius,
  borderColor,
  borderWidth,
  bgUrl,
  isImageFill,
  widthType,
  heightType,
  children,
  widthPercent,
  heightPercent,
  alignment,
  mainAlignment,
  crossAlignment,
  borderTLR,
  borderTRR,
  borderBLR,
  borderBRR,
  borderTW,
  borderTC,
  borderBW,
  borderBC,
  borderLW,
  borderLC,
  borderRW,
  borderRC,
  shadowSpreadRadius,
  shadowBlurRadius,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor,
  isAbsoluteValue,
  headerText = "",
  fontSize,
  fontFamily,
  overflow,
  onClick,
  zIndex,
  iconLink,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState("");

  // Get global search value from utility state
  const updateGlobalSearchValue = () => {
    const pagination = get("pagination") || {};
    setGlobalSearchValue(pagination.globalSearch || "");
  };

  // Update global search value periodically
  useEffect(() => {
    updateGlobalSearchValue();
    const interval = setInterval(updateGlobalSearchValue, 100);
    return () => clearInterval(interval);
  }, []);

  // Format placeholder text: replace underscores, capitalize each word
  const formattedHeaderText = headerText
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const containerStyle = {
    border: "0px",
    ...generateStyle({
      width,
      height,
      isAbsoluteValue,
      positionedLeft,
      positionedTop,
      positionedRight,
      positionedBottom,
      bgColor,
      bgUrl,
      isImageFill,
      color,
      borderRadius,
      borderTLR,
      borderTRR,
      borderBLR,
      borderBRR,
      borderWidth,
      borderColor,
      borderTW,
      borderBW,
      borderLW,
      borderRW,
      borderTC,
      borderBC,
      borderLC,
      borderRC,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlurRadius,
      shadowSpreadRadius,
      shadowColor,
      overflow,
      mainAlignment,
      crossAlignment,
      onClick,
      zIndex,
    }),
  };

  const handleGlobalSearch = (e) => {
    const value = e.target.value;
    setGlobalSearchValue(value);
    setPaginationGlobalSearch(value);
    setPaginationFilterSearch("No");
  };

  return (
    <>
      <style>
        {`
          .gSearchInput::placeholder {
            color: ${color || "black"};
          }
        `}
      </style>

      {iconLink ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            className="gSearchInput"
            placeholder={formattedHeaderText}
            type="text"
            required
            value={globalSearchValue}
            name={headerText}
            style={containerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onChange={handleGlobalSearch}
          />
          <img src={iconLink} alt="icon" style={{ marginLeft: "8px" }} />
        </div>
      ) : (
        <input
          className="gSearchInput"
          placeholder={formattedHeaderText}
          type="text"
          required
          value={globalSearchValue}
          name={headerText}
          style={containerStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onChange={handleGlobalSearch}
        />
      )}
    </>
  );
};

// PropTypes for validation
QInputSearch.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.string,
  paddingLeft: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingRight: PropTypes.string,
  paddingBottom: PropTypes.string,
  margin: PropTypes.string,
  marginLeft: PropTypes.string,
  marginTop: PropTypes.string,
  marginRight: PropTypes.string,
  marginBottom: PropTypes.string,
  positionedLeft: PropTypes.string,
  positionedTop: PropTypes.string,
  positionedRight: PropTypes.string,
  positionedBottom: PropTypes.string,
  color: PropTypes.string,
  bgColor: PropTypes.string,
  borderRadius: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.string,
  bgUrl: PropTypes.string,
  isImageFill: PropTypes.bool,
  shadowBlurRadius: PropTypes.string,
  shadowColor: PropTypes.string,
  shadowOffsetX: PropTypes.string,
  shadowOffsetY: PropTypes.string,
  shadowSpreadRadius: PropTypes.string,
  mainAlignment: PropTypes.string,
  crossAlignment: PropTypes.string,
  widthType: PropTypes.string,
  heightType: PropTypes.string,
  children: PropTypes.node,
  headerText: PropTypes.string,
  fontSize: PropTypes.string,
  iconLink: PropTypes.string,
};

export default QInputSearch;
QInputSearch.displayName = "QInputSearch";
