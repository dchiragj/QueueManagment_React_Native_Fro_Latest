import { Button, Touchable } from '../../components/Button';
import ScrollableAvoidKeyboard from '../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import TextView from '../../components/TextView/TextView';
import colors from '../../styles/colors';
import AppStyles from '../../styles/AppStyles';
import React, { useEffect } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { View, SafeAreaView, StyleSheet, Image, Linking, Platform, Alert } from 'react-native';
import { borderRadius, height } from '../../styles/dimensions';
import screens from '../../constants/screens';
import HeaderButton from '../../components/HeaderButton';
import Icon from '../../components/Icon';
import { connect } from 'react-redux';
import { logout } from '../../services/authService';
import NavigationOptions from '../../components/NavigationOptions';
import { getBaseUrl } from '../../global/Environment';

const Settings = (props) => {
  const { user } = props.auth;
  const ImageUrl = props.profile.profileInfo?.ProfileUrl;
  useEffect(() => {
    props.navigation.setParams({ openDrawer: _openDrawer });
  }, []);

  const onPressSignOut = async () => {
    await props.logout();
    props.navigation.navigate('Auth', { screen: screens.Login });
  };

  const onPressProfile = async () => {
    props.navigation.navigate(screens.Profile);
  };


  const onRate = () => {
    const GOOGLE_PACKAGE_NAME = 'com.QueueFlow';
    const APPLE_ID = 'YOUR_APPLE_ID';

    if (Platform.OS === 'android') {
      Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(() => {
        Linking.openURL(`https://play.google.com/store/apps/details?id=${GOOGLE_PACKAGE_NAME}`);
      });
    } else {
      Alert.alert('Coming Soon', 'Rating functionality for iOS will be available once the app is on the App Store.');
    }
  };

  const onHelp = () => {
    Linking.openURL('mailto:queueflow08@gmail.com?subject=Help Support').catch(() => {
      Alert.alert('Error', 'No email app found to send help request.');
    });
  };

  const _openDrawer = () => {
    props.navigation.openDrawer();
  };
  return (
    <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]} forceInset={{ top: 'never', bottom: 'never' }}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <Touchable onPress={onPressProfile} style={[s.profileMain, s.same]}>
          <View>
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
                  : require('../../assets/images/profile.png')
              }
              style={{ width: 75, height: 75, borderRadius: 50 }}
              resizeMode="cover"
            />

          </View>
          <View style={s.profileTextMain}>
            <TextView color={colors.white} text={user.name} type={'body'} style={s.profileText} />
            <TextView color={colors.lightWhite} text={user.email} type={'body-one'} style={s.profileText} />
          </View>
        </Touchable>
        <Touchable style={[s.scanMain, s.same]} onPress={() => props.navigation.navigate('QRScanner')}>
          <Icon name='scan-circle' color={colors.lightWhite} isFeather={false} />
          <TextView color={colors.lightWhite} text={'Scan QR For Generate Token'} type={'body'} />
          <Icon name='chevron-forward' color={colors.lightWhite} isFeather={false} />
        </Touchable>

        <View style={[s.rateMain, s.same]}>
          <Touchable style={s.rate} onPress={onRate}>
            <Icon name='star-sharp' color={colors.lightWhite} isFeather={false} style={s.rateLogo} />
            <TextView color={colors.lightWhite} text={'Rate This App'} type={'body'} style={s.profileText} />
          </Touchable>
          <Touchable style={[s.rate, s.help]} onPress={onHelp}>
            <Icon name='help-circle' color={colors.lightWhite} style={s.rateLogo} />
            <TextView color={colors.lightWhite} text={'Help'} type={'body-one'} style={s.profileText} />
          </Touchable>
        </View>
        {}
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};

Settings.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: false,
    navigation: navigation,
    headerLeft: (
      <HeaderButton
        type={1}
        iconName={'md-menu'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={navigation.getParam('openDrawer')}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};

const s = StyleSheet.create({
  same: {
    backgroundColor: colors.inputBackgroundColor,
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(20),
    borderRadius: borderRadius
  },
  profileMain: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    alignItems: 'center'
  },
  profileTextMain: {
    marginLeft: scale(15)
  },
  profileText: {
    marginTop: verticalScale(5)
  },
  scanMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  rateMain: {
    paddingLeft: verticalScale(15)
  },
  rate: {
    flexDirection: 'row'
  },
  rateLogo: {
    marginRight: scale(15)
  },
  help: {
    marginTop: verticalScale(15)
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(170),
    borderRadius: borderRadius
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { logout })(Settings);