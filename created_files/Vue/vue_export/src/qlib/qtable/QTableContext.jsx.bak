import React, { createContext, useContext, useState } from "react";

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [columnWidths, setColumnWidths] = useState([]);
  return (
    <TableContext.Provider value={{ columnWidths, setColumnWidths }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => useContext(TableContext);
