import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import screens from '../../constants/screens';
import MyQueueScreen from '../../screens/Merchant/My Queue/MyQueue';
import MyQueueDetail from '../../screens/Merchant/My Queue/MyQueueDetail';
import Servicing from '../../screens/Service/Servicing';
import Step1Screen from '../../screens/Merchant/CreateQueue/Step1';
import Step2Screen from '../../screens/Merchant/CreateQueue/Step2';
import Step3Screen from '../../screens/Merchant/CreateQueue/Step3';
import Step4Screen from '../../screens/Merchant/CreateQueue/Step4';
import { colors } from '../../styles';

const Stack = createNativeStackNavigator();

export default function MyQueueStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName={screens.MyQueue}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#15192C' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={screens.MyQueue}
        component={MyQueueScreen}
        options={({ navigation }) => ({
          title: 'My Queue',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            >
              <Icon name="menu" size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate(screens.Step1)}
            >
              <Icon name="add-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
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
        options={{ title: 'Add Queue' }}
      />
      <Stack.Screen
        name={screens.Step2}
        component={Step2Screen}
        options={{ title: 'Add Queue' }}
      />
      <Stack.Screen
        name={screens.Step3}
        component={Step3Screen}
        options={{ title: 'Add Queue' }}
      />
      <Stack.Screen
        name={screens.Step4}
        component={Step4Screen}
        options={{ title: 'Add Queue' }}
      />
    </Stack.Navigator>
  );
}