/* Redux */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Import your root navigator (Stack, Drawer, Tabs, etc.)
import RootNavigator from './Navigator';
// import RootNavigator from './RootNavigator'; // or Navigator.js, whatever your main one is

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
