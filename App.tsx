import React, { useEffect } from 'react';
import { StatusBar, View, Platform, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import store from './app/store/store';
import AppStyles from './app/styles/AppStyles';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';

import AppNavigator from './app/navigation'; 
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs(); // Optional: better to fix warnings instead
  }, []);

  // Move this inside useEffect if you want it to run once
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
  });


// 1. When a notification is received while the app is in the foreground
useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {

    // Show a toast notification
    Toast.show({
      type: 'success',
      text1: remoteMessage.notification?.title || 'Your turn has arrived!',
      text2: remoteMessage.notification?.body || 'Please come now!',
      position: 'top',
      visibilityTime: 6000,
    });
  });

  return unsubscribe;
}, []);

// 2. When user taps on a notification and the app opens
useEffect(() => {
  // App was in background → user tapped notification
  const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
    const { body, title } = remoteMessage.notification;
    const { tokenNumber } = remoteMessage.data;

    Toast.show({
      type:  'success',
      text1: body || 'Your turn has arrived!',
      text2:title || `Token ${tokenNumber} - Please come now!`,
      visibilityTime: 8000,
    });
  });

  // App was completely closed → user tapped notification to open it
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        const { tokenNumber } = remoteMessage.data;

        setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Welcome!',
            text2: `Token ${tokenNumber} - Your turn has arrived!`,
            visibilityTime: 10000,
          });
        }, 1000);
      }
    });

  return unsubscribe;
}, []);

  return (
    <View style={AppStyles.rootStyle}>
      <StatusBar
        translucent
        barStyle="light-content"
      />
      <Provider store={store}>
        <AppNavigator />
      </Provider>
      <Toast />
    </View>
  );
};

export default App;