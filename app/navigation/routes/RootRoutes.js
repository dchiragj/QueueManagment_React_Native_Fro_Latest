import React from 'react';
import {
  HomeNavigator,
  MyTokenNavigator,
  CompletedTokenNavigator,
  SettingsNavigator,
  MyQueueNavigator,
  ServiceNavigator
} from '../navigators';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import screens from '../../constants/screens';
import { colors } from '../../styles';

const RootRoutes = {
  [screens.HomeRoot]: {
    screen: HomeNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Home',
      title: 'Home',                                          
      drawerIcon: ({ tintColor }) => <MaterialIcons name='home' size={24} color={colors.primary} />
    })
  },
  [screens.MyTokenRoot]: {
    screen: MyTokenNavigator,
    navigationOptions: () => ({
      drawerLabel: 'My Tokens',
      title: 'My Tokens',                                    
      drawerIcon: ({ tintColor }) => <MaterialIcons name='shopping-bag' size={24}color={colors.primary} />
    })
  },
  [screens.CompletedTokenRoot]: {
    screen: CompletedTokenNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Completed Tokens',
      title: 'Completed Tokens',                             
      drawerIcon: ({ tintColor }) => <MaterialIcons name='shopping-bag' size={24} color={colors.primary} />
    })
  },
  [screens.SettingsRoot]: {
    screen: SettingsNavigator,
    navigationOptions: () => ({
      drawerLabel: 'Settings',
      title: 'Settings',                                     
      drawerIcon: ({ tintColor }) => <MaterialIcons name='settings' size={24} color={colors.primary} />
    })
  },
  [screens.MyQueueRoot]: {
    screen: MyQueueNavigator,
    navigationOptions: () => ({
      drawerLabel: 'My Queue',
      title: 'My Queue',                                    
      drawerIcon: ({ tintColor }) => <MaterialIcons name='queue' size={24} color={colors.primary} />
    })
  },
};

export default RootRoutes;
