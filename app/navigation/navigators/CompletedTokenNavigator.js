import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompletedTokenScreen from '../../screens/Customer/CompletedToken/CompletedToken';
import screens from '../../constants/screens';

const Stack = createNativeStackNavigator();

export default function CompletedTokenStack() {
  return (
    <Stack.Navigator
      initialRouteName={screens.CompletedToken}
   screenOptions={{
        headerShown: false,          
      }}
    >
      <Stack.Screen
        name={screens.CompletedToken}
        component={CompletedTokenScreen}
        options={{ title: 'Completed Tokens' }}
      />
    </Stack.Navigator>
  );
}