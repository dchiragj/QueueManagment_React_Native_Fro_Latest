import * as actions from './types';

export const setProfileLoader = (payload) => {
  return {
    type: actions.SET_PROFILE_LOADER,
    payload: payload
  };
};


export const setProfile = (payload) => {
  return {
    type: actions.SET_PROFILE_INFO,
    payload: payload
  };
};


export const setProfileResponseError = (payload) => {
  let resError = {};
  resError[payload.field] = payload.msg;
  return {
    type: actions.SET_PROFILE_RES_ERROR,
    payload: resError
  };
};


export const setProfileResponseSuccess = (payload) => {
  return {
    type: actions.SET_PROFILE_RES_SUCCESS,
    payload: payload
  };
};

export const clearProfileResponseMsg = () => {
  return {
    type: actions.CLEAR_PROFILE_RES_MSG
  };
};

export const clearProfileData = () => {
  return {
    type: actions.CLEAR_PROFILE_DATA
  };
};

export const updateUserProfile = (payload) => {
  return {
    type: actions.UPDATE_USER_PROFILE,
    payload: payload,
  };
};
