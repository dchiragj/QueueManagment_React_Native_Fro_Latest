
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from '../../constants/screens';
import SettingsScreen from '../../screens/Settings/Settings';
import Profile from '../../screens/Settings/Profile/Profile';
import OnboardingScreen from '../../screens/Membership/Onboarding/Onboarding';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName={screens.Settings}
    screenOptions={{
        headerShown: false,          
      }}
    >
      <Stack.Screen
        name={screens.Settings}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name={screens.Profile}
        component={Profile}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name={screens.Onboarding}
        component={OnboardingScreen}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
}