import React from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as yup from 'yup';
import App from './components/App.jsx';
import store from './store.js';
import resources from './locales/index.js';
import {
  addChannel, renameChannel, removeChannel,
} from './features/channelsSlice';
import { addNewMessage } from './features/messagesSlice.js';

export default async (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }
  const instance = i18n.createInstance();
  socket.on('newChannel', (newChannel) => {
    store.dispatch(addChannel(newChannel));
  });
  socket.on('removeChannel', (removedChannel) => {
    store.dispatch(removeChannel(removedChannel));
  });
  socket.on('renameChannel', (renamingChannel) => {
    store.dispatch(renameChannel(renamingChannel));
  });
  socket.on('newMessage', (newMessage) => {
    store.dispatch(addNewMessage(newMessage));
  });

  instance
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });
  yup.setLocale({
    mixed: {
      required: instance.t('errors.required'),
      notOneOf: instance.t('errors.userExist'),
    },
  });
  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
};
