import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppStyles from '../../styles/AppStyles';
import TextView from '../TextView/TextView';

const Validation = ({ children, style, error, disabled = false, ...props }) => {
  return (
    <View style={[style, disabled && s.disabledStyle]} {...props}>
      {children}
      {error && <TextView style={AppStyles.errorMsg} type={'body-one'} text={error} />}
    </View>
  );
};

const s = StyleSheet.create({
  disabledStyle: {
    opacity: 0.5
  }
});
export default Validation;
