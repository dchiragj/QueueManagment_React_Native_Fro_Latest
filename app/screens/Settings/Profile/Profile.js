import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import AppStyles from '../../../styles/AppStyles';
import React, { useEffect, useRef, useState } from 'react';
import screens from '../../../constants/screens';
import NavigationOptions from '../../../components/NavigationOptions';
import { View, SafeAreaView, StyleSheet, Image, Touchable, Animated, Text, TouchableOpacity, Easing } from 'react-native';
import colors from '../../../styles/colors';
import TextView from '../../../components/TextView/TextView';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import Icon from '../../../components/Icon';
import { borderRadius } from '../../../styles/dimensions';
import { connect } from 'react-redux';
import { getUserProfile } from '../../../services/profileService';
import { logout } from '../../../services/authService';
import Loading from '../../../components/Loading';
import { Button } from '../../../components/Button';
import { getBaseUrl } from '../../../global/Environment';

const Profile = (props) => {
  const { user } = props?.auth;

  const [logoutVisible, setLogoutVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const onPressEdit = () => {
    props.navigation.navigate(screens.Onboarding, {
      source: screens.Profile
    });
  };
  const onSignOut = () => {
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

  const { profileInfo = {}, loading } = props.profile;
  if (loading || !profileInfo) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <View style={s.profileWrapper}>
          <Image
            source={
              user?.ProfileUrl
                ? {
                  uri: user.ProfileUrl.startsWith('file')
                    ? user.ProfileUrl
                    : user.ProfileUrl.startsWith('http')
                      ? user.ProfileUrl
                      : `${getBaseUrl()}/${user.ProfileUrl}`,
                }
                : require('../../../assets/images/profile.png')
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
            resizeMode="cover"
          />
          <TextView color={colors.white} text={user?.name} type={'body-head'} style={[s.profileInfo]} />
          <TextView
            color={colors.lightWhite}
            text={user.role?.toUpperCase()}
            type={'body-head'}
            style={[s.profileInfo]}
          />
        </View>
        {}
        {}
        <View style={s.mailWrapper}>
          <Icon color={colors.primary} name='transgender' isFeather={false} />
          <TextView
            numberOfLines={1}
            style={s.mailTextStyle}
            color={colors.white}
            text={user.gender}
            type={'body'}
          />
        </View>
        <View style={s.mailWrapper}>
          <Icon color={colors.primary} name='location' isFeather={false} />
          <TextView
            numberOfLines={1}
            style={s.mailTextStyle}
            color={colors.white}
            text={user.address}
            type={'body'}
          />
        </View>
        <View style={s.mailWrapper}>
          <Icon color={colors.primary} name='mail' isFeather={false} />
          <TextView
            numberOfLines={1}
            style={s.mailTextStyle}
            color={colors.white}
            text={user.email}
            type={'body'}
          />
          {}
        </View>
        <View style={s.mailWrapper}>
          <Icon name='call' color={colors.primary} isFeather={false} />
          <TextView style={s.mailTextStyle} color={colors.lightWhite} text={user.mobileNumber} type={'body'} />
          <TextView color={colors.green} text={'verify'} type={'body'} />
        </View>
        {}
        <View style={s.buttonRow}>
          <Button
            onPress={onPressEdit}
            ButtonText='Edit Profile'
            style={s.editBtn}
            textStyle={s.editBtnText}
          />
          <Button
            onPress={onSignOut}
            ButtonText='Sign Out'
            style={s.signOutBtn}
            textStyle={s.signOutBtnText}
          />
        </View>
      </ScrollableAvoidKeyboard>
      {logoutVisible && (
        <View style={s.overlay}>
          <Animated.View
            style={[s.modal, { transform: [{ scale: scaleAnim }] }]}
          >
            <Text style={s.title}>Logout</Text>
            <Text style={s.subtitle}>Are you sure you want to logout?</Text>

            <View style={s.row}>
              <TouchableOpacity
                style={[s.btn, { backgroundColor: '#ccc' }]}
                onPress={hideLogoutModal}
              >
                <Text style={s.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btn, { backgroundColor: 'red' }]}
                onPress={handleLogout}
              >
                <Text style={s.btnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
};
Profile.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerRight: (
      <TextView
        isClickableLink={false}
        color={colors.primary}
        text={'Edit'}
        type={'body-head'}
        style={s.headerEditBtn}
        onPress={navigation.getParam('onPressEdit')}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  profileWrapper: {
    marginTop: verticalScale(20),
    alignItems: 'center'
  },
  profileInfo: {
    marginTop: verticalScale(10)
  },
  profileGenderWrapper: {
    marginHorizontal: scale(5),
    marginTop: verticalScale(40),
    flexDirection: 'row'
  },
  locationWrapper: {
    marginHorizontal: scale(5),
    flexDirection: 'row',
    marginTop: verticalScale(15)
  },
  genderLogo: {
    marginHorizontal: scale(15)
  },
  locationText: {
    flex: 1
  },
  headerEditBtn: {
    marginRight: scale(10),
    padding: moderateScale(10)
  },
  mailWrapper: {
    backgroundColor: colors.inputBackgroundColor,
    padding: 15,
    borderRadius: borderRadius,
    marginTop: verticalScale(15),
    marginHorizontal: scale(5),
    flexDirection: 'row'
  },
  mailTextStyle: {
    flex: 0.99,
    marginHorizontal: 8
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(30),
    marginTop: verticalScale(70),
    marginBottom: verticalScale(20),
    gap: scale(5),
  },

  editBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius,
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
  },
  editBtnText: {
    color: colors.white,
    fontWeight: '600',
  },

  signOutBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius,
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
  },
  signOutBtnText: {
    color: colors.primary,
    fontWeight: '600',
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

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getUserProfile, logout })(Profile);
