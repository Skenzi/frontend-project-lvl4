import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import App from './components/App.jsx';
import store from './store.js';

const init = () => {
  if (process.env.NODE_ENV !== 'production') {
    localStorage.debug = 'chat:*';
  }

  const socket = io();

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