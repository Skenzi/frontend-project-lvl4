/* eslint no-param-reassign:
["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { createSlice } from '@reduxjs/toolkit';

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    setChannels: (state, { payload }) => {
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    },
    addChannel: (state, { payload }) => {
      console.log(payload, state);
      state.channels.push(payload);
      state.currentChannelId = payload.id;
    },
    removeChannel: (state, { payload }) => {
      const newChannels = state.channels.filter((channel) => channel.id !== payload.id);
      state.channels = newChannels;
      state.currentChannelId = 1;
    },
    renameChannel: (state, { payload }) => {
      const prevRenamingChannel = state.channels.find((channel) => channel.id === payload.id);
      const indRenamingChannel = state.channels.indexOf(prevRenamingChannel);
      state.channels[indRenamingChannel] = payload;
    },
    setCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
});

export const {
  setChannels, addChannel, removeChannel, renameChannel, setCurrentChannelId,
} = channelsSlice.actions;

export default channelsSlice.reducer;
