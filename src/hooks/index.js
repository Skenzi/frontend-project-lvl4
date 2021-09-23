import { useContext } from 'react';

import { apiContext, authContext } from '../context/index.js';

export const useApi = () => useContext(apiContext);
export const useAuth = () => useContext(authContext);
