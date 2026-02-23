
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../../styles/colors';
import Icon from '../../Icon';
import Touchable from '../Touchable';

const IconButton = ({
  style,
  wrapperStyle,
  size = 42,
  isFeatherIcon = false,
  icon = 'md-add',
  iconSize = 24,
  iconColor = colors.dustRodeo,
  iconType = 'feather',
  ...props
}) => (
  <View style={style}>
    <View style={[{ borderRadius: size / 2, overflow: 'hidden' }, wrapperStyle]}>
      <Touchable {...props}>
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
            type={iconType}
          />
        </View>
      </Touchable>
    </View>
  </View>
);

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.transparent || 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

IconButton.propTypes = {
  style: PropTypes.object,
  wrapperStyle: PropTypes.object,
  size: PropTypes.number,
  isFeatherIcon: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  iconType: PropTypes.string,
};

IconButton.defaultProps = {
  size: 42,
  icon: 'md-add',
  iconSize: 24,
  iconColor: colors.dustRodeo,
  iconType: 'feather',
};

export default IconButton;