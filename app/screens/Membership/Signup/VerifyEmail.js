import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../../../components/Input';
import screens from '../../../constants/screens';
import { borderRadius } from '../../../styles/dimensions';
import TextView from '../../../components/TextView/TextView';
import { SafeAreaView } from 'react-native';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import AppStyles from '../../../styles/AppStyles';
import { scale, verticalScale } from 'react-native-size-matters';
import colors from '../../../styles/colors';
import Button from '../../../components/Button/Button';
import { connect } from 'react-redux';
import { verificationCode, verifyEmail } from '../../../services/authService';
import Validation from './../../../components/Validation/Validation';
import { logout } from '../../../services/authService';
import { getAuthUser, saveAuthUser } from '../../../utils/localStorageHelpers';
import { clearAuthResponseMsg, setCurrentUser } from '../../../actions/authActions';
import Toast from 'react-native-toast-message';

const VerifyEmail = (props) => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);

  const { loading, resError = {}, user } = props.auth;

  const startTimer = () => {
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      props.clearAuthResponseMsg();
    };
  }, []);

  const onPressVerifyEmail = async () => {
    let screen;
    const result = await props.verifyEmail(code);

    if (result) {
      const userDetails = await getAuthUser();
      delete userDetails.verificationRequired;
      await saveAuthUser(userDetails);
      if (userDetails.onboardingRequired) {
        screen = screens.Onboarding;
      } else {
        screen = screens.HomeRoot;
      }
      props.navigation.navigate(screen, { source: screens.VerifyEmail });
    }
  };

  const onPressResendCodeHandler = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    const result = await props.verificationCode();
    setIsResending(false);

    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Code Sent',
        text2: 'A new verification code has been sent to your email.',
      });
      startTimer();
    }
  };

  const onPressChangeEmail = async () => {
    await props.logout();
    props.navigation.navigate(screens.Signup);
  };
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView
          text={'Verify Your Email'}
          type={'title'}
          isTextColorWhite={true}
          style={[AppStyles.titleStyle, s.title]}
        />
        <TextView
          color={colors.lightWhite}
          text={'please enter the 6 digit code sent to your email address '}
          type={'body-head'}
          style={[AppStyles.titleStyle, s.subtitle]}
        />
        <TextView
          color={colors.white}
          text={user.email}
          type={'body-head'}
          style={[AppStyles.titleStyle, s.emailText]}
        />
        <View style={s.inputTextMain}>
          <Validation error={resError.code || resError.error}>
            <Input
              style={s.inputText}
              onChangeText={setCode}
              placeholder='Enter code Here'
              keyboardType={'numeric'}
              secureTextEntry={true}
              value={code}
            />
          </Validation>
        </View>
        <View style={s.resendContainer}>
          {timer > 0 ? (
            <TextView
              color={colors.lightWhite}
              text={`Resend Code in ${timer}s`}
              type={'body-head'}
              style={[AppStyles.titleStyle, s.resetOtp]}
            />
          ) : (
            <TextView
              color={isResending ? colors.lightWhite : colors.primary}
              text={isResending ? 'Sending...' : 'Resend Code'}
              type={'body-head'}
              style={[AppStyles.titleStyle, s.resetOtp]}
              onPress={onPressResendCodeHandler}
            />
          )}
        </View>
        <Button
          onPress={onPressVerifyEmail}
          ButtonText='Verify & Continue'
          style={s.btn}
          animationStyle={s.btn}
          disabled={!code}
          isLoading={loading}
        />
        <View style={s.footerMain}>
          <TextView
            color={colors.primary}
            isClickableLink={true}
            text={'Change Email Address'}
            type={'body-one'}
            onPress={onPressChangeEmail}
          />
        </View>
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};
const s = StyleSheet.create({
  title: {
    marginTop: verticalScale(60)
  },
  subtitle: {
    marginTop: verticalScale(10)
  },
  emailText: {
    marginTop: verticalScale(25),
    letterSpacing: 1
  },
  inputTextMain: {
    marginTop: verticalScale(35)
  },
  inputText: {
    textAlign: 'center',
    color: colors.white
  },
  resetOtp: {
    marginTop: verticalScale(15)
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(30),
    borderRadius: borderRadius
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(40),
    marginBottom: verticalScale(8)
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps, {
  verificationCode,
  logout,
  verifyEmail,
  setCurrentUser,
  clearAuthResponseMsg
})(VerifyEmail);
