import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native'; 

import DrawerDesignComponent from '../components/DrawerDesign';
import RootRoutes from './routes/RootRoutes';
import screens from '../constants/screens';
import { colors } from '../styles';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
   <Drawer.Navigator
      initialRouteName={screens.HomeRoot}
      drawerContent={(props) => <DrawerDesignComponent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#15192C' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        headerTitleAlign: 'center',

        headerLeft: () => {
          const navigation = useNavigation();
          return (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            >
              <Icon name="menu" size={28} color={colors.primary} />
            </TouchableOpacity>
          );
        },

        headerRight: () => {
          const route = useRoute();
          const navigation = useNavigation();

          const isMyQueue = route.name === screens.MyQueue || route.name === 'MyQueue';
          if (!isMyQueue) {
            return null;
          }

          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate(screens.Step1)}
            >
              <Icon name="add-circle-outline" size={30} color={colors.primary} />
            </TouchableOpacity>
          );
        },

        drawerActiveTintColor: '#FF6B00',
        drawerInactiveTintColor: '#ccc',
        drawerType: 'front',
        drawerStyle: { width: '80%' },
      }}
      >
      {Object.keys(RootRoutes).map((routeName) => {
        const { screen: ScreenComponent, navigationOptions } = RootRoutes[routeName];
        const options = typeof navigationOptions === 'function' 
          ? navigationOptions() 
          : navigationOptions;

        return (
          <Drawer.Screen
            key={routeName}
            name={routeName}
            component={ScreenComponent}
            options={options}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;