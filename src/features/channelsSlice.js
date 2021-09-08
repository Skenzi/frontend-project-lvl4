/* eslint no-param-reassign:
["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

export const fetchContent = createAsyncThunk(
  'channelsData/fetchContent',
  async () => {
    const response = await axios.get(routes.dataPath(), {
      headers: getAuthHeader(),
    });
    return response.data;
  },
);

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    setInitialState: (state, { payload }) => {
      console.log('test', payload.channels);
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    },
    addChannel: (state, { payload }) => {
      console.log('test');
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
    swapCurrentChannelId: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContent.fulfilled, (state, { payload }) => {
      console.log(1111);
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    });
  },
});

export const {
  setInitialState, addChannel, removeChannel, renameChannel, swapCurrentChannelId,
} = channelsSlice.actions;

export default channelsSlice.reducer;
