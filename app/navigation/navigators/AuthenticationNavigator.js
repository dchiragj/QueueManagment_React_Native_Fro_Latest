// import screens from '../../constants/screens';
// import WelcomeScreen from '../../screens/Welcome';
// import LoginScreen from '../../screens/Membership/Login/Login';
// import SignupScreen from '../../screens/Membership/Signup/Signup';
// import ForgotPasswordScreen from '../../screens/Membership/ForgotPassword/ForgotPassword';
// import { createSwitchNavigator } from 'react-navigation';
// // import VerifyEmailScreen from '@app/app/screens/Membership/Signup/VerifyEmail';
// import VerifyEmailScreen from './../../screens/Membership/Signup/VerifyEmail';
// import OnboardingScreen from './../../screens/Membership/Onboarding/Onboarding';

// const routes = {
//   [screens.Welcome]: {
//     screen: WelcomeScreen
//   },
//   [screens.Login]: {
//     screen: LoginScreen,
//     path: 'login'
//   },
//   [screens.Signup]: {
//     screen: SignupScreen,
//     path: 'signup'
//   },
//   [screens.VerifyEmail]: {
//     screen: VerifyEmailScreen,
//     path: 'verifyEmail'
//   },
//   [screens.ForgotPassword]: {
//     screen: ForgotPasswordScreen,
//     path: 'forgotPassword'
//   },
//   [screens.Onboarding]: {
//     screen: OnboardingScreen,
//     path: 'Onboarding'
//   }

// };

// const config = {
//   initialRouteName: screens.Welcome,
//   headerMode: 'none',
//   resetOnBlur: false,
//   backBehavior: 'history'
// };

// const AuthenticationNavigator = createSwitchNavigator(routes, config);

// export default AuthenticationNavigator;
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../../screens/Welcome';
import LoginScreen from '../../screens/Membership/Login/Login';
import SignupScreen from '../../screens/Membership/Signup/Signup';
import ForgotPasswordScreen from '../../screens/Membership/ForgotPassword/ForgotPassword';
import VerifyEmailScreen from '../../screens/Membership/Signup/VerifyEmail';
import OnboardingScreen from '../../screens/Membership/Onboarding/Onboarding';

import screens from '../../constants/screens';

const Stack = createNativeStackNavigator();

export default function AuthenticationStack() {
  return (
    <Stack.Navigator
      initialRouteName={screens.Welcome}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={screens.Welcome} component={WelcomeScreen} />
      <Stack.Screen name={screens.Login} component={LoginScreen} />
      <Stack.Screen name={screens.Signup} component={SignupScreen} />
      <Stack.Screen name={screens.VerifyEmail} component={VerifyEmailScreen} />
      <Stack.Screen name={screens.ForgotPassword} component={ForgotPasswordScreen} />
      <Stack.Screen name={screens.Onboarding} component={OnboardingScreen} />
    </Stack.Navigator>
  );
}