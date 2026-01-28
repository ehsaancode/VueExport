import { configureStore } from '@reduxjs/toolkit';
import paginationReducer from './paginationSlice';
import errorReducer from './errorSlice';


export const store = configureStore({
  reducer: {
    pagination: paginationReducer,
    error: errorReducer,
  },
});
