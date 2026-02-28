import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../../../styles/AppStyles';
import TextView from '../../../components/TextView/TextView';
import Button from '../../../components/Button/Button';
import screens from '../../../constants/screens';
import colors from '../../../styles/colors';
import Validation from '../../../components/Validation/Validation';
import FormGroup from '../../../components/FormGroup';
import { scale, verticalScale } from 'react-native-size-matters';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { borderRadius, halfindent, indent } from '../../../styles/dimensions';
import { getAuthUser } from '../../../utils/localStorageHelpers';
import { clearAuthResponseMsg } from '../../../actions/authActions';
import { login } from '../../../services/authService';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { saveFcmToken } from '../../../services/apiService';
import messaging from '@react-native-firebase/messaging';
import { useBranch } from '../../../context/BranchContext';


const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { setToken } = useBranch();
  const { loading, resError = {} } = props.auth;


  useEffect(() => {
    return () => props.clearAuthResponseMsg();
  }, []);

  useEffect(() => {
    if (resError && Object.keys(resError).length > 0) {
      const errorMessage = resError.error || resError.username || resError.password || 'Login failed';
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }, [resError]);

  const onLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Email is required' });
      return;
    } else if (!emailRegex.test(email.trim())) {
      Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email address' });
      return;
    }

    if (!password.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Password is required' });
      return;
    }

    const loginObj = {
      username: email.trim(),
      password: password.trim(),
      role: 'merchant'
    };

    const result = await props.login(loginObj);
    console.log(result, "result");


    if (result) {

      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Login successful',
        position: 'top',
      });

      const user = await getAuthUser();
      if (user?.token) {
        setToken(user.token);
      }


      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();

          if (fcmToken) {
            await saveFcmToken(fcmToken);
          }
        } else {

        }
      } catch (error) {

      }

      props.navigation.navigate("MainApp");
    }
  };

  const onTogglePassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const onPressSignup = () => {
    props.navigation.navigate(screens.Signup);
  };

  const onPressForgotPassword = () => {
    props.navigation.navigate(screens.ForgotPassword);
  };

  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TextView text="Welcome Back!" type="title" isTextColorWhite={true} style={[AppStyles.titleStyle, AppStyles.title]} />
        <TextView color={colors.lightWhite} text="Please sign in to your account" type="body-head" style={[AppStyles.titleStyle, AppStyles.subtitle]} />

        <FormGroup style={[AppStyles.formContainer, s.formGroup]}>

          { }
          { }
          <View style={s.inputContainer}>
            <Ionicons name="mail" size={24} color={colors.primary} style={s.iconLeft} />
            <TextInput
              style={s.textInput}
              placeholder="example@gmail.com"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              autoCapitalize="none"
            />
          </View>

          { }
          { }
          <View style={s.inputContainer}>
            <Ionicons name="lock-closed" size={24} color={colors.primary} style={s.iconLeft} />
            <TextInput
              style={s.textInput}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              onSubmitEditing={onLogin}
            />
            <TouchableOpacity onPress={onTogglePassword}>
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color={colors.primary}
                style={s.iconRight}
              />
            </TouchableOpacity>
          </View>

          <TextView
            color={colors.lightWhite}
            isClickableLink={true}
            text="Forgot Password?"
            onPress={onPressForgotPassword}
            type="body-one"
            style={s.forgotPasswordLink}
            disabled={loading}
          />
        </FormGroup>

        <Button
          onPress={onLogin}
          ButtonText="Sign In"
          style={s.signBtn}
          isLoading={loading}
        />

        <View style={s.footerMain}>
          <TextView color={colors.white} text="Don't have an Account? " type="body-one" />
          <TextView
            color={colors.primary}
            isClickableLink={true}
            text="Sign Up"
            type="body-one"
            onPress={onPressSignup}
            disabled={loading}
          />
        </View>
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  formGroup: {
    marginTop: verticalScale(45),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    marginBottom: verticalScale(15),
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  forgotPasswordLink: {
    marginTop: verticalScale(15),
    textAlign: 'right',
  },
  signBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(indent),
    borderRadius: borderRadius,
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(8),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  clearAuthResponseMsg,
  login,
})(Login);