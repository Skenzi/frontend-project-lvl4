import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice.js';
import messagesReducer from './slices/messagesSlice.js';

const store = configureStore({
  reducer: {
    channelsData: channelsReducer,
    messagesData: messagesReducer,
  },
});

export default store;
