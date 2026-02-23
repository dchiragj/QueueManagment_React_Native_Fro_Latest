import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard' ;
import AppStyles from '../../../styles/AppStyles';
import TextView from '../../../components/TextView/TextView';
import Input from '../../../components/Input';
import Icon from '../../../components/Icon';
import { Button, Touchable } from '../../../components/Button';
import  colors  from '../../../styles/colors';
import { borderRadius } from '../../../styles/dimensions';
import { verticalScale, scale } from 'react-native-size-matters';

const Step4 = () => {
  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView
          text={'Make a solution list'}
          type={'body-one'}
          isTextColorWhite={true}
          style={[AppStyles.titleStyle]}
        />
        <View style={s.inputWrapper}>
          <Input
            wrapperStyle={s.inputWrapperStyle}
            style={s.inputText}
            returnKeyType={'next'}
            placeholder='Write Solutions'
            isIconLeft={true}
            leftIconName={'create'}
          />
          <Touchable style={s.iconTouchable}>
            <Icon name='add' color={colors.primary} isFeather={false} style={s.inputIcon} />
          </Touchable>
        </View>
        <View style={s.topBorder} />
        <View style={s.inputBtnWrapper}>
          <View>
            <Input
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Problem 1'
              isIconLeft={true}
              leftIconName={'create'}
            />
          </View>
          <Button
            ButtonText='Submit'
            style={[s.btn, AppStyles.btnStyle]}
            animationStyle={[s.btn, AppStyles.btnStyle]}
          />
        </View>
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};
Step4.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row'
  },
  inputWrapperStyle: {
    flex: 0.9
  },
  inputText: {
    color: colors.white
  },
  iconTouchable: {
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
    flex: 0.1,
    marginLeft: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(18),
    marginVertical: verticalScale(8)
  },
  inputIcon: {
    alignItems: 'center',
    alignSelf: 'center'
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginVertical: scale(30),
    marginHorizontal: scale(15)
  },
  inputBtnWrapper: {
    flex: 1,
    justifyContent: 'space-between'
  },
  btn: {
    marginTop: verticalScale(50),
    marginBottom: verticalScale(40)
  }
});
export default Step4;
