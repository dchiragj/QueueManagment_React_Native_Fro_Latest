import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // CORRECT IMPORT
import { connect } from 'react-redux';
import { colors } from '../styles';
import AppStyles from '../styles/AppStyles';
import { setupToken } from '../utils/authTokenHelpers';
import { getAuthUser } from '../utils/localStorageHelpers';
import { setCurrentUser } from './../actions/authActions';
import { getDisplayName } from '../global/Helpers';
import SvgIcon from 'react-native-svg'; // or your correct SVG component
import svgs from '../assets/svg';

function SplashScreen({ navigation, setCurrentUser }) {
  useEffect(() => {
    init();
  }, []);

const init = async () => {
  try {
    const token = await setupToken();
    let targetScreen = 'Login'; // default

    if (token) {
      const userDetails = await getAuthUser();
      if (userDetails) {
        const fullname = getDisplayName(userDetails.firstName, userDetails.lastName);
        const user = {
          id: userDetails.id,
          name: fullname,
          email: userDetails.email,
          role: userDetails.role,
          ProfileUrl: userDetails.ProfileUrl
        };
        setCurrentUser(user);

        if (userDetails.verificationRequired) {
          targetScreen = 'VerifyEmail';
        } else if (userDetails.onboardingRequired) {
          targetScreen = 'Onboarding';
        } else {
          // User is fully logged in → go to main app
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainApp' }],
            });
          }, 1500);
          return;
        }
      }
    }

    // For all auth-related screens: go through Auth navigator
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Auth',
          params: { screen: targetScreen },
        }],
      });
    }, 1500);

  } catch (error) {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Welcome' } }],
      });
    }, 1500);
  }
};

  return (
    <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding, s.container]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={s.logoContainer}>
        <SvgIcon
          svgs={svgs}
          name="splash-logo"
          width={250}
          height={72}
          fill={colors.primary}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapDispatchToProps = {
  setCurrentUser,
};

export default connect(null, mapDispatchToProps)(SplashScreen);