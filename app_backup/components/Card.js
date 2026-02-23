import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import TextView from './TextView/TextView';
import { colors } from '../styles';
import { indent, borderRadius, lessIndent } from '../styles/dimensions';
import { Touchable } from './Button';
import { verticalScale, scale } from 'react-native-size-matters';

const Card = ({ style, children, title, contentStyle, onPress, ...props }) => (
  <View style={[s.card, style]} {...props}>
    {onPress ? (
      <Touchable onPress={onPress} style={{ borderRadius: borderRadius }}>
        {title ? <TextView text={title} type={'body-one'} style={s.textStyle} /> : null}
        <View style={[s.cardContent, contentStyle]}>{children}</View>
      </Touchable>
    ) : (
      <>
        {title ? <TextView text={title} type={'body-one'} style={s.textStyle} /> : null}
        <View style={[s.cardContent, contentStyle]}>{children}</View>
      </>
    )}
  </View>
);

const s = StyleSheet.create({
  card: {
    borderRadius: borderRadius,
    backgroundColor: colors.inputBackgroundColor,
    borderColor: colors.borderColor,
    ...Platform.select({
      android: {
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
          width: 0,
          height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        overflow: 'hidden'
      },
      ios: {
        shadowColor: '#B3B6CB',
        shadowOffset: {
          width: 0,
          height: 6
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12
      }
    })
  },
  textStyle: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 15,
    color: colors.gray,
    paddingHorizontal: scale(lessIndent + 3),
    paddingTop: verticalScale(indent),
    paddingBottom: verticalScale(2)
  },
  cardContent: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 15
  }
});
export default Card;
