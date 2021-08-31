import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as yup from 'yup';
import App from './components/App.jsx';
import store from './store.js';
import resources from './locales/index.js';

const init = () => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }
  const instance = i18n.createInstance();
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
      required: instance.t('required'),
      notOneOf: instance.t('errors.userExist'),
    },
  });
  const socket = io();
  console.log(document.querySelector('#chat'));
  console.log(document.querySelector('#container'));
  console.log(document.querySelector('.container'));
  render(
    <Provider store={store}>
      <App socket={socket} />
    </Provider>,
    document.querySelector('#chat'),
  );
};

init();

export default init;
