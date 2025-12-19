import axios from 'axios';
import { getAPIResponseError } from '../global/Helpers';
import { getBaseUrl } from '../global/Environment';
import {
  setProfile,
  setProfileLoader,
  setProfileResponseError,
  clearProfileResponseMsg
} from '../actions/profileActions';
import { getUserProfileme, profileUpdate } from './apiService';
// import formDataEntries from 'form-data-entries';
const baseUrl = `${getBaseUrl()}/api`

export const updateUserProfile = (obj) => async (dispatch) => {
  try {
    dispatch(clearProfileResponseMsg());

    // If it's FormData, convert to object for validation
    let dataForValidation = obj;
    if (obj instanceof FormData) {
      dataForValidation = {};
      obj._parts?.forEach(([key, value]) => {
        if (typeof value === 'string') {
          dataForValidation[key] = value;
        }
      });
    }

    if (!dataForValidation.firstName) {
      dispatchAuthError('firstname', 'First Name is Required', dispatch);
      return false;
    } else if (!dataForValidation.lastName) {
      dispatchAuthError('lastname', 'Last Name is Required', dispatch);
      return false;
    } else if (!dataForValidation.address) {
      dispatchAuthError('address', 'Address is Required', dispatch);
      return false;
    } else if (!dataForValidation.gender) {
      dispatchAuthError('gender', 'Gender is Required', dispatch);
      return false;
    }

    dispatch(setProfileLoader(true));
    const response = await profileUpdate(obj); // <- send FormData here
    const { data } = response;
    dispatch(setProfile(data));
    return true;
  } catch (e) {
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to update, please try again', dispatch);
    return false;
  } finally {
    dispatch(setProfileLoader(false));
  }
};

export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch(clearProfileResponseMsg());
    dispatch(setProfileLoader(true));
    const response = await getUserProfileme(); // Use api service
    const { data } = response; // Adjust based on actual response structure
    dispatch(setProfile(data));
    return true;
  } catch (e) {
    dispatchAuthError('error', getAPIResponseError(e) || 'Unable to get user, please try again', dispatch);
    return false;
  } finally {
    dispatch(setProfileLoader(false));
  }
};

function dispatchAuthError(field, msg, dispatch) {
  dispatch(setProfileResponseError({ field, msg }));
}
