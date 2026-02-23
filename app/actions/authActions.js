import * as actions from './types';


export const setAuthLoader = (payload) => {
  return {
    type: actions.SET_AUTH_LOADER,
    payload: payload
  };
};


export const setCurrentUser = (payload) => { 
  return {
    type: actions.SET_CURRENT_USER,
    payload: payload
  };
};


export const setUserProfile = (payload) => {
  return {
    type: actions.SET_USER_PROFILE,
    payload: payload
  };
};


export const setAuthResponseError = (payload) => {
  let resError = {};
  resError[payload.field] = payload.msg;
  return {
    type: actions.SET_AUTH_RES_ERROR,
    payload: resError
  };
};


export const setAuthResponseSuccess = (payload) => {
  return {
    type: actions.SET_AUTH_RES_SUCCESS,
    payload: payload
  };
};

export const clearAuthResponseMsg = () => {
  return {
    type: actions.CLEAR_AUTH_RES_MSG
  };
};

export const clearAuthData = () => {
  return {
    type: actions.CLEAR_AUTH_DATA
  };
};
