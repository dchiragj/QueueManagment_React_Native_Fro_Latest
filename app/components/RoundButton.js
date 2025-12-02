// components/RoundButton.js  અથવા RoundButton.tsx

import React from 'react';
import { Platform, View, TouchableNativeFeedback, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';          // નવું
import Icon from './Icon';
import { colors } from '../styles';

const RoundButton = ({
  style,
  size = 56,
  isFeatherIcon = false,
  icon = 'md-add',
  iconSize = 24,
  iconColor = colors.white,
  ...props
}) => {
  if (Platform.OS === 'android') {
    return (
      <View style={style}>
        <View style={{ borderRadius: size / 2, overflow: 'hidden' }}>
          <TouchableNativeFeedback {...props}>
            <View
              style={[
                s.container,
                {
                  borderRadius: size / 2,
                  width: size,
                  height: size,
                },
              ]}
            >
              <Icon
                isFeather={isFeatherIcon}
                name={icon}
                size={iconSize}
                color={iconColor}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }

  // iOS માટે તમે પછી TouchableOpacity + shadow ઉમેરી શકો છો
  return null;
};

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.theme || '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

// નવા PropTypes – 2025 માં ચાલે છે
RoundButton.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number,
  isFeatherIcon: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
};

RoundButton.defaultProps = {
  size: 56,
  icon: 'md-add',
  iconSize: 24,
  iconColor: colors.white,
};

export default RoundButton;