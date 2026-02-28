import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native';
import AppStyles from '../../../styles/AppStyles';
import TextView from '../../../components/TextView/TextView';
import { Touchable } from '../../../components/Button';
import Button from '../../../components/Button/Button';
import screens from '../../../constants/screens';
import colors from '../../../styles/colors';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { clearAuthResponseMsg } from '../../../actions/authActions';
import { scale, verticalScale } from 'react-native-size-matters';
import { signup } from '../../../services/authService';
import FormGroup from '../../../components/FormGroup';
import Validation from '../../../components/Validation/Validation';
import Input from '../../../components/Input';
import { halfindent } from '../../../styles/dimensions';
import { borderRadius } from '../../../styles/dimensions';
import messaging from '@react-native-firebase/messaging';

import Toast from 'react-native-toast-message';
import { saveFcmToken } from '../../../services/apiService';

function Signup(props) {
  const [selectRole, setSelectedRole] = useState({
    customer: false,
    merchant: false
  });
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  const { loading, resError = {} } = props.auth;

  useEffect(() => {
    return () => {
      props.clearAuthResponseMsg();
    };
  }, []);

  useEffect(() => {
    if (resError && Object.keys(resError).length > 0) {
      const errorMsg =
        resError.role ||
        resError.firstname ||
        resError.lastname ||
        resError.email ||
        resError.mobileNumber ||
        resError.password ||
        resError.confirmPassword ||
        resError.error ||
        'Please check the form';

      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: errorMsg,
        position: 'top',
        visibilityTime: 4000,
      });
    }
  }, [resError]);

  const onPressSignup = async () => {
    props.clearAuthResponseMsg();

    const role =
      selectRole.customer && selectRole.merchant
        ? 'both'
        : selectRole.customer
          ? 'customer'
          : selectRole.merchant
            ? 'merchant'
            : '';

    if (!role) {
      Toast.show({
        type: 'error',
        text1: 'Role Required',
        text2: 'Please select Customer or Merchant',
      });
      return;
    }

    if (selectRole.merchant) {
      if (!businessName.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Required',
          text2: 'Business Name is required',
        });
        return;
      }
      if (!businessAddress.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Required',
          text2: 'Business Address is required',
        });
        return;
      }
      if (!businessPhone.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Required',
          text2: 'Business Phone is required',
        });
        return;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(businessPhone.trim())) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Phone',
          text2: 'Please enter a valid 10-digit business phone number',
        });
        return;
      }
    }

    // Basic Field Validations
    if (!fname.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'First Name is required' });
      return;
    }
    if (!lname.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Last Name is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Email is required' });
      return;
    } else if (!emailRegex.test(email.trim())) {
      Toast.show({ type: 'error', text1: 'Invalid Email', text2: 'Please enter a valid email address' });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Phone Number is required' });
      return;
    } else if (!phoneRegex.test(phone.trim())) {
      Toast.show({ type: 'error', text1: 'Invalid Phone', text2: 'Please enter a valid 10-digit phone number' });
      return;
    }

    if (!password) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Password is required' });
      return;
    }

    if (!confirmPassword) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Confirm Password is required' });
      return;
    } else if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Passwords do not match' });
      return;
    }

    const signupObj = {
      firstName: fname.trim(),
      lastName: lname.trim(),
      email: email.trim(),
      mobileNumber: phone.trim(),
      password: password,
      confirmPassword: confirmPassword,
      role,
      ...(selectRole.merchant && {
        businessName: businessName.trim(),
        businessAddress: businessAddress.trim(),
        businessRegistrationNumber: businessRegistrationNumber.trim(),
        businessPhone: businessPhone.trim(),
      }),
    };

    const result = await props.signup(signupObj);

    if (result) {
      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Please verify your email',
        position: 'top',
      });
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {

          const fcmToken = await messaging().getToken();

          if (fcmToken) {
            await saveFcmToken(fcmToken);
          } else {

          }
        } else {

        }
      } catch (error) {

      }
      props.navigation.navigate(screens.VerifyEmail);
    }
  };

  const onPressLogin = () => {
    props.navigation.navigate(screens.Login);
  };

  const setUserRole = (name) => {
    if (name === 'customer') {
      setSelectedRole({
        customer: true,
        merchant: false,
      });
    } else if (name === 'merchant') {
      setSelectedRole({
        customer: false,
        merchant: true,
      });
    }
  };
  const onTogglePassword = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <>
      <SafeAreaView style={[AppStyles.root]}>
        <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
          <TextView
            text={'Create new account'}
            type={'title'}
            isTextColorWhite={true}
            style={[AppStyles.titleStyle, AppStyles.title]}
          />
          <TextView
            color={colors.lightWhite}
            text={'Please fill in the form to continue'}
            type={'body-head'}
            style={[AppStyles.titleStyle, AppStyles.subtitle]}
          />

          { }
          { }
          <View style={s.customerMain}>
            <Touchable
              style={[
                s.customermarbtn,
                selectRole.customer && s.selectedBtn,
              ]}
              onPress={() => setUserRole('customer')}
            >
              <TextView color={colors.white} text={'Customer'} type={'body-one'} style={s.customermarText} />
              <Image source={require('../../../assets/images/customer.png')} />
            </Touchable>

            <Touchable
              style={[
                s.customermarbtn,
                selectRole.merchant && s.selectedBtn,
              ]}
              onPress={() => setUserRole('merchant')}
            >
              <TextView color={colors.white} text={'Merchant'} type={'body-one'} style={s.customermarText} />
              <Image source={require('../../../assets/images/merchant.png')} />
            </Touchable>
          </View>

          { }
          <FormGroup style={s.formGroup}>
            <Input
              onChangeText={setFname}
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='First Name'
              isIconLeft={true}
              leftIconName={'create'}
              editable={!loading}
              value={fname}
            />

            <Input
              onChangeText={setLname}
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Last Name'
              isIconLeft={true}
              leftIconName={'create'}
              editable={!loading}
              value={lname}
            />

            <Input
              onChangeText={setEmail}
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Email Address'
              keyboardType="email-address"
              isIconLeft={true}
              leftIconName={'mail'}
              editable={!loading}
              value={email}
            />

            <Input
              onChangeText={setPhone}
              style={s.inputText}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              placeholder='Phone Number'
              isIconLeft={true}
              leftIconName={'call'}
              editable={!loading}
              value={phone}
            />

            <Input
              onPressIcon={onTogglePassword}
              style={s.inputText}
              returnKeyType={'next'}
              autoCapitalize='none'
              placeholder='Password'
              secureTextEntry={!isPasswordVisible}
              isIconLeft={true}
              isIconRight={true}
              leftIconName={'lock-closed'}
              rightIconName={!isPasswordVisible ? 'eye' : 'eye-off'}
              iconColor={colors.dustRodeo}
              onChangeText={setPassword}
              editable={!loading}
              value={password}
            />

            <Input
              onPressIcon={onTogglePassword}
              style={s.inputText}
              returnKeyType={'done'}
              onSubmitEditing={onPressSignup}
              autoCapitalize='none'
              placeholder='Confirm Password'
              secureTextEntry={!isPasswordVisible}
              isIconLeft={true}
              isIconRight={true}
              leftIconName={'lock-closed'}
              rightIconName={!isPasswordVisible ? 'eye' : 'eye-off'}
              iconColor={colors.dustRodeo}
              onChangeText={setConfirmPassword}
              editable={!loading}
              value={confirmPassword}
            />
            { }
            {selectRole.merchant && (
              <>
                <View style={s.sectionHeader}>
                  <TextView
                    text="Business Information"
                    type="body-head"
                    color={colors.lightWhite}
                    style={{ marginTop: verticalScale(20) }}
                  />
                </View>

                <Input
                  onChangeText={setBusinessName}
                  style={s.inputText}
                  returnKeyType={'next'}
                  placeholder='Business Name'
                  isIconLeft={true}
                  leftIconName={'business'}
                  editable={!loading}
                  value={businessName}
                />

                <Input
                  onChangeText={setBusinessAddress}
                  style={s.inputText}
                  returnKeyType={'next'}
                  placeholder='Business Address'
                  isIconLeft={true}
                  leftIconName={'location'}
                  editable={!loading}
                  value={businessAddress}
                />

                <Input
                  onChangeText={setBusinessRegistrationNumber}
                  style={s.inputText}
                  returnKeyType={'next'}
                  placeholder='Business Registration Number'
                  isIconLeft={true}
                  leftIconName={'document-text'}
                  editable={!loading}
                  value={businessRegistrationNumber}
                />

                <Input
                  onChangeText={setBusinessPhone}
                  style={s.inputText}
                  returnKeyType={'done'}
                  onSubmitEditing={onPressSignup}
                  keyboardType="phone-pad"
                  placeholder='Business Phone'
                  isIconLeft={true}
                  leftIconName={'call'}
                  editable={!loading}
                  value={businessPhone}
                />
              </>
            )}
          </FormGroup>

          { }
          <Button
            onPress={onPressSignup}
            isLoading={loading}
            ButtonText='Sign Up'
            style={[s.signBtn, AppStyles.btnStyle]}
            animationStyle={s.signBtn}
          />

          { }
          <View style={s.footerMain}>
            <TextView color={colors.white} text={'Already have an account? '} type={'body-one'} />
            <TextView
              color={colors.primary}
              isClickableLink={true}
              text={'Sign In'}
              type={'body-one'}
              onPress={onPressLogin}
              disabled={loading}
            />
          </View>
        </ScrollableAvoidKeyboard>
      </SafeAreaView>
    </>
  );
}

const s = StyleSheet.create({
  customerMain: {
    marginTop: verticalScale(30),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(13),
  },
  customermarbtn: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: scale(borderRadius),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    position: 'relative',
  },
  selectedBtn: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  customermarText: {
    letterSpacing: 0.5,
    marginBottom: scale(8),
  },
  formGroup: {
    flex: 1,
  },
  inputText: {
    marginLeft: scale(halfindent),
    color: 'white',
  },
  signBtn: {
    marginTop: verticalScale(8),
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(50),
    marginBottom: verticalScale(40),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  clearAuthResponseMsg,
  signup,
})(Signup);