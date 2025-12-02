// components/CheckBox.js  અથવા CheckBox.tsx

import React from 'react';
import ReactCheckbox from 'react-native-check-box';
import PropTypes from 'prop-types';           // આ નવું છે
import { StyleProp, ViewStyle } from 'react-native';  // આ નવું છે
import { colors } from '../styles';
import Icon from './Icon';

const CheckBox = ({ 
  onClick, 
  isChecked, 
  leftView, 
  leftText, 
  style, 
  rightText, 
  ...props 
}) => (
  <ReactCheckbox
    onClick={onClick}
    isChecked={isChecked}
    leftTextView={leftView}
    leftText={leftText}
    rightText={rightText}
    style={style}
    checkedImage={<Icon name="checkbox-outline" color={colors.primary} isFeather={false} />}
    unCheckedImage={<Icon name="square-outline" color={colors.primary} isFeather={false} />}
    {...props}
  />
);

// નવા PropTypes – 2025 style
CheckBox.propTypes = {
  onClick: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  leftView: PropTypes.element,
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

// TypeScript માટે (જો તમે .tsx કરો તો)
CheckBox.defaultProps = {
  leftView: null,
  leftText: '',
  rightText: '',
  style: {},
};

export default CheckBox;