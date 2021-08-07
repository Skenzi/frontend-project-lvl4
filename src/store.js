import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './features/channelsSlice.js';
import messagesReducer from './features/messagesSlice.js';
import userReducer from './features/userSlice.js';

const store = configureStore({
  reducer: {
    channelsData: channelsReducer,
    messagesData: messagesReducer,
    userData: userReducer,
  },
});

export default store;
