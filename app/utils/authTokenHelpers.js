import axios from 'axios';

import  {jwtDecode} from 'jwt-decode';
import { saveAuthUser, getAuthUser, deleteAllLocalData } from './localStorageHelpers';

export const setupToken = async () => {
  const authData = await getAuthUser();

  if (authData) {
    const decoded = jwtDecode(authData.token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp > currentTime) {
      setAuthToken(authData.token);
      return authData.token;
    }
  }
  return false; // if no token or expired token, return false
};

export const validateRefreshToken = async () => {
  const authData = await getAuthUser();

  if (authData && authData.refresh_token) {
    return authData.refresh_token;
  }
  return false; // if no token or expired token, return false
};

export const saveToken = async (data) => {
  setAuthToken(data.token);
  await saveAuthUser(data);
};

export const clearToken = () => {
  deleteAllLocalData();
  clearAuthToken();
};

// header methods
const setAuthToken = (token) => {
  try {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } catch (e) {
    console.log('Error while settup token', e);
  }
};

const clearAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};
