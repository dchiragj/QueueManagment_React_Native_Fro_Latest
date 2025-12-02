import React, { useEffect } from 'react';
import screens from '../constants/screens';
import { StyleSheet, Image } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { indent } from '../styles/dimensions';
import { Button } from '../components/Button';
import { colors } from '../styles';
import { scale, verticalScale } from 'react-native-size-matters';
import {SafeAreaView} from 'react-native';
// import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../assets/svg';

const Welcome = ({ navigation })=> {
  useEffect(() => {
    console.log('Welcome');
  });

  const onPressGetStarted = () => {
    console.log('onPressLogin');
    navigation.navigate(screens.Login);
  };

  return (
    <>
      <SafeAreaView style={AppStyles.root}>
        {/* <Image style={s.mainImg} source={require('../assets/images/qustartimg.png')} /> */}
        <Image style={s.mainImg} source={require('../assets/images/qustartimg.png')} />
        {/* <SvgIcon style={s.logo} svgs={svgs} name={'splash-logo'} fill={colors.primary} width={230} height={70} /> */}
        <Button
          onPress={onPressGetStarted}
          ButtonText='Get Started'
          style={s.buttonStyle}
          animationStyle={s.buttonStyle}
        />
      </SafeAreaView>
    </>
  );
}

const s = StyleSheet.create({
  mainImg: {
    marginTop: verticalScale(100),
    alignSelf: 'center'
  },
  logo: {
    marginTop: verticalScale(indent * 2),
    alignSelf: 'center'
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(40),
    marginTop: verticalScale(indent * 3),
    borderRadius: 15
  }
});

export default Welcome;
