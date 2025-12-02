// app/navigation/stacks/MyQueueStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import screens from '../../constants/screens';
import MyQueueScreen from '../../screens/Merchant/My Queue/MyQueue';
import MyQueueDetail from '../../screens/Merchant/My Queue/MyQueueDetail';
import Servicing from '../../screens/Service/Servicing';
import Step1Screen from '../../screens/Merchant/CreateQueue/Step1';
import Step2Screen from '../../screens/Merchant/CreateQueue/Step2';
import Step3Screen from '../../screens/Merchant/CreateQueue/Step3';  
import Step4Screen from '../../screens/Merchant/CreateQueue/Step4';

const Stack = createNativeStackNavigator();

export default function MyQueueStack() {
  return (
    <Stack.Navigator
      initialRouteName={screens.MyQueue}
      screenOptions={{
        headerShown: false,          
      }}
    >
      <Stack.Screen
        name={screens.MyQueue}
        component={MyQueueScreen}
        options={{ title: 'My Queue' }}
      />
      <Stack.Screen
        name={screens.MyQueueDetail}
        component={MyQueueDetail}
        options={{ title: 'Queue Detail' }}
      />
      <Stack.Screen
        name={screens.Service}
        component={Servicing}
        options={{ title: 'Serving' }}
      />
      <Stack.Screen
        name={screens.Step1}
        component={Step1Screen}
        options={{ title: 'Create Queue' }}
      />
      <Stack.Screen
        name={screens.Step2}
        component={Step2Screen}
        options={{ title: 'Create Queue' }}
      />
      <Stack.Screen
        name={screens.Step3}
        component={Step3Screen}
        options={{ title: 'Create Queue' }}
      />
      <Stack.Screen
        name={screens.Step4}
        component={Step4Screen}
        options={{ title: 'Create Queue' }}
      />
    </Stack.Navigator>
  );
}