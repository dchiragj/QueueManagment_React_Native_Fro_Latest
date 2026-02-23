import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthenticationStack from './navigators/AuthenticationNavigator'; 
import DrawerNavigator from './NavigatorDrawer'; 
import SplashScreen from '../screens/SplashScreen';
import Home from '../screens/Home/Home';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Splash" component={SplashScreen} />


      <Stack.Screen name="Auth" component={AuthenticationStack} />


      <Stack.Screen name="MainApp" component={DrawerNavigator} />

    </Stack.Navigator>
  );
}