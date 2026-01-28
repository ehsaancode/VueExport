import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { generateStyle } from "../../utils/helper";
import {
  get,
  setPaginationCurrentPage,
  getPaginationValues,
} from "../../store/index";

const QPageIndicator = ({
  width,
  height,
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
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
  overflow = "",
  onClick = "",
  action = "",
  navigation = "",
  zIndex,
}) => {
  const divRef = useRef(null);
  const navigate = useNavigate();
  const [paginationValues, setPaginationValuesState] = useState({
    totalItemsValue: 0,
    itemsPerPageValue: 5,
    currentPageValue: 1,
  });

  // Update pagination values from utility state
  const updatePaginationValues = () => {
    const values = getPaginationValues();
    setPaginationValuesState(values);
  };

  // Update pagination values periodically
  useEffect(() => {
    updatePaginationValues();
    const interval = setInterval(updatePaginationValues, 100);
    return () => clearInterval(interval);
  }, []);

  const { totalItemsValue, itemsPerPageValue, currentPageValue } =
    paginationValues;
  const totalPages = Math.ceil(totalItemsValue / itemsPerPageValue);

  const handleClick = () => {
    if (onClick === "Yes" && action === "Navigate to") {
      navigate(`/${navigation}`);
    }
  };

  const containerStyle = {
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
      zIndex,
    }),
    marginTop: "4px",
  };

  return (
    <div
      ref={divRef}
      onClick={onClick === "Yes" ? handleClick : undefined}
      style={containerStyle}
    >
      {(() => {
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);
        let start = currentPageValue - half;
        let end = currentPageValue + half;

        if (start < 1) {
          start = 1;
          end = Math.min(totalPages, maxPagesToShow);
        }

        if (end > totalPages) {
          end = totalPages;
          start = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        const pageRange = [];
        for (let i = start; i <= end; i++) {
          pageRange.push(i);
        }

        return pageRange.map((pageNumber) => {
          const isActive = pageNumber === currentPageValue;

          return (
            <span
              key={pageNumber}
              onClick={() => setPaginationCurrentPage(pageNumber)}
              style={{
                padding: "4px 10px",
                background: isActive ? "#1976d2" : "",
                color: isActive ? "#ffffff" : "#000000",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: isActive ? "bold" : "normal",
              }}
            >
              {pageNumber}
            </span>
          );
        });
      })()}
    </div>
  );
};

QPageIndicator.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingLeft: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingRight: PropTypes.string,
  paddingBottom: PropTypes.string,
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
  borderTLR: PropTypes.string,
  borderTRR: PropTypes.string,
  borderBLR: PropTypes.string,
  borderBRR: PropTypes.string,
  borderTW: PropTypes.string,
  borderTC: PropTypes.string,
  borderBW: PropTypes.string,
  borderBC: PropTypes.string,
  borderLW: PropTypes.string,
  borderLC: PropTypes.string,
  borderRW: PropTypes.string,
  borderRC: PropTypes.string,
  shadowBlurRadius: PropTypes.string,
  shadowColor: PropTypes.string,
  shadowOffsetX: PropTypes.string,
  shadowOffsetY: PropTypes.string,
  shadowSpreadRadius: PropTypes.string,
  isAbsoluteValue: PropTypes.bool,
  overflow: PropTypes.string,
  onClick: PropTypes.string,
  action: PropTypes.string,
  navigation: PropTypes.string,
  zIndex: PropTypes.string,
};

export default QPageIndicator;
QPageIndicator.displayName = "QPageIndicator";
