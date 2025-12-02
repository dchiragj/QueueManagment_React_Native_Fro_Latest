import { ToastAndroid, Platform } from 'react-native'; //eslint-disable-line

const ToastNotification = (message) => {
  if (Platform.OS == 'ios') {
    alert(message);
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
};

export default {
  ToastNotification
};
