import axios from 'axios';
import { getBaseUrl } from '../global/Environment';
import { getAuthUser } from '../utils/localStorageHelpers';

const apiService = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(async (config) => {
  const authData = await getAuthUser();
  if (authData && authData.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getCategories = async () => {
  try {
    const response = await apiService.get('/queue/category');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

export const saveFcmToken = async (fcmToken) => {
  try {
    const response = await apiService.post('/auth/save-fcm-token', { fcmToken });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getCurrentToken = async (queueId, categoryId) => {
  try {
    const response = await apiService.get('/token/current/token', {
      params: { queueId, categoryId }
    });
    return response.data.data.upcoming;
  } catch (error) {
    throw error;
  }
};

export const notifyThirdUser = async (fcmToken) => {
  try {
    const response = await apiService.post('/auth/notify-third', { fcmToken });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getDesksByCategory = async (categoryId, params = {}) => {
  try {
    const response = await apiService.get(`/queue/desks/${categoryId}`, { params });
    return response.data.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch desks');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to send reset link';
    throw new Error(msg);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiService.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

export const resetPassword = async (email, password, otp) => {
  try {
    const response = await apiService.post('/auth/reset-password', { email, password, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const verifyEmailApi = async (code) => {
  try {
    const response = await apiService.post('/auth/verify', { code });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
};

export const verificationcode = async () => {
  try {
    const response = await apiService.post('/auth/verification-code');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend verification code');
  }
};

export const profileUpdate = async (formData) => {
  try {
    const response = await axios.post(`${getBaseUrl()}/api/user/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const getUserProfileme = async () => {
  try {
    const response = await apiService.get('/user/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

export const createQueue = async (queueData) => {
  try {
    const response = await apiService.post('/queue', queueData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create queue');
  }
};

export const getQueueList = async (params = {}) => {
  try {
    const user = await getAuthUser();
    const requestParams = {
      merchantId: user?.id,
      ...params
    };
    const response = await apiService.get('/queue/list', { params: requestParams });
    return response.status === 200 ? response.data || [] : [];
  } catch (error) {
    throw error;
  }
};

export const getBusinessList = async () => {
  try {
    const response = await apiService.get('/queue/business/list');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch business list');
  }
};

export const checkToken = async (payload) => {
  try {
    const response = await apiService.post('/token/check-token', payload);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check token');
  }
};

export const generateToken = async ({ queueId, categoryId }) => {
  try {
    const response = await apiService.post('/token/generate-token', { queueId, categoryId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate token');
  }
};

export const getTokenList = async (businessId) => {
  try {
    const response = await apiService.get('/token/list', { params: { businessId } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

export const getCompletedTokenList = async (businessId) => {
  try {
    const response = await apiService.get('/token/completed', { params: { businessId } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get completed tokens');
  }
};

export const getQueueDetails = async (queueId) => {
  try {
    const response = await apiService.get(`/queue/details/${queueId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

export const getTokenDelete = async (TokenId) => {
  try {
    const response = await apiService.delete(`/token/delete/${TokenId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

export const getQueueDelete = async (queueId) => {
  try {
    const response = await apiService.delete(`/queue/delete/${queueId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete queue');
  }
};

export const getServicingList = async (queueId, categoryId, businessId) => {
  try {
    const response = await apiService.get(`/token/servicing/${queueId}`, {
      params: { categoryId, businessId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const getServicingSkip = async (tokenIds) => {
  try {
    const response = await apiService.post('/token/skip', { tokenIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const recoverSkippedToken = async (tokenNumber) => {
  try {
    const response = await apiService.post('/token/recover-token', { tokenNumber });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const getSkippedList = async (queueId, categoryId, businessId) => {
  try {
    const response = await apiService.get(`/token/skippedTokens/${queueId}`, {
      params: { categoryId, businessId }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const getTokenCounts = async (businessId) => {
  try {
    const user = await getAuthUser();
    const response = await apiService.get(`/token/token-counts/count`, {
      params: {
        businessId,
        merchantId: user?.id
      }
    });
    return response.data.data;
  } catch (error) {
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
    throw error.response?.data || error;
  }
};

export const getCompletedHistory = async (queueId, categoryId, businessId) => {
  try {
    const response = await apiService.get(`/token/completed/history`, {
      params: { queueId, categoryId, businessId }
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
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const markUserAvailable = async (queueId, tokenNumber) => {
  try {
    const response = await apiService.post('/queue/mark-available', { queueId, tokenNumber });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get servicing list');
  }
};

export const createBusiness = async (data) => {
  try {
    const response = await apiService.post('/queue/business/create', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create business');
  }
};

export const updateBusiness = async (businessId, data) => {
  try {
    const response = await apiService.put(`/queue/business/update/${businessId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update business');
  }
};

export const deleteBusiness = async (businessId) => {
  try {
    const response = await apiService.delete(`/queue/business/delete/${businessId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete business');
  }
};

export const createDesk = async (data) => {
  try {
    const response = await apiService.post('/queue/desk/create', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create desk');
  }
};

export const updateDesk = async (deskId, data) => {
  try {
    const response = await apiService.put(`/queue/desk/update/${deskId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update desk');
  }
};

export const deleteDesk = async (deskId) => {
  try {
    const response = await apiService.delete(`/queue/desk/delete/${deskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete desk');
  }
};

export const getDeskList = async (params = {}) => {
  try {
    const user = await getAuthUser();
    const requestParams = {
      ...params
    };
    const response = await apiService.get('/queue/desk/list', { params: requestParams });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch desk list');
  }
};

export const getMerchantAnalytics = async (businessId) => {
  try {
    const response = await apiService.get('/token/merchant/analytics', {
      params: { businessId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendBroadcast = async (data) => {
  try {
    const response = await apiService.post('/token/broadcast', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async () => {
  try {
    const response = await apiService.post('/auth/delete-account');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};

export default apiService;