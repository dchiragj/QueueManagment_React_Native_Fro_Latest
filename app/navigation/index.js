
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import UpdatePopup from '../components/UpdatePopup';

import RootNavigator from './Navigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <UpdatePopup />
      <RootNavigator />
    </NavigationContainer>
  );
}
