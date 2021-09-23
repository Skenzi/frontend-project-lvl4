import React from 'react';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import * as yup from 'yup';
import App from './components/App.jsx';
import store from './store.js';
import resources from './locales/index.js';
import {
  addChannel, renameChannel, removeChannel,
} from './slices/channelsSlice';
import { addNewMessage } from './slices/messagesSlice.js';
import { apiContext } from './context/index.js';

export default async (socket) => {
  const instance = i18n.createInstance();

  const socketState = {
    status: null,
  };
  socket.on('connect', () => {
    socketState.status = 'ok';
  });
  socket.on('newChannel', (newChannel) => {
    store.dispatch(addChannel(newChannel));
    socketState.status = 'ok';
  });
  socket.on('removeChannel', (removedChannel) => {
    store.dispatch(removeChannel(removedChannel));
    socketState.status = 'ok';
  });
  socket.on('renameChannel', (renamingChannel) => {
    store.dispatch(renameChannel(renamingChannel));
    socketState.status = 'ok';
  });
  socket.on('newMessage', (newMessage) => {
    store.dispatch(addNewMessage(newMessage));
    socketState.status = 'ok';
  });
  socket.on('connect_error', () => {
    socketState.status = 'errorConnection';
    socket.connect();
  });

  const delay = 3000;

  const socketApi = (type, data) => new Promise((resolve, reject) => {
    const withTimeout = () => {
      const timer = setTimeout(() => {
        socketState.status = 'errorConnection';
        const error = new Error('errorConnection');
        error.response = {
          status: 408,
        };
        reject(error);
      }, delay);

      return (resp) => {
        if (resp.status !== 'ok') {
          reject(resp.error);
        }
        if (socketState.status === 'ok') {
          clearTimeout(timer);
          resolve();
        }
      };
    };

    socket.volatile.emit(type, data, withTimeout());
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
    <I18nextProvider i18n={instance}>
      <Provider store={store}>
        <apiContext.Provider value={{ socketApi }}>
          <App />
        </apiContext.Provider>
      </Provider>
    </I18nextProvider>
  );
};
