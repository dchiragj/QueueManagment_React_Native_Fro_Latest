import React, { useEffect, useState } from 'react';
import { StatusBar, View, Platform, LogBox, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from './app/store/store';
import AppStyles from './app/styles/AppStyles';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import AppNavigator from './app/navigation';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import Icon from './app/components/Icon';
import { colors } from './app/styles';
import { BranchProvider } from './app/context/BranchContext';

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    LogBox.ignoreAllLogs(); // Optional: better to fix warnings instead
  }, []);
  // Move this inside useEffect if you want it to run once
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
  });

  // 🔥 Internet Listener — AUTO UPDATE
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state?.isConnected);
    });
    return () => unsubscribe();
  }, []);



  // 1. When a notification is received while the app is in the foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
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
        type: 'success',
        text1: body || 'Your turn has arrived!',
        text2: title || `Token ${tokenNumber} - Please come now!`,
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
      <Provider store={store}>
        <BranchProvider>
          {!isConnected ? (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              gap: 10,
              backgroundColor: colors.backgroundColor
            }}>
              <Text style={{ fontSize: 28, fontWeight: 900, color: colors.white }}>Queue Flow</Text>
              <Icon
                name="cloud-offline"
                isFeather={false}
                size={100}
                color={colors.primary}
              />
              <Text style={{ fontSize: 20, color: colors.white }}> Please connect to internet</Text>
            </View>
          ) : (
            <AppNavigator />
          )}
        </BranchProvider>
      </Provider>
      <Toast />
    </View>
  );
};

export default App;