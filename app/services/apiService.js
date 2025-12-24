// apiService.js
import axios from 'axios';
// import { getAuthUser } from './localStorageHelpers'; // Adjust the path as needed
import { getBaseUrl } from '../global/Environment';
import { getAuthUser } from '../utils/localStorageHelpers';


const apiService = axios.create( {
  baseURL: `${getBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
} );

apiService.interceptors.request.use( async ( config ) => {
  const authData = await getAuthUser();
  // alert('🔑 Token from storage:', authData?.token);  // DEBUG
  if ( authData && authData.token ) {
    config.headers.Authorization = `Bearer ${ authData.token }`;
  }
  return config;
}, ( error ) => {
  return Promise.reject( error );
} );


export const getCategories = async () => {
  try {
    const response = await apiService.get( '/queue/category' );
    return response.data;
  } catch ( error ) {
    throw new Error( error.message || 'Failed to fetch categories' );
  }
};

export const saveFcmToken = async (fcmToken) => {
  try {
    const response = await apiService.post('/auth/save-fcm-token', { fcmToken });
    return response.data;
  } catch (error) {
    console.warn('Failed to save FCM token:', error.response?.data || error.message);
    return null;
  }
};
export const getCurrentToken = async (queueId, categoryId) => {
  try {
    const response = await apiService.get('/token/current/token', {params: { queueId, categoryId }
    });
    return response.data.data.upcoming;
  } catch (error) {
    console.error('getCurrentToken error:', error.response?.data || error.message);
    throw error;
  }
};

export const notifyThirdUser = async (fcmToken) => {
  try {
    const response = await apiService.post('/auth/notify-third', { fcmToken });
    return response.data;
  } catch (error) {
    console.warn('Failed to save FCM token:', error.response?.data || error.message);
    return null;
  }
};
export const getDesksByCategory = async (categoryId) => {
  try {
    const response = await apiService.get(`/queue/desks/${categoryId}`);
    return response.data.data || []; // backend returns { success: true, data: [...] }
  } catch (error) {
    console.error('getDesksByCategory error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch desks');
  }
};
export const forgotPassword = async ( email ) => {
  try {
    const response = await apiService.post( '/auth/forgot-password', { email } );
    return response.data;  // return backend response
  } catch ( error ) {
    // Bubble up server message if available
    const msg = error.response?.data?.message || 'Failed to send reset link';
    throw new Error( msg );
  }
};
export const verifyOtp = async ( email, otp ) => {
  try {
    const response = await apiService.post( '/auth/verify-otp', { email, otp } );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to verify OTP' );
  }
};

export const resetPassword = async ( email, password, otp ) => {
  try {
    const response = await apiService.post( '/auth/reset-password', { email, password, otp } );
    return response.data;
  } catch ( error ) {
    console.log( error );
    throw new Error( error.response?.data?.message || 'Failed to reset password' );
  }
};
export const verifyEmailApi = async ( code ) => {
  try {
    const response = await apiService.post( '/auth/verify', { code } );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to verify email' );
  }
};

export const verificationcode = async ( code ) => {
  try {
    const response = await apiService.post( '/auth/verification-code', { code } );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to verify email' );
  }
};

// export const profileUpdate = async ( obj ) => {
//   console.log( obj, "updateprofilepayload" );
//   try {
//     const response = await apiService.post( '/user/profile', obj );
//     console.log(response,"resimg");
    
//     return response.data;
//   } catch ( error ) {
//     console.error( 'Profile update error:', error.response?.data?.message || error.message );
//     throw new Error( error.response?.data?.message || 'Failed to update profile' );
//   }
// };
export const profileUpdate = async (formData) => {
  console.log( await getAuthUser(),"data");

  try {
    const response = await axios.post(`${getBaseUrl()}/api/user/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response,"resimg");
    return response.data;

  } catch (error) {``
    console.error(
      'Profile update error:',
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const getUserProfileme = async () => {
  try {
    const response = await apiService.get( '/user/me' );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to get user profile' );
  }
};
export const createQueue = async ( queueData ) => {
  try {
    const response = await apiService.post( '/queue', queueData );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to create queue' );
  }
};
export const getQueueList = async ( params = {} ) => {
  try {
    const user = await getAuthUser();
    const defaultParams = {
      merchantId: user?.id
    };
    const response = await apiService.get( '/queue/list', { params: defaultParams } );
    return response.status === 200 ? response.data || [] : [];
  } catch ( error ) {
    throw error;
  }
};

export const checkToken = async ( payload ) => {
  try {
    const response = await apiService.post( '/token/check-token',  payload  );
    return response;
  } catch ( error ) {
    console.error( 'Check token error:', error.response?.data || error.message );
    throw new Error( error.response?.data?.message || 'Failed to check token' );
  }
};

export const generateToken = async ( { queueId, categoryId } ) => {
  try {
    const response = await apiService.post( '/token/generate-token', { queueId, categoryId } );
    return response.data;
  } catch ( error ) {
    console.error( 'Generate token error:', error.response?.data || error.message );
    throw new Error( error.response?.data?.message || 'Failed to generate token' );
  }
};

export const getTokenList = async () => {
  try {
    const response = await apiService.get( '/token/list' );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to get user profile' );
  }
};

export const getQueueDetails = async (queueId) => {
  try {
    const response = await apiService.get( `/queue/details/${queueId}` );
    return response.data;
  } catch ( error ) {
    throw new Error( error.response?.data?.message || 'Failed to get user profile' );
  }
};

export const getTokenDelete = async (TokenId) => {
  try {
    const response = await apiService.delete( `/token/delete/${TokenId}` );
    return response.data;
  } catch ( error ) {
    console.log(error,"error");
    
    throw new Error( error.response?.data?.message || 'Failed to get user profile' );
  }
};

export const getQueueDelete = async (queueId) => {
  try {
    const response = await apiService.delete( `/queue/delete/${queueId}`);
    return response.data;
  } catch ( error ) {
    console.log(error,"error");
    throw new Error( error.response?.data?.message || 'Failed to get user profile' );
  }
};
export const getServicingList = async (queueId, categoryId) => {
  try {
    const response = await apiService.get(`/token/servicing/${queueId}?categoryId=${categoryId}`);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};
export const getServicingSkip = async (tokenIds) => {
  console.log(tokenIds, "tokenIds"); // Log the actual value for debugging
  try {
    const response = await apiService.post('/token/skip', { tokenIds }); // Send tokenIds in the body
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const recoverSkippedToken = async (tokenNumber) => {
  try {
    const response = await apiService.post('/token/recover-token', { tokenNumber });
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const getSkippedList = async (queueId, categoryId) => {
  try {
    const response = await apiService.get(`/token/skippedTokens/${queueId}?categoryId=${categoryId}`);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};
export const getTokenCounts = async (queueId, categoryId) => {
  try {
    const response = await apiService.get(`/token/token-counts/count`);
    return response.data.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const completeToken = async (tokenId) => {
  try {
    const payload = Array.isArray(tokenId) 
      ? { tokenIds: tokenId } 
      : { tokenId };
    const response = await apiService.post('/token/complete', payload);
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw error.response?.data || error;
  }
};
export const getCompletedHistory = async (queueId, categoryId) => {
  try {
    const response = await apiService.get(`/token/completed/history`, {
      params: { queueId, categoryId }
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getQueueStatus = async (queueId, tokenNumber) => {
  try {
    const response = await apiService.post('/queue/status', { queueId, tokenNumber });
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const markUserAvailable = async (queueId, tokenNumber) => {
  try {
    const response = await apiService.post('/queue/mark-available', { queueId, tokenNumber });
    return response.data;
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};
// Add other API methods as needed
export default apiService;