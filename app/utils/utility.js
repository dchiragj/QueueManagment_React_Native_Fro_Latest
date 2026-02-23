import { ToastAndroid, Platform } from 'react-native';

const ToastNotification = (message) => {
  if (Platform.OS == 'ios') {
    
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
};

export default {
  ToastNotification
};
