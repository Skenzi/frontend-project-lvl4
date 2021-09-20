import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './features/channelsSlice.js';
import messagesReducer from './features/messagesSlice.js';

const store = configureStore({
  reducer: {
    channelsData: channelsReducer,
    messagesData: messagesReducer,
  },
});

export default store;
