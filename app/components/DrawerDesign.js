import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Text,
  Animated,
  Easing
} from 'react-native';
import { connect } from 'react-redux';
import { DrawerItemList } from '@react-navigation/drawer';
import screens from '../constants/screens';
import { logout } from '../services/authService';
import { colors } from '../styles';
import { indent } from '../styles/dimensions';
import { Touchable } from './Button';
import TextView from './TextView/TextView';
import AppStyles from '../styles/AppStyles';
import Icon from './Icon';
import { verticalScale, scale } from 'react-native-size-matters';
import { CommonActions } from '@react-navigation/native';
import { Image } from 'react-native-svg';

function DrawerDesignComponent(props) {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const role = props.auth.user?.role;

  const allowedRouteNames =
    role === 'customer'
      ? ['HomeRoot', 'MyTokenRoot', 'CompletedTokenRoot', 'SettingsRoot']
      : props.state.routes.map(r => r.name); // merchant = all

  const filteredRoutes = props.state.routes.filter(route =>
    allowedRouteNames.includes(route.name)
  );
  const showLogoutModal = () => {
    setLogoutVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  const hideLogoutModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => setLogoutVisible(false));
  };

  const handleLogout = async () => {
    hideLogoutModal();
    await props.logout();
    props.navigation.navigate('Auth', { screen: screens.Login });
  };

  return (
    <>
      <SafeAreaView style={[AppStyles.root]}>
        <View style={s.bordertop} />

        <ScrollView contentContainerStyle={s.container}>
          {/* ROLE FILTERED DRAWER LIST */}
          <DrawerItemList
            {...props}
            state={{
              ...props.state,
              routes: filteredRoutes
            }}
          />

          <View style={s.borderBottom} />

          {/* SIGN OUT */}
          <Touchable style={s.signOutMain} onPress={showLogoutModal}>
            <Icon name="log-out" color={colors.lightWhite} />
            <TextView
              style={s.logoutLink}
              text={'Sign Out'}
              type={'body'}
              color={colors.lightWhite}
            />
          </Touchable>
        </ScrollView>
      </SafeAreaView>

      {/* LOGOUT MODAL */}
      {logoutVisible && (
        <View style={s.overlay}>
          <Animated.View
            style={[s.modal, { transform: [{ scale: scaleAnim }] }]}
          >
            <Text style={s.title}>Logout</Text>
            <Text style={s.subtitle}>Are you sure you want to logout?</Text>

            <View style={s.row}>
              <Touchable
                style={[s.btn, { backgroundColor: '#ccc' }]}
                onPress={hideLogoutModal}
              >
                <Text style={s.btnText}>Cancel</Text>
              </Touchable>
              <Touchable
                style={[s.btn, { backgroundColor: 'red' }]}
                onPress={handleLogout}
              >
                <Text style={s.btnText}>OK</Text>
              </Touchable>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  bordertop: {
    borderColor: colors.primary,
    borderWidth: 0.5,
    width: '100%'
  },
  borderBottom: {
    borderColor: colors.primary,
    borderWidth: 0.5,
    marginVertical: verticalScale(50),
    width: '100%'
  },
  container: {
    marginTop: verticalScale(50)
  },
  signOutMain: {
    flexDirection: 'row',
    paddingHorizontal: scale(indent),
    paddingVertical: verticalScale(indent)
  },
  logoutLink: {
    paddingLeft: scale(indent + 8)
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: '600'
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { logout })(DrawerDesignComponent);
