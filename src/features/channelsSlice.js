import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

export const fetchContent = () => async (dispatch) => {
  const response = await axios.get(routes.dataPath(), {
    headers: getAuthHeader(),
  });
  dispatch(setInitialState(response.data));
};

export const channelsSlice = createSlice({
  name: 'channelsData',
  initialState: {
    channels: [],
    currentChannelId: null,
  },
  reducers: {
    setInitialState: (state, { payload }) => {
      console.log(payload, 'payload fetch')
      state.channels = payload.channels;
      state.currentChannelId = payload.currentChannelId;
    },
    addChannel: (state, { payload }) => {
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
    swapCurrentChannelId: (state, {payload}) => {
      state.currentChannelId = payload;
    },
  },
});

export const {
  setInitialState, addChannel, removeChannel, renameChannel, swapCurrentChannelId,
} = channelsSlice.actions;
export default channelsSlice.reducer;
