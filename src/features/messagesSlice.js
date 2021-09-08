/* eslint no-param-reassign:
["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel, fetchContent } from './channelsSlice.js';

export const messagesSlice = createSlice({
  name: 'messagesData',
  initialState: {
    messages: [],
  },
  reducers: {
    addNewMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
  },
  extraReducers: {
    [fetchContent.fulfilled]: (state, { payload }) => {
      state.messages = payload.messages;
    },
    [removeChannel]: (state, { payload }) => {
      const newMessages = state.messages.filter((message) => message.channelId !== payload.id);
      state.messages = newMessages;
    },
  },
});

export const { addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
