import { useContext } from 'react';

import { appContext, authContext } from '../context/index.js';

const mapping = {
  authContext,
  appContext,
};

export default (context) => useContext(mapping[context]);
