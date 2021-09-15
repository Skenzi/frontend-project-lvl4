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
import { appContext } from './context/index.js';

export default async (socket) => {
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

  const socketApi = (type, data) => new Promise((resolve, reject) => {
    socket.volatile.emit(type, data, (response) => (response.status === 'ok' ? resolve() : reject(response.error)));
  });
  await instance
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
    },
  });
  return (
    <Provider store={store}>
      <appContext.Provider value={{ socketApi }}>
        <App />
      </appContext.Provider>
    </Provider>
  );
};
