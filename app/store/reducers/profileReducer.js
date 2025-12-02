import * as actions from '../../actions/types';

const initialState = {
  resError: {},
  resSuccess: '',
  loading: false,
  profileInfo: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.SET_PROFILE_LOADER:
      return {
        ...state,
        loading: action.payload
      };
    case actions.SET_PROFILE_INFO:
      return {
        ...state,
        profileInfo: action.payload
      };
    case actions.SET_PROFILE_RES_ERROR:
      return {
        ...state,
        resError: action.payload
      };
    case actions.SET_PROFILE_RES_SUCCESS:
      return {
        ...state,
        resSuccess: action.payload
      };
    case actions.CLEAR_PROFILE_RES_MSG:
      return {
        ...state,
        resError: {},
        resSuccess: ''
      };
    case actions.CLEAR_PROFILE_DATA:
      return initialState;
    default:
      return state;
  }
}
