import AsyncStorage from '@react-native-async-storage/async-storage';
const AUTH_USER_KEY = 'kimarketing_user';

export const saveAuthUser = async (data) => {
  try {
    var jsonOfItem = await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    return jsonOfItem;
  } catch (error) {
    console.log(error.message);
  }
};

export const getAuthUser = async () => {
  try {
    const user = await AsyncStorage.getItem(AUTH_USER_KEY);
    if (user) return JSON.parse(user);
    return undefined;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteAuthUser = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteAllLocalData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.log(error.message);
  }
};
