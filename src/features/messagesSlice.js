import { createSlice } from '@reduxjs/toolkit';
import { setInitialState, removeChannel } from './channelsSlice.js';

export const messagesSlice = createSlice({
  name: 'messagesData',
  initialState: {
    messages: [],
  },
  reducers: {
    addNewMessage: (state, {payload}) => {
      state.messages.push(payload);
    }
  },
  extraReducers: {
    [setInitialState]: (state, { payload }) => {
      state.messages = payload.messages;
    },
    [removeChannel]: (state, { payload }) => {
      const newMessages = state.messages.filter((message) => message.channelId !== payload.id);
      state.messages = newMessages;
    }
  },
});

export const { addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
