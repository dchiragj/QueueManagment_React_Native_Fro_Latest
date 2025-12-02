// import screens from '../constants/screens';
// import { AuthenticationNavigator, HowItWorksNavigator } from './navigators';
// import { urlPrefix } from '../constants/constant';
// import SplashScreen from '../screens/SplashScreen';
// import { createSwitchNavigator } from 'react-navigation';
// import DrawerNavigator from './NavigatorDrawer';

// const routes = {
//   [screens.Splash]: {
//     screen: SplashScreen
//   },
//   auth: AuthenticationNavigator,
//   [screens.DrawerRoot]: {
//     screen: DrawerNavigator,
//     headerMode: 'screen',
//     navigationOptions: {
//       header: null,
//       gesturesEnabled: false
//     }
//   }
// };

// const config = {
//   initialRouteParams: screens.Splash,
//   headerMode: 'none'
// };

// const Navigator = createSwitchNavigator(routes, config);
// Navigator.urlPrefix = urlPrefix;
// export default Navigator;
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthenticationStack from './navigators/AuthenticationNavigator'; 
import DrawerNavigator from './NavigatorDrawer'; 
import SplashScreen from '../screens/SplashScreen';
import Home from '../screens/Home/Home';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Splash" component={SplashScreen} />


      <Stack.Screen name="Auth" component={AuthenticationStack} />


      <Stack.Screen name="MainApp" component={DrawerNavigator} />

    </Stack.Navigator>
  );
}