import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import colors from '../../../styles/colors';
import { borderRadius, indent, halfindent } from '../../../styles/dimensions';
import TextView from '../../../components/TextView/TextView';
import Input from '../../../components/Input';
import { Button } from '../../../components/Button';
import Validation from '../../../components/Validation/Validation';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import Toast from 'react-native-toast-message';
import { forgotPassword, verifyOtp, resetPassword } from '../../../services/apiService';

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (step === 1) {
      setEmail('');
      setOtp('');
      setPassword('');
      setConfirmPassword('');
      setUserId('');
    }
  }, [step]);


  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  };


  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email?.trim()) {
      showToast('error', 'Error', 'Please enter your email');
      return;
    } else if (!emailRegex.test(email.trim())) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email.trim());
      if (data?.status === 'ok') {
        showToast('success', 'OTP Sent', 'Check your email for the code');
        setStep(2);
      } else {
        showToast('error', 'Failed', data?.message || 'Unable to send OTP');
      }
    } catch (err) {
      showToast('error', 'Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (!otp?.trim()) {
      showToast('error', 'Error', 'Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      if (data?.status === 'ok') {
        showToast('success', 'Verified', 'OTP verified successfully');
        setUserId(data.userId);
        setStep(3);
      } else {
        showToast('error', 'Invalid OTP', data?.message || 'Please try again');
      }
    } catch (err) {
      showToast('error', 'Error', err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showToast('error', 'Error', 'Please fill both password fields');
      return;
    }
    if (password !== confirmPassword) {
      showToast('error', 'Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(email, password, otp);
      if (data?.status === 'ok') {
        showToast('success', 'Success', 'Password updated successfully');
        navigation.navigate('Login');
      } else {
        showToast('error', 'Failed', data?.message || 'Could not reset password');
      }
    } catch (err) {
      showToast('error', 'Error', err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollableAvoidKeyboard style={styles.container}>
      <TextView
        text="Forgot Password"
        type="title"
        style={styles.title}
        color={colors.white}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        { }
        {step === 1 && (
          <Validation>
            <Input
              style={styles.input}
              keyboardType="email-address"
              placeholder="Enter your email"
              leftIconName="mail"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <Button
              onPress={handleSendOtp}
              ButtonText={loading ? 'Sending...' : 'Send OTP'}
              style={styles.btn}
              isLoading={loading}
            />
          </Validation>
        )}
        { }
        {step === 2 && (
          <Validation>
            <Input
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              editable={!loading}
            />
            <Button
              onPress={handleVerifyOtp}
              ButtonText={loading ? 'Verifying...' : 'Verify OTP'}
              style={styles.btn}
              isLoading={loading}
            />
            <Button
              onPress={() => setStep(1)}
              ButtonText="Back"
              style={[styles.btn, styles.backBtn]}
              disabled={loading}
            />
          </Validation>
        )}
        { }
        {step === 3 && (
          <Validation>
            <Input
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <Input
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
            <Button
              onPress={handleResetPassword}
              ButtonText={loading ? 'Resetting...' : 'Reset Password'}
              style={styles.btn}
              isLoading={loading}
            />
            <Button
              onPress={() => setStep(2)}
              ButtonText="Back"
              style={[styles.btn, styles.backBtn]}
              disabled={loading}
            />
          </Validation>
        )}
      </ScrollView>
    </ScrollableAvoidKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: colors.backgroundColor,
  },
  title: {
    textAlign: 'center',
    paddingTop: 20,
    marginBottom: verticalScale(20),
  },
  input: {
    marginLeft: scale(halfindent),
    color: colors.white,
    marginBottom: verticalScale(10),
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(indent),
    borderRadius: borderRadius,
  },
  backBtn: {
    backgroundColor: colors.gray,
    marginTop: verticalScale(10),
  },
});

export default ForgotPassword;
