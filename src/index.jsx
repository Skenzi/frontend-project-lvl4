// @ts-check
import { render } from 'react-dom';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import '../assets/application.scss';
import 'bootstrap';
import init from './init.jsx';

const rendering = () => {
  render(init(), document.querySelector('#chat'));
};

rendering();
