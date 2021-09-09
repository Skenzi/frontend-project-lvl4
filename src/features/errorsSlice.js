/* eslint no-param-reassign:
["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';

const errorsSlice = createSlice({
  name: 'errors',
  initialState: {
    error: null,
  },
  reducers: {
    setError: (state, { payload }) => {
      state.error = payload;
    },
  },
});

export const { setError } = errorsSlice.actions;
export default errorsSlice.reducer;
