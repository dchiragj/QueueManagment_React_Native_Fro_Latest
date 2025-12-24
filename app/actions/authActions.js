import * as actions from './types';

/**
 * @desc Set Auth Loader
 */
export const setAuthLoader = (payload) => {
  return {
    type: actions.SET_AUTH_LOADER,
    payload: payload
  };
};

/**
 * @desc Set Current User
 */
export const setCurrentUser = (payload) => { 
  return {
    type: actions.SET_CURRENT_USER,
    payload: payload
  };
};

/**
 * @desc Set User Profile
 */
export const setUserProfile = (payload) => {
  return {
    type: actions.SET_USER_PROFILE,
    payload: payload
  };
};

/**
 * @desc Set Auth Response Errors
 */
export const setAuthResponseError = (payload) => {
  let resError = {};
  resError[payload.field] = payload.msg;
  return {
    type: actions.SET_AUTH_RES_ERROR,
    payload: resError
  };
};

/**
 * @desc Set Auth Response Success
 */
export const setAuthResponseSuccess = (payload) => {
  return {
    type: actions.SET_AUTH_RES_SUCCESS,
    payload: payload
  };
};

// clear auth data
export const clearAuthResponseMsg = () => {
  return {
    type: actions.CLEAR_AUTH_RES_MSG
  };
};

// clear auth data
export const clearAuthData = () => {
  return {
    type: actions.CLEAR_AUTH_DATA
  };
};
