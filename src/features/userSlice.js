import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userData',
  initialState: {
    username: '',
  },
  reducers: {
    setUsername: (state, { payload }) => {
      state.users = payload;
    },
  },
});

export const { setUsername } = userSlice.actions;
export default userSlice.reducer;
