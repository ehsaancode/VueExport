// store/paginationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    currentPage: 1,
    itemsPerPage: 5, // default
    totalItems: 0,
    data: [],
    perPageCurrentData: [],
    globalSearch: "",
    columnSearch: "No",
    filterSearch: "No"
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when itemsPerPage changes
    },
    setData: (state, action) => {
      state.data = action.payload.items;
      state.totalItems = action.payload.total;
    },
     setGlobalSearch: (state, action) => {
      state.globalSearch = action.payload;
    },

     setPerPageCurrentData: (state, action) => {
      state.perPageCurrentData = action.payload;
    },

      setColumnSearch: (state, action) => {
      state.columnSearch = action.payload;
    },

      setFilterSearch: (state, action) => {
      state.filterSearch = action.payload;
    },

  


  },
});

export const { setCurrentPage, setItemsPerPage, setData, setGlobalSearch, setPerPageCurrentData, setColumnSearch, setFilterSearch} = paginationSlice.actions;
export default paginationSlice.reducer;
