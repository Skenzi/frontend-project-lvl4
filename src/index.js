// @ts-check
import { render } from 'react-dom';
import { io } from 'socket.io-client';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import 'bootstrap';
import init from './init.jsx';

const rendering = async () => {
  const socket = io();
  render(await init(socket), document.querySelector('#chat'));
};

rendering();
