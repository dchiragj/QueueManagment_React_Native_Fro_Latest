import * as actions from '../../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {},
  resError: {},
  resSuccess: '',
  loading: false,
  userProfile: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actions.SET_AUTH_LOADER:
      return {
        ...state,
        loading: action.payload
      };
    case actions.SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload
      };
    case actions.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      };
    case actions.SET_AUTH_RES_ERROR:
      return {
        ...state,
        resError: action.payload
      };
    case actions.SET_AUTH_RES_SUCCESS:
      return {
        ...state,
        resSuccess: action.payload
      };
    case actions.CLEAR_AUTH_RES_MSG:
      return {
        ...state,
        resError: {},
        resSuccess: ''
      };
    case actions.CLEAR_AUTH_DATA:
      return initialState;
    default:
      return state;
  }
}
