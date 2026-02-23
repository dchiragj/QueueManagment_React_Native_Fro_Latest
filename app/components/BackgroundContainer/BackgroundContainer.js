import React from 'react';
import AppStyles from '../../styles/AppStyles';
import SafeAreaView from 'react-native';
import { View, ImageBackground, StatusBar, StyleSheet, Text } from 'react-native';
import images from '../../assets/images';
import { colors } from '../../styles';
import TextView from '../TextView/TextView';
import { verticalScale, scale } from 'react-native-size-matters';

const BackgroundContainer = ({ children, isStatusBar = true, isBrandText = true, ...props }) => (
  <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]} forceInset={{ top: 'never', bottom: 'never' }}>
    {isStatusBar && <StatusBar translucent backgroundColor={colors.transparent} barStyle='light-content' />}
    <ImageBackground style={s.imageStyle} source={images['splashBackground']}>
      <View style={s.backDrop}></View>
      {}
      {children}
    </ImageBackground>
  </SafeAreaView>
);

const s = StyleSheet.create({
  inputWrapper: {
    marginBottom: 10
  },
  imageStyle: {
    resizeMode: 'contain',
    flex: 1
  },
  backDrop: {
    flex: 1,
    backgroundColor: colors.black,
    opacity: 0.6,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0
  },
  brandText: {
    position: 'absolute',
    top: verticalScale(100),
    right: scale(0),
    color: colors.white,
    fontWeight: 'bold',
    transform: [{ rotate: '270deg' }]
  }
});

export default BackgroundContainer;
