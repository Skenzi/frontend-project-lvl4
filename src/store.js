import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './features/channelsSlice.js';
import messagesReducer from './features/messagesSlice.js';
import errorsReducer from './features/errorsSlice.js';

const store = configureStore({
  reducer: {
    channelsData: channelsReducer,
    messagesData: messagesReducer,
    errors: errorsReducer,
  },
});

export default store;
