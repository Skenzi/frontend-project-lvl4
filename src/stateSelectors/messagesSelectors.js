import { createSelector } from '@reduxjs/toolkit';

const messagesSelector = createSelector(
  (state) => ({
    messages: state.messagesData.messages,
    currentChannelId: state.channelsData.currentChannelId,
  }),
  ({ messages, currentChannelId }) => (
    messages
      .filter((message) => message.channelId === currentChannelId)),
);

export default messagesSelector;
