
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from '../../constants/screens';
import HomeScreen from '../../screens/Home/Home';
import CategoriesScreen from '../../screens/Home/Categories';
import CustomerQueueListScreen from '../../screens/Customer/Queue/CustomerQueueList';
import GenerateTokenScreen from '../../screens/Customer/GenerateToken/GenerateToken';
import CustomerQueueDetailsScreen from '../../screens/Customer/Queue/CustomerQueueDetails';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName={screens.Home}
     screenOptions={{
        headerShown: false,          
      }}
    >
      <Stack.Screen
        name={screens.Home}
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name={screens.Categories}
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name={screens.CustomerQueueList}
        component={CustomerQueueListScreen}
        options={{ title: 'Queue List' }}
      />
      <Stack.Screen
        name={screens.CustomerQueueDetails}
        component={CustomerQueueDetailsScreen}
        options={{ title: 'Queue Details' }}
      />
      <Stack.Screen
        name={screens.GenerateToken}
        component={GenerateTokenScreen}
        options={{ title: 'Generate Token' }}
      />
    </Stack.Navigator>
  );
}