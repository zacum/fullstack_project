import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  content: {},
};

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErors: (state, action) => {
      state.type = action.payload.type;
      state.content = action.payload.errors;
    },
    clearErrors: state => {
      state.type = null;
      state.content = {};
    },
  },
});

export const selectError = action => state => {
  if (action.rejected.match({ type: state.error.type })) {
    return state.error.content;
  }
  return null;
};

export const selectValidationErrors = action => state => {
  if (state.error.content.type && action.rejected.match({ type: state.error.type })) {
    return state.error.content.errors;
  }
  return null;
};

export const { setErors, clearErrors: clearError } = errorSlice.actions;

export default errorSlice.reducer;
