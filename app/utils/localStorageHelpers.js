import AsyncStorage from '@react-native-async-storage/async-storage';
const AUTH_USER_KEY = 'kimarketing_user';
const HAS_SEEN_TOUR_KEY = 'has_seen_tour';

export const saveAuthUser = async (data) => {
  try {
    var jsonOfItem = await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    return jsonOfItem;
  } catch (error) {
  }
};

export const getAuthUser = async () => {
  try {
    const user = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (user) return JSON.parse(user);
    return undefined;
  } catch (error) {
  }
};

export const deleteAuthUser = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
  }
};

export const deleteAllLocalData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    await AsyncStorage.removeItem(HAS_SEEN_TOUR_KEY);
  } catch (error) {
  }
};

export const setHasSeenTour = async (value) => {
  try {
    await AsyncStorage.setItem(HAS_SEEN_TOUR_KEY, JSON.stringify(value));
  } catch (error) {
  }
};

export const getHasSeenTour = async () => {
  try {
    const value = await AsyncStorage.getItem(HAS_SEEN_TOUR_KEY);
    if (value) return JSON.parse(value);
    return false;
  } catch (error) {
    return false;
  }
};
