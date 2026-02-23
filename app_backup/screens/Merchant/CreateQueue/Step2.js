import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard' ;
import AppStyles from '../../../styles/AppStyles';
import { Button, Touchable } from '../../../components/Button';
import TextView from '../../../components/TextView/TextView';
import Icon from '../../../components/Icon';
import  colors  from '../../../styles/colors';
import { borderRadius } from '../../../styles/dimensions';
import { verticalScale, scale } from 'react-native-size-matters';
import FormGroup from '../../../components/FormGroup';
import Validation from '../../../components/Validation/Validation';
import Input from '../../../components/Input';
import screens from '../../../constants/screens';
const Step2 = (props) => {
  const onPressStep3 = () => {
    props.navigation.navigate(screens.Step3);
  };
  const [expand, setExpand] = useState({});
  const openQueue = (area) => {
    setExpand({
      [area]: !expand[area]
    });
  };
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView text={'Desk’s Details'} type={'body-one'} isTextColorWhite={true} style={[AppStyles.titleStyle]} />
        <View style={s.inputBtnWrapper}>
          <View>
            <View style={s.Wrapper}>
              <Touchable style={s.touchableWrapper} onPress={() => openQueue('DeskA')}>
                <TextView color={colors.white} text={'Desk : A'} type={'body-one'} style={s.deskText} />
                <Icon
                  name={`${expand?.DeskA ? 'md-chevron-up' : 'md-chevron-down'}`}
                  color={colors.white}
                  isFeather={false}
                />
              </Touchable>
              {expand?.DeskA && (
                <>
                  <View style={s.topBorder} />
                  <FormGroup style={[s.fromGroup]}>
                    <Validation>
                      <Input
                        wrapperStyle={s.inputWrapperStyle}
                        containerStyle={s.inputContainerStyle}
                        style={s.inputText}
                        returnKeyType={'next'}
                        placeholder='Email Address'
                        isIconLeft={true}
                        leftIconName={'mail'}
                      />
                    </Validation>
                    <Validation>
                      <Input
                        wrapperStyle={s.inputWrapperStyle}
                        containerStyle={s.inputContainerStyle}
                        style={s.inputText}
                        returnKeyType={'done'}
                        autoCapitalize='none'
                        placeholder='Password'
                        secureTextEntry={true}
                        isIconLeft={true}
                        isIconRight={true}
                        leftIconName={'lock-closed'}
                        rightIconName={'eye'}
                        iconColor={colors.dustRodeo}
                      />
                    </Validation>
                  </FormGroup>
                  <Button
                    ButtonText='Submit'
                    containerStyle={s.submitBtnContainerStyle}
                    style={[s.submitBtn, AppStyles.btnStyle]}
                    animationStyle={s.submitBtn}
                  />
                </>
              )}
            </View>
            <View style={[s.Wrapper, s.WrapperB]}>
              <Touchable style={s.touchableWrapper} onPress={() => openQueue('DeskB')}>
                <TextView color={colors.white} text={'Desk : B'} type={'body-one'} style={s.deskText} />
                <Icon
                  name={`${expand?.DeskB ? 'md-chevron-up' : 'md-chevron-down'}`}
                  color={colors.white}
                  isFeather={false}
                />
              </Touchable>
              {expand?.DeskB && (
                <>
                  <View style={s.topBorder} />
                  <FormGroup style={[s.fromGroup]}>
                    <Validation>
                      <Input
                        wrapperStyle={s.inputWrapperStyle}
                        containerStyle={s.inputContainerStyle}
                        style={s.inputText}
                        returnKeyType={'next'}
                        placeholder='Email Address'
                        isIconLeft={true}
                        leftIconName={'mail'}
                      />
                    </Validation>
                    <Validation>
                      <Input
                        wrapperStyle={s.inputWrapperStyle}
                        containerStyle={s.inputContainerStyle}
                        style={s.inputText}
                        returnKeyType={'done'}
                        autoCapitalize='none'
                        placeholder='Password'
                        secureTextEntry={true}
                        isIconLeft={true}
                        isIconRight={true}
                        leftIconName={'lock-closed'}
                        rightIconName={'eye'}
                        iconColor={colors.dustRodeo}
                      />
                    </Validation>
                  </FormGroup>
                  <Button
                    ButtonText='Submit'
                    containerStyle={s.submitBtnContainerStyle}
                    style={[s.submitBtn, AppStyles.btnStyle]}
                    animationStyle={s.submitBtn}
                  />
                </>
              )}
            </View>
            <View style={[s.Wrapper, s.WrapperB]}>
              <Touchable style={s.touchableWrapper} onPress={() => openQueue('DeskC')}>
                <TextView color={colors.white} text={'Desk : C'} type={'body-one'} style={s.deskText} />
                <Icon
                  name={`${expand?.DeskC ? 'md-chevron-up' : 'md-chevron-down'}`}
                  color={colors.white}
                  isFeather={false}
                />
              </Touchable>
              {expand?.DeskC && (
                <>
                  <View style={s.topBorder} />
                  <FormGroup style={[s.fromGroup]}>
                    <Validation>
                      <Input
                        wrapperStyle={s.inputWrapperStyle}
                        containerStyle={s.inputContainerStyle}
                        style={s.inputText}
                        returnKeyType={'next'}
                        placeholder='Email Address'
                        isIconLeft={true}
                        leftIconName={'mail'}
                      />
                    </Validation>
                    <Validation>
                      <Input
                        wrapperStyle={s.inputWrapperStyle}
                        containerStyle={s.inputContainerStyle}
                        style={s.inputText}
                        returnKeyType={'done'}
                        autoCapitalize='none'
                        placeholder='Password'
                        secureTextEntry={true}
                        isIconLeft={true}
                        isIconRight={true}
                        leftIconName={'lock-closed'}
                        rightIconName={'eye'}
                        iconColor={colors.dustRodeo}
                      />
                    </Validation>
                  </FormGroup>
                  <Button
                    ButtonText='Submit'
                    containerStyle={s.submitBtnContainerStyle}
                    style={[s.submitBtn, AppStyles.btnStyle]}
                    animationStyle={s.submitBtn}
                  />
                </>
              )}
            </View>
          </View>
          <Button
            onPress={onPressStep3}
            ButtonText='Next'
            style={[s.btn, AppStyles.btnStyle]}
            animationStyle={[s.btn, AppStyles.btnStyle]}
            isIconRight={true}
            rightIconName={'arrow-forward'}
          />
        </View>
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};
Step2.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  Wrapper: {
    borderRadius: borderRadius,
    marginTop: verticalScale(30),
    borderWidth: 1,
    borderColor: colors.primary
  },
  WrapperB: {
    marginTop: verticalScale(10)
  },
  touchableWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  touchableHeader: {
    flexDirection: 'row',
    flex: 1
  },
  deskText: {
    flex: 0.9
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginTop: scale(5),
    marginRight: scale(50),
    marginLeft: scale(5)
  },
  fromGroup: {
    marginTop: verticalScale(10)
  },
  inputWrapperStyle: {
    marginHorizontal: scale(15)
  },
  inputContainerStyle: {
    height: verticalScale(40)
  },
  inputText: {
    color: colors.white
  },
  submitBtn: {
    height: verticalScale(40),
    marginBottom: verticalScale(15)
  },
  submitBtnContainerStyle: {
    marginHorizontal: scale(45)
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
export default Step2;
