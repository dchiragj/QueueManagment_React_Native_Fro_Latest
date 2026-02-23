
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from '../../constants/screens';
import MyTokenScreen from '../../screens/Customer/MyToken/MyToken';
import MyTokenDetailsScreen from '../../screens/Customer/MyToken/MyTokenDetails';

const Stack = createNativeStackNavigator();

export default function MyTokenStack() {
  return (
    <Stack.Navigator
      initialRouteName={screens.MyToken}
     screenOptions={{
        headerShown: false,          
      }}
    >
      <Stack.Screen
        name={screens.MyToken}
        component={MyTokenScreen}
        options={{ title: 'My Tokens' }}
      />
      <Stack.Screen
        name={screens.MyTokenDetails}
        component={MyTokenDetailsScreen}
        options={{ title: 'My Token Details' }}
      />
    </Stack.Navigator>
  );
}