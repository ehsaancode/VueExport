import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { generateStyle, generateSearchStyle } from "../../utils/helper";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentPage,
  setData,
  setItemsPerPage,
  setPerPageCurrentData,
  setGlobalSearch,
  setColumnSearch,
  setFilterSearch,
} from "../../store/paginationSlice";

const linkStyle = {
  color: "#1a73e8",
  cursor: "pointer",
  fontSize: "12px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const inputStyle = {
  width: "90%",
  padding: "8px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
};

const cancelButtonStyle = {
  backgroundColor: "#f1f1f1",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",

  //cursor: "not-allowed",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
};

const okButtonStyle = {
  backgroundColor: "#1a73e8",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "700",
};

// const tableData = {
//   headers: [
//     {
//       headerTitle: "First Name",
//       accessor: "firstName",
//       short: "Yes",
//       search: "Yes",
//       filter: "Yes",
//       value: "",
//       show: true,
//     },
//     {
//       headerTitle: "Last Name",
//       accessor: "lastName",
//       short: "Yes",
//       search: "Yes",
//       filter: "Yes",
//       value: "",
//       show: true,
//     },
//     {
//       headerTitle: "Email",
//       accessor: "email",
//       short: "No",
//       search: "Yes",
//       filter: "Yes",
//       value: "",
//       show: true,
//     },
//     {
//       headerTitle: "Phone",
//       accessor: "phone",
//       short: "Yes",
//       search: "Yes",
//       filter: "Yes",
//       value: "",
//       show: true,
//     },
//     {
//       headerTitle: "Status",
//       accessor: "status",
//       short: "Yes",
//       search: "Yes",
//       filter: "Yes",
//       value: "",
//       show: true,
//     },
//   ],
//   rows: [
//     {
//       firstName: "John",
//       lastName: "Doe",
//       email: "john.doe@example.com",
//       phone: "123-456-7890",
//       status: "Active",
//     },
//     {
//       firstName: "Jane",
//       lastName: "Smith",
//       email: "jane.smith@example.com",
//       phone: "987-654-3210",
//       status: "Pending",
//     },
//     {
//       firstName: "Alice",
//       lastName: "Johnson",
//       email: "alice.j@example.com",
//       phone: "555-000-1111",
//       status: "Inactive",
//     },
//     {
//       firstName: "Michael",
//       lastName: "Brown",
//       email: "michael.brown@example.com",
//       phone: "444-222-3333",
//       status: "Active",
//     },
//     {
//       firstName: "Emily",
//       lastName: "Davis",
//       email: "emily.davis@example.com",
//       phone: "222-333-4444",
//       status: "Inactive",
//     },
//     {
//       firstName: "David",
//       lastName: "Wilson",
//       email: "david.wilson@example.com",
//       phone: "111-222-3333",
//       status: "Active",
//     },
//     {
//       firstName: "Olivia",
//       lastName: "Martinez",
//       email: "olivia.m@example.com",
//       phone: "333-444-5555",
//       status: "Pending",
//     },
//     {
//       firstName: "Daniel",
//       lastName: "Anderson",
//       email: "daniel.a@example.com",
//       phone: "999-888-7777",
//       status: "Inactive",
//     },
//     {
//       firstName: "Sophia",
//       lastName: "Taylor",
//       email: "sophia.taylor@example.com",
//       phone: "666-555-4444",
//       status: "Active",
//     },
//     {
//       firstName: "James",
//       lastName: "Thomas",
//       email: "james.t@example.com",
//       phone: "777-666-5555",
//       status: "Pending",
//     },
//     {
//       firstName: "Isabella",
//       lastName: "Hernandez",
//       email: "isabella.h@example.com",
//       phone: "555-666-7777",
//       status: "Inactive",
//     },
//     {
//       firstName: "Matthew",
//       lastName: "Moore",
//       email: "matthew.moore@example.com",
//       phone: "222-555-6666",
//       status: "Active",
//     },
//     {
//       firstName: "Ava",
//       lastName: "Martin",
//       email: "ava.m@example.com",
//       phone: "123-321-4567",
//       status: "Pending",
//     },
//     {
//       firstName: "Ethan",
//       lastName: "Jackson",
//       email: "ethan.j@example.com",
//       phone: "456-789-1234",
//       status: "Inactive",
//     },
//     {
//       firstName: "Mia",
//       lastName: "White",
//       email: "mia.w@example.com",
//       phone: "789-123-4567",
//       status: "Active",
//     },
//     {
//       firstName: "Benjamin",
//       lastName: "Harris",
//       email: "ben.h@example.com",
//       phone: "321-654-9870",
//       status: "Pending",
//     },
//     {
//       firstName: "Charlotte",
//       lastName: "Clark",
//       email: "charlotte.c@example.com",
//       phone: "654-987-3210",
//       status: "Inactive",
//     },
//     {
//       firstName: "Alexander",
//       lastName: "Lewis",
//       email: "alex.lewis@example.com",
//       phone: "987-321-6540",
//       status: "Active",
//     },
//   ],
// };

