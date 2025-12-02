import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { IconButton, Touchable } from './Button';
import Icon from './Icon';
import RoundButton from './RoundButton';

const HeaderButton = ({
  type, //here type 1=Button and type 2=View
  color,
  iconName,
  style,
  isFeather = true,
  iconType = 'feather',
  ...props
}) => {
  if (type == 1) {
    return Platform.OS == 'ios' ? (
      <Touchable style={[s.wrapper, style]} {...props}>
        <Icon isFeather={isFeather} name={iconName} color={color} />
      </Touchable>
    ) : (
      <IconButton
        style={[s.wrapper, style]}
        isFeatherIcon={isFeather}
        icon={iconName}
        iconColor={color}
        iconType={iconType}
        {...props}
        size={50}
      />
    );
  } else if (type == 2) {
    return (
      <View style={[s.wrapper, style]} {...props}>
        <Icon isFeather={isFeather} name={iconName} color={color} />
      </View>
    );
  } else {
    return null;
  }
};
const s = StyleSheet.create({
  wrapper: {
    padding: 2,
    marginHorizontal: 10
  }
});
export default HeaderButton;
