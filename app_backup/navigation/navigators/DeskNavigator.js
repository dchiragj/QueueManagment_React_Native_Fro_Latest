import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screens from '../../constants/screens';
import DeskList from '../../screens/Merchant/Desk/DeskList';
import AddDesk from '../../screens/Merchant/Desk/AddDesk';

const Stack = createNativeStackNavigator();

export default function DeskNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={screens.DeskList}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name={screens.DeskList}
                component={DeskList}
                options={{ title: 'Desk List' }}
            />
            <Stack.Screen
                name={screens.AddDesk}
                component={AddDesk}
                options={({ route }) => ({
                    title: route?.params?.desk ? 'Edit Desk' : 'Add Desk'
                })}
            />
        </Stack.Navigator>
    );
}
