// store/errorSlice.js
import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    formErrorSet: {}
  },
  reducers: {
    setFormErrorSet: (state, action) => {
      const { cms_form_Id, cmsFormInputLabel, errorSet } = action.payload;

      if (!state.formErrorSet[cms_form_Id]) {
        state.formErrorSet[cms_form_Id] = {};
      }

      state.formErrorSet[cms_form_Id] = {
        ...state.formErrorSet[cms_form_Id],
        [cmsFormInputLabel]: errorSet
      };
    }
  }
});

export const { setFormErrorSet } = errorSlice.actions;
export default errorSlice.reducer;