const QTableData = ({
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
  bgColor = "",
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
  overflow = "",
  onClick = "",
  action = "",
  navigation = "",
  zIndex,
  taggedKey,
  shortType,
  apiUrl,
  payload,
  TotalPage,
  perPageSize1,
  currentPage,
  pagination,
  tableData,
}) => {
  const [allData, setAllData] = useState([]);
  const [headerArray, setHeaderArray] = useState([]);
  const [shortBY, setShortBY] = useState("ASC");
  const [shortField, setShortField] = useState("");
  const [TotalPageSet, SetUpTotalPage] = useState(TotalPage);
  const [SearchByColumnArray, SetSearchByColumnArray] = useState([]);
  const [ColumnFilterValue, SetColumnFilterValue] = useState("");
  const [columnName, SetColumnName] = useState("");
  const [SelectedFilterArray, setSelectedFilterArray] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedDataState, setPaginatedDataState] = useState([]);
  const hasFetched = useRef(false);
  const dispatch = useDispatch();

  const globalSearchValue = useSelector(
    (state) => state.pagination.globalSearch
  );

  const itemsPerPageValue = useSelector(
    (state) => state.pagination.itemsPerPage
  );

  const currentPageNumber = useSelector(
    (state) => state.pagination.currentPage
  );

  const filterSearchValue = useSelector(
    (state) => state.pagination.filterSearch
  );

  const prevItemsPerPageRef = useRef(itemsPerPageValue);

  useEffect(() => {
    if (itemsPerPageValue !== prevItemsPerPageRef.current) {
      const updatedHeaders = headerArray.map((header) => ({
        ...header,
        value: "",
      }));
      setHeaderArray(updatedHeaders);
    }
    if (filterSearchValue == "No") {
      setSelectedFilterArray([]);
    }
  }, [itemsPerPageValue, filterSearchValue]);

  useEffect(() => {
    if (hasFetched.current) return; // Prevent API call if already fetched
    hasFetched.current = true;
    const fetchData = async () => {
      setHeaderArray(tableData.headers);
      if (shortType === "fromData") {
        setAllData(tableData.rows);
        dispatch(
          setData({ items: tableData.rows, total: tableData.rows.length })
        );
      } else {
        const payloadSetting = {
          payload,
        };

        try {
          const response = await axios.post(apiUrl, payloadSetting, {
            headers: {
              Authorization: "Bearer your-token-here", // Replace with actual token
              "Content-Type": "application/json",
            },
          });
          const vals = response.data.data1;
          const firstTaggedEntry = vals.find((obj) =>
            obj.hasOwnProperty(taggedKey)
          );
          const firstTaggedData = firstTaggedEntry
            ? firstTaggedEntry[taggedKey]
            : [];
          setAllData(firstTaggedData);
          SetUpTotalPage(firstTaggedData.length);
          dispatch(
            setData({ items: firstTaggedData, total: firstTaggedData.length })
          );
          //  handleGlobalSearch(globalSearchValue);
        } catch (error) {
          console.error("API call failed:", error);
        }
      }
    };

    fetchData();
  }, [apiUrl, shortType]); // Only run effect when apiUrl or shortType changes

  useEffect(() => {
    let result = [...allData];
    // Apply Global filter
    if (globalSearchValue) {
      const lowerGlobalFilter = globalSearchValue.toLowerCase();
      if (shortType == "fromData") {
        result = allData.filter((row) => {
          const values = Object.values(row);
          const matched = values.some((val) => {
            const valStr = String(val).toLowerCase();
            const includes = valStr.includes(lowerGlobalFilter);
            return includes;
          });
          return matched;
        });
      } else if (shortType == "apiData") {
        console.log("lop");
        result = allData.filter((row) => {
          const values = Object.values(row);
          const matched = values.some((val) => {
            const valStr = String(val).toLowerCase();
            const includes = valStr.includes(lowerGlobalFilter);
            return includes;
          });
          return matched;
        });
      }
    }

    // Apply Column-specific filters
    const searchFilters = headerArray
      .filter((h) => h.search === "Yes" && h.value)
      .map((h) => ({ accessor: h.accessor, value: h.value.toLowerCase() }));

    if (shortType == "fromData") {
      if (searchFilters.length > 0) {
        result = result.filter((row) =>
          searchFilters.every((f) =>
            (row[f.accessor] ?? "").toString().toLowerCase().includes(f.value)
          )
        );
      }
    } else {
      if (searchFilters.length > 0) {
        result = result.filter((row) =>
          searchFilters.every((f) =>
            (row[f.accessor] ?? "").toString().toLowerCase().includes(f.value)
          )
        );
      }
    }

    // Sorting
    if (shortType === "fromData" && shortField) {
      result = result.sort((a, b) => {
        const aVal = (a[shortField] ?? "").toString().toLowerCase();
        const bVal = (b[shortField] ?? "").toString().toLowerCase();
        return shortBY === "ASC"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    } else if (shortType === "apiData" && shortField) {
      result = result.sort((a, b) => {
        const aVal = (a[shortField] ?? "").toString().toLowerCase();
        const bVal = (b[shortField] ?? "").toString().toLowerCase();
        return shortBY === "ASC"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    if (columnName) {
      if (shortType == "fromData") {
        if (SelectedFilterArray.length > 0) {
          result = allData.filter((row) =>
            SelectedFilterArray.some(
              (filterValue) =>
                (row[columnName] ?? "").toLowerCase() ===
                filterValue.toLowerCase()
            )
          );
        } else {
          result = allData;
        }
      }
    }

    // Set filtered data
    setFilteredData(result);

    // if (globalFilter || (searchFilters.length > 0 && shortType == "fromData" ) || columnName!='') {
    if (globalSearchValue || searchFilters.length > 0 || columnName != "") {
      SetUpTotalPage(Math.ceil(result.length / itemsPerPageValue));
      if (Math.ceil(result.length / itemsPerPageValue) == 1) {
        dispatch(setCurrentPage(1));
      }
      const startIndex = (currentPageNumber - 1) * itemsPerPageValue;
      const paginated = result.slice(
        startIndex,
        startIndex + itemsPerPageValue
      );
      setPaginatedDataState(paginated);
      dispatch(setPerPageCurrentData(result));
    } else {
      SetUpTotalPage(Math.ceil(result.length / itemsPerPageValue));
      const startIndex = (currentPageNumber - 1) * itemsPerPageValue;
      const paginated = result.slice(
        startIndex,
        startIndex + itemsPerPageValue
      );
      setPaginatedDataState(paginated);
      dispatch(setPerPageCurrentData(result));
    }
  }, [
    allData,
    headerArray,
    shortField,
    shortBY,
    globalSearchValue,
    currentPageNumber,
    itemsPerPageValue,
    shortType,
  ]);

  const sortData = (accessor, isSortable) => {
    SetColumnName("");
    setSelectedFilterArray([]);
    if (isSortable !== "Yes") return;
    setShortField(accessor);
    setShortBY(shortBY === "ASC" ? "DESC" : "ASC");
  };

  const handleSearch = (e, accessor, index) => {
    const value = e.target.value.trim();
    dispatch(setColumnSearch(value !== "" ? "Yes" : "No"));
    dispatch(setFilterSearch("No"));
    SetColumnName("");
    setSelectedFilterArray([]);
    const updatedHeaders = [...headerArray];
    updatedHeaders[index].value = value;
    setHeaderArray(updatedHeaders);
  };

  const handleSearchByColumn = (e, accessor) => {
    const searchValue = e.target.value.toLowerCase();
    setSelectedFilterArray([]);
    SetSearchByColumnArray([]);
    SetColumnFilterValue("");

    if (searchValue) {
      SetColumnFilterValue(searchValue);
      const result = allData
        .map((row) => row[accessor]) // get only column values
        .filter(
          (value) => value && value.toLowerCase().includes(searchValue) // filter matches
        );

      // remove duplicates using Set
      const uniqueResult = [...new Set(result)];

      SetSearchByColumnArray(uniqueResult);
    } else {
      const result = allData
        .map((row) => row[columnName])
        .filter((value) => value !== undefined && value !== null)
        .map((value) => value.toString().toLowerCase()); // Optional: normalize case
      const uniqueSorted = [...new Set(result)].sort();
      SetSearchByColumnArray(uniqueSorted);
    }
  };

  const [activeFilterIndex, setActiveFilterIndex] = useState(null);

  const handleCheckboxChange = (value, accessor) => {
    setSelectedFilterArray((prevSelected) => {
      let updated;
      if (prevSelected.includes(value)) {
        // Uncheck = remove
        updated = prevSelected.filter((v) => v !== value);
      } else {
        // Check = add
        updated = [...prevSelected, value];
      }

      // Move logic here to use the latest "updated" value
      setTimeout(() => {
        if (shortType === "fromData") {
          let result;
          if (updated.length > 0) {
            result = allData.filter((row) =>
              updated.some(
                (filterValue) =>
                  (row[accessor] ?? "").toLowerCase() ===
                  filterValue.toLowerCase()
              )
            );
          } else {
            result = allData;
          }

          SetUpTotalPage(Math.ceil(result.length / itemsPerPageValue));

          if (Math.ceil(result.length / itemsPerPageValue) === 1) {
            dispatch(setCurrentPage(1));
          }

          const startIndex = (currentPageNumber - 1) * itemsPerPageValue;
          const paginated = result.slice(
            startIndex,
            startIndex + itemsPerPageValue
          );
          setPaginatedDataState(paginated);
        }
      }, 1000);

      return updated; // make sure to return the new value for React to update state
    });
  };

  const openFilter = (index, ColumnName) => {
    dispatch(setFilterSearch("Yes"));
    if (columnName !== ColumnName) {
      setSelectedFilterArray([]); // Reset only if it's a different column
      const updatedHeaders = headerArray.map((header) => ({
        ...header,
        value: "",
      }));
      setHeaderArray(updatedHeaders);
    }
    SetColumnName(ColumnName);
    setActiveFilterIndex((prev) => (prev === index ? null : index));
    dispatch(setGlobalSearch(""));

    const result = allData
      .map((row) => row[ColumnName])
      .filter((value) => value !== undefined && value !== null)
      .map((value) => value.toString().toLowerCase()); // Optional: normalize case
    const uniqueSorted = [...new Set(result)].sort();
    SetSearchByColumnArray(uniqueSorted);
    SetColumnFilterValue("");
  };

  const ColumnWiseFilter = (columnName) => {
    //  if (shortType == "fromData") {
    let result;
    if (SelectedFilterArray.length > 0) {
      dispatch(setFilterSearch("Yes"));
      result = allData.filter((row) =>
        SelectedFilterArray.some(
          (filterValue) =>
            (row[columnName] ?? "").toLowerCase() === filterValue.toLowerCase()
        )
      );
    } else {
      dispatch(setFilterSearch("No"));
      result = allData;
    }

    SetUpTotalPage(Math.ceil(result.length / itemsPerPageValue));

    if (Math.ceil(result.length / itemsPerPageValue) == 1) {
      dispatch(setCurrentPage(1));
    }
    const startIndex = (currentPageNumber - 1) * itemsPerPageValue;
    const paginated = result.slice(startIndex, startIndex + itemsPerPageValue);
    setPaginatedDataState(paginated);
    dispatch(setPerPageCurrentData(result));
    setActiveFilterIndex(null);
    // setSelectedFilterArray([]);
    SetSearchByColumnArray([]);
    SetColumnFilterValue("");
    //}
  };

  const tableStyle = {
    ...generateStyle({
      width: width,
      height: height,
      isAbsoluteValue,
      positionedLeft,
      positionedTop,
      positionedRight,
      positionedBottom,
      bgUrl,
      isImageFill,
      color,
      bgColor,
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

  return (
    <div
      style={{
        overflowY: "scroll",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
      className="scrollable-hidden-scroll"
    >
      <table className="custom-table" style={tableStyle}>
        <thead>
          <tr>
            {headerArray.map((header, index) =>
              header.show ? (
                <>
                  <th
                    key={index}
                    style={{
                      ...generateStyle({
                        width:
                          header.width?.trim().replace(/^["']|["']$/g, "") ||
                          undefined,
                        height:
                          header.height?.trim().replace(/^["']|["']$/g, "") ||
                          undefined,
                        isAbsoluteValue: header.isAbsoluteValue,
                        positionedLeft: header.positionedLeft,
                        positionedTop: header.positionedTop,
                        positionedRight: header.positionedRight,
                        positionedBottom: header.positionedBottom,
                        bgColor: header.bgColor ?? "white",
                        bgUrl: header.bgUrl,
                        isImageFill: header.isImageFill,
                        color: header.color,
                        borderRadius: header.borderRadius,
                        borderTLR: header.borderTLR,
                        borderTRR: header.borderTRR,
                        borderBLR: header.borderBLR,
                        borderBRR: header.borderBRR,
                        borderWidth: header.borderWidth,
                        borderColor: header.borderColor,
                        borderTW: header.borderTW,
                        borderBW: header.borderBW,
                        borderLW: header.borderLW,
                        borderRW: header.borderRW,
                        borderTC: header.borderTC,
                        borderBC: header.borderBC,
                        borderLC: header.borderLC,
                        borderRC: header.borderRC,
                        paddingLeft: header.paddingLeft,
                        paddingRight: header.paddingRight,
                        paddingTop: header.paddingTop,
                        paddingBottom: header.paddingBottom,
                        marginLeft: header.marginLeft,
                        marginRight: header.marginRight,
                        marginTop: header.marginTop,
                        marginBottom: header.marginBottom,
                        shadowOffsetX: header.shadowOffsetX,
                        shadowOffsetY: header.shadowOffsetY,
                        shadowBlurRadius: header.shadowBlurRadius,
                        shadowSpreadRadius: header.shadowSpreadRadius,
                        shadowColor: header.shadowColor,
                        overflow: header.overflow,
                        mainAlignment: header.mainAlignment,
                        crossAlignment: header.crossAlignment,
                        onClick: header.onClick,
                        zIndex: header.zIndex,
                        fontSize: header.fontSize,
                        fontWeight: header.fontWeight,
                        textAlign: header.textAlign?.trim()
                          ? header.textAlign
                          : "align_left", // ✅ fallback
                        fontFamily: header.fontFamily,
                        fontStyle: header.fontStyle,
                        imageFit: header.imageFit,
                        decoration: header.decoration,
                        textDirection: header.textDirection,
                      }),
                    }}
                  >
                    <div className="header-wrapper">
                      <div className="header-title">
                        <div
                          className="title-text"
                          style={{
                            ...generateStyle({
                              color: header.color,
                              paddingLeft: header.paddingLeft,
                              paddingRight: header.paddingRight,
                              paddingTop: header.paddingTop,
                              paddingBottom: header.paddingBottom,
                              marginLeft: header.marginLeft,
                              marginRight: header.marginRight,
                              marginTop: header.marginTop,
                              marginBottom: header.marginBottom,
                              mainAlignment: header.mainAlignment,
                              crossAlignment: header.crossAlignment,
                              fontSize: header.fontSize,
                              fontWeight: header.fontWeight,
                              textAlign: header.textAlign?.trim()
                                ? header.textAlign
                                : "align_left", // ✅ fallback
                              fontFamily: header.fontFamily,
                              fontStyle: header.fontStyle,
                            }),
                          }}
                        >
                          {header.headerTitle}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            position: "relative",
                          }}
                        >
                          {header.filter === "Yes" && (
                            <>
                              <span
                                onClick={() =>
                                  openFilter(index, header.accessor)
                                }
                              >
                                <img
                                  src={header.filterIcon}
                                  alt="Filter"
                                  title="Filter"
                                  style={{
                                    height: header.filterIconHeight,
                                    width: header.filterIconWidth,
                                  }}
                                />
                              </span>

                              <div
                                style={{
                                  position: "absolute",
                                  display:
                                    activeFilterIndex === index
                                      ? "block"
                                      : "none",
                                  top: "100px",
                                  left: index == 0 ? "0px" : "-240px",
                                  width: "200px",
                                  height: "auto",
                                  border: "1px solid #ccc",
                                  borderRadius: "5px",
                                  padding: "15px",
                                  backgroundColor: "white",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  fontFamily: "sans-serif",
                                  zIndex: "99999",
                                }}
                              >
                                <div
                                  style={{
                                    color: "#1a73e8",
                                    paddingBottom: "10px",
                                    textAlign: "left",
                                  }}
                                >
                                  Filter By
                                </div>
                                <div style={headerStyle}>
                                  <span
                                    style={linkStyle}
                                    onClick={() => {
                                      setSelectedFilterArray(
                                        SearchByColumnArray
                                      );
                                    }}
                                  >
                                    Select all
                                  </span>
                                  <span
                                    style={linkStyle}
                                    onClick={() => {
                                      setSelectedFilterArray([]);
                                    }}
                                  >
                                    Clear
                                  </span>
                                </div>
                                <div style={{ position: "relative" }}>
                                  <input
                                    type="text"
                                    placeholder="Search"
                                    style={inputStyle}
                                    value={ColumnFilterValue}
                                    onChange={(e) =>
                                      handleSearchByColumn(
                                        e,
                                        header.accessor,
                                        index
                                      )
                                    }
                                  />

                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "8px",
                                      top: "18px",
                                      transform: "translateY(-50%)",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    <svg
                                      width="25"
                                      height="25"
                                      viewBox="0 0 18 14"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <rect stroke="gray" />
                                      <path
                                        d="M11.6 9.6L13 11M12.6 6.8C12.6 4.70132 10.8987 3 8.8 3C6.70132 3 5 4.70132 5 6.8C5 8.89868 6.70132 10.6 8.8 10.6C10.8987 10.6 12.6 8.89868 12.6 6.8Z"
                                        stroke="gray"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                </div>

                                {/* Show filtered values with checkboxes */}
                                <div
                                  style={{
                                    maxHeight: "155px",
                                    overflowY: "auto",
                                    marginTop: "10px",
                                  }}
                                >
                                  {SearchByColumnArray.map((value, indexx) => (
                                    <div
                                      key={indexx}
                                      style={{
                                        padding: "5px 0",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        textAlign: "left",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        id={`checkbox-${indexx}`}
                                        checked={SelectedFilterArray.includes(
                                          value
                                        )}
                                        onChange={() => {
                                          handleCheckboxChange(
                                            value,
                                            columnName
                                          );
                                        }}
                                        style={{ marginRight: "8px" }}
                                      />
                                      <label
                                        htmlFor={`checkbox-${indexx}`}
                                        style={{
                                          cursor: "pointer",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {value}
                                      </label>
                                    </div>
                                  ))}
                                </div>

                                <div style={buttonContainerStyle}>
                                  <button
                                    style={cancelButtonStyle}
                                    onClick={() => {
                                      setActiveFilterIndex(null);
                                      setSelectedFilterArray([]);
                                      SetSearchByColumnArray([]);
                                      SetColumnFilterValue("");
                                      SetColumnName("");

                                      const updatedHeaders = headerArray.map(
                                        (header) => ({
                                          ...header,
                                          value: "",
                                        })
                                      );

                                      setHeaderArray(updatedHeaders);
                                      dispatch(setGlobalSearch(""));
                                      dispatch(setFilterSearch("No"));
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    style={okButtonStyle}
                                    onClick={() =>
                                      ColumnWiseFilter(header.accessor)
                                    }
                                  >
                                    Ok
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                          {header.sort === "Yes" && (
                            <span
                              onClick={() =>
                                sortData(header.accessor, header.sort)
                              }
                            >
                              <img
                                className={`sort-icon-svg ${
                                  shortField === header.accessor
                                    ? shortBY === "ASC"
                                      ? "desc"
                                      : "asc"
                                    : ""
                                }`}
                                src={header.sortIcon}
                                style={{
                                  height: header.sortIconHeight,
                                  width: header.sortIconWidth,
                                }}
                                alt="Sorting"
                                title="Sorting"
                              />
                            </span>
                          )}
                        </div>
                      </div>
                      {header.search === "Yes" ? (
                        <div style={{ position: "relative", width: "100%" }}>
                          <style>
                            {`
                              .searchInput::placeholder {
                                color: ${
                                  header.searchSetting?.[0].color || "black"
                                };
                              }
                            `}
                          </style>

                          <input
                            type="text"
                            className="searchInput"
                            style={{
                              border: "0px",
                              ...generateSearchStyle({
                                ...header.searchSetting?.[0],
                              }),
                            }}
                            placeholder="Search"
                            value={header.value}
                            onChange={(e) =>
                              handleSearch(e, header.accessor, index)
                            }
                          />
                        </div>
                      ) : (
                        <div className="no-column-search" />
                      )}
                    </div>
                  </th>
                </>
              ) : null
            )}
          </tr>
        </thead>

        <tbody className="tbody">
          {paginatedDataState.length === 0 ? (
            <tr>
              <td
                colSpan={headerArray.length}
                className="text-center"
                style={{
                  ...generateStyle({
                    fontSize: headerArray[0]?.fontSize,
                    fontWeight: headerArray[0]?.fontWeight,
                    fontFamily: headerArray[0]?.fontFamily,
                    fontStyle: headerArray[0]?.fontStyle,
                  }),
                }}
              >
                No data found.
              </td>
            </tr>
          ) : (
            paginatedDataState.map((row, i) => (
              <tr key={i}>
                {headerArray.map(
                  (header, j) =>
                    header.show && (
                      <td
                        key={j}
                        style={{
                          ...generateStyle({
                            width:
                              header.width
                                ?.trim()
                                .replace(/^["']|["']$/g, "") || undefined,
                            height:
                              header.height
                                ?.trim()
                                .replace(/^["']|["']$/g, "") || undefined,
                            isAbsoluteValue: header.isAbsoluteValue,
                            positionedLeft: header.positionedLeft,
                            positionedTop: header.positionedTop,
                            positionedRight: header.positionedRight,
                            positionedBottom: header.positionedBottom,
                            bgColor: header.bgColor,
                            bgUrl: header.bgUrl,
                            isImageFill: header.isImageFill,
                            color: header.color,
                            borderRadius: header.borderRadius,
                            borderTLR: header.borderTLR,
                            borderTRR: header.borderTRR,
                            borderBLR: header.borderBLR,
                            borderBRR: header.borderBRR,
                            borderWidth: header.borderWidth,
                            borderColor: header.borderColor,
                            borderTW: header.borderTW,
                            borderBW: header.borderBW,
                            borderLW: header.borderLW,
                            borderRW: header.borderRW,
                            borderTC: header.borderTC,
                            borderBC: header.borderBC,
                            borderLC: header.borderLC,
                            borderRC: header.borderRC,
                            paddingLeft: header.paddingLeft,
                            paddingRight: header.paddingRight,
                            paddingTop: header.paddingTop,
                            paddingBottom: header.paddingBottom,
                            marginLeft: header.marginLeft,
                            marginRight: header.marginRight,
                            marginTop: header.marginTop,
                            marginBottom: header.marginBottom,
                            shadowOffsetX: header.shadowOffsetX,
                            shadowOffsetY: header.shadowOffsetY,
                            shadowBlurRadius: header.shadowBlurRadius,
                            shadowSpreadRadius: header.shadowSpreadRadius,
                            shadowColor: header.shadowColor,
                            overflow: header.overflow,
                            mainAlignment: header.mainAlignment,
                            crossAlignment: header.crossAlignment,
                            onClick: header.onClick,
                            zIndex: header.zIndex,
                            fontSize: header.fontSize,
                            fontWeight: header.fontWeight,
                            textAlign: header.textAlign?.trim()
                              ? header.textAlign
                              : "align_left", // ✅ fallback
                            fontFamily: header.fontFamily,
                            fontStyle: header.fontStyle,
                            imageFit: header.imageFit,
                            decoration: header.decoration,
                            textDirection: header.textDirection,
                          }),
                        }}
                      >
                        {row[header.accessor] ?? ""}
                      </td>
                    )
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QTableData;

QTableData.displayName = "QTableData";
