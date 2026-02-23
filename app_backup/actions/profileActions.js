import * as actions from './types';
/**
 * @desc Set Auth Loader
 */
export const setProfileLoader = (payload) => {
  return {
    type: actions.SET_PROFILE_LOADER,
    payload: payload
  };
};

/**
 * @desc Set Current User
 */
export const setProfile = (payload) => {
  return {
    type: actions.SET_PROFILE_INFO,
    payload: payload
  };
};

/**
 * @desc Set Auth Response Errors
 */
export const setProfileResponseError = (payload) => {
  let resError = {};
  resError[payload.field] = payload.msg;
  return {
    type: actions.SET_PROFILE_RES_ERROR,
    payload: resError
  };
};

/**
 * @desc Set Auth Response Success
 */
export const setProfileResponseSuccess = (payload) => {
  return {
    type: actions.SET_PROFILE_RES_SUCCESS,
    payload: payload
  };
};

// clear auth data
export const clearProfileResponseMsg = () => {
  return {
    type: actions.CLEAR_PROFILE_RES_MSG
  };
};

// clear auth data
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
