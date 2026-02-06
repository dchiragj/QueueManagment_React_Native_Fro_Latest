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
import { useBranch } from '../context/BranchContext'; // Import useBranch
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
  const { businesses, selectedBranchId, changeBranch, setToken } = useBranch(); // Consume context
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

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
    setToken(null);
  };

  return (
    <>
      <SafeAreaView style={[AppStyles.root]}>
        <View style={s.bordertop} />

        {/* BRANCH SELECTOR */}
        <View style={s.branchSelectorContainer}>
          <Touchable
            style={s.branchSelectorHeader}
            onPress={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
          >
            <View style={s.branchInfo}>
              <Icon name="business" isFeather={false} size={20} color={colors.primary} />
              <TextView
                text={
                  selectedBranchId === 'all'
                    ? 'All Branches'
                    : businesses.find(b => String(b.id) === String(selectedBranchId))?.businessName || 'Select Branch'
                }
                type={'body'}
                style={s.branchName}
                color={colors.white} // Explicit white color
              />
            </View>
            <Icon
              name={isBranchDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.white} // White icon
            />
          </Touchable>

          {isBranchDropdownOpen && (
            <View style={s.branchDropdown}>
              <Touchable
                style={[
                  s.branchItem,
                  selectedBranchId === 'all' && s.selectedBranchItem
                ]}
                onPress={() => {
                  changeBranch('all');
                  setIsBranchDropdownOpen(false);
                }}
              >
                <TextView text="All Branches" type="caption" color={colors.white} />
                {selectedBranchId === 'all' && <Icon name="check" size={16} color={colors.primary} />}
              </Touchable>
              {businesses.map(business => (
                <Touchable
                  key={business.id}
                  style={[
                    s.branchItem,
                    String(selectedBranchId) === String(business.id) && s.selectedBranchItem
                  ]}
                  onPress={() => {
                    changeBranch(business.id);
                    setIsBranchDropdownOpen(false);
                  }}
                >
                  <TextView text={business.businessName} type="caption" color={colors.white} />
                  {String(selectedBranchId) === String(business.id) && (
                    <Icon name="check" size={16} color={colors.primary} />
                  )}
                </Touchable>
              ))}
            </View>
          )}
        </View>

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
    marginVertical: verticalScale(50),
    width: '100%'
  },
  branchSelectorContainer: {
    paddingHorizontal: scale(indent),
    paddingTop: verticalScale(indent),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)', // Lighter border
    paddingBottom: verticalScale(10),
  },
  branchSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10), // More padding
    backgroundColor: 'rgba(255,255,255,0.05)', // Slight background
    paddingHorizontal: scale(10),
    borderRadius: 8,
  },
  branchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  branchName: {
    marginLeft: scale(10),
    fontWeight: '600',
    color: colors.white, // Ensure white text
  },
  branchDropdown: {
    marginTop: verticalScale(5),
    backgroundColor: '#1E2235', // Darker background for dropdown
    borderRadius: 8,
    padding: scale(5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  branchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    borderRadius: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  selectedBranchItem: {
    backgroundColor: 'rgba(255, 106, 0, 0.2)', // More visible selection
  },
  container: {
    marginTop: verticalScale(10) // Reduced margin since we added specific Branch Selector section
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
