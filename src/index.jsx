// @ts-check

import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import '../assets/application.scss';
import 'bootstrap';
import { io } from 'socket.io-client';
import App from './components/App.jsx';
import store from './store.js';

const init = () => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const socket = io('ws://localhost:5000');

  render(
    <Provider store={store}>
      <App socket={socket} />
    </Provider>,
    document.querySelector('#chat'),
  );
  console.log('it works!');
};

init();

export default init;
