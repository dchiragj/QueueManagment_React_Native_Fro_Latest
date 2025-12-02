import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard' ;
import AppStyles from '../../../styles/AppStyles';
import React, { useEffect } from 'react';
import screens from '../../../constants/screens';
import NavigationOptions from '../../../components/NavigationOptions';
import { View, SafeAreaView, StyleSheet, Image } from 'react-native';
import  colors  from '../../../styles/colors';
import TextView from '../../../components/TextView/TextView';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import Icon from '../../../components/Icon';
import { borderRadius } from '../../../styles/dimensions';
import { connect } from 'react-redux';
import  {getUserProfile}  from'../../../actions/profileActions';
import { logout } from'../../../services/authService';
import Loading from '../../../components/Loading';
import { Button } from '../../../components/Button';

const Profile = (props) => {
    const { user } = props.auth;
  console.log('Profile',user);
  useEffect(() => {

    loadData();
    props.navigation.setParams({ onPressEdit });
    const focusListener = props.navigation.addListener('didFocus', () => {
    });
    return () => {
      focusListener.remove();
    };
  }, []);

  const loadData = async () => {
    await props.getUserProfile();
  };
  const onPressEdit = () => {
    props.navigation.navigate(screens.Onboarding, {
      source: screens.Profile
    });
  };
  const onSignOut = async () => {
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
          <Image source={require('../../../assets/images/profile.png')} />
          <TextView color={colors.white} text={profileInfo?.name} type={'body-head'} style={[s.profileInfo]} />
          <TextView
            color={colors.lightWhite}
            text={profileInfo.role?.toUpperCase()}
            type={'body-head'}
            style={[s.profileInfo]}
          />
        </View>
        <View style={[s.profileGenderWrapper]}>
          <Icon name='transgender' color={colors.primary} isFeather={false} style={s.genderLogo} />
          <TextView style={s.locationText} color={colors.white} text={profileInfo?.gender} type={'body'} />
        </View>
        <View style={s.locationWrapper}>
          <Icon style={s.genderLogo} name='md-location' color={colors.primary} isFeather={false} />
          <TextView style={s.locationText} color={colors.white} text={profileInfo.address || 'Address'} type={'body'} />
        </View>
        <View style={s.mailWrapper}>
          <Icon color={colors.primary} name='mail' isFeather={false} />
          <TextView
            numberOfLines={1}
            style={s.mailTextStyle}
            color={colors.white}
            text={profileInfo.email}
            type={'body'}
          />
          <Icon color={colors.green} name='md-shield-checkmark-sharp' isFeather={false} />
        </View>
        <View style={s.mailWrapper}>
          <Icon name='call' color={colors.primary} isFeather={false} />
          <TextView style={s.mailTextStyle} color={colors.lightWhite} text={profileInfo.mobileNumber} type={'body'} />
          <TextView color={colors.green} text={'verify'} type={'body'} />
        </View>
        {/* <TextView
          isClickableLink={true}
          color={colors.primary}
          text={'Sign Out'}
          type={'body-head'}
          style={[s.signOut]}
          onPress={onSignOut}
        /> */}
        <Button onPress={onSignOut} ButtonText='Sign Out' style={s.btn} animationStyle={s.btn} />
      </ScrollableAvoidKeyboard>
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
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(70),
    marginBottom: verticalScale(10),
    borderRadius: borderRadius
  },
  signOut: {
    textAlign: 'center',
    marginVertical: verticalScale(80)
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getUserProfile, logout })(Profile);
