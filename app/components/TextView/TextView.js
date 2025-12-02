import React from 'react';
import { Text, StyleSheet, Linking } from 'react-native';
import { colors } from '../../styles';
import Typography from '../../styles/Typography';
import AppStyles from '../../styles/AppStyles';
import ParsedText from './ParsedText';

const TextView = ({
  style,
  text,
  type,
  color,
  isTextColorWhite = false,
  isClickableLink = false,
  isUpperCaseText = false,
  ...props
}) => {
  let textStyle = [style];
  let textValue = text;
  if (type === 'header') {
    textStyle.push(s.header);
  } else if (type === 'title') {
    textStyle.push(s.title);
  } else if (type === 'sub-title') {
    textStyle.push(s.subTitle);
  } else if (type === 'head-line') {
    textStyle.push(s.headLine);
  } else if (type === 'body-head') {
    textStyle.push(s.bodyHead);
  } else if (type === 'body') {
    textStyle.push(s.body);
  } else if (type === 'body-one') {
    textStyle.push(s.bodyOne);
  } else if (type === 'body-two') {
    textStyle.push(s.bodyTwo);
  } else if (type === 'caption') {
    textStyle.push(s.caption);
  } else if (type === 'button-text') {
    textStyle.push(s.buttonText);
  } else if (type === 'number-text') {
    textStyle.push(s.numberText);
  }

  onUrlClick = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Don't know how to open URI");
      }
    });
  };

  return isClickableLink ? (
    <ParsedText
      style={[
        textStyle,
        color ? { color: color } : undefined,
        isTextColorWhite ? { color: colors.white } : undefined,
        isUpperCaseText ? { textTransform: 'uppercase' } : undefined,
        style
      ]}
      {...props}
      parse={[{ type: 'url', style: AppStyles.url, onPress: props.onUrlClick }]}
      childrenProps={{ allowFontScaling: false }}>
      {textValue}
    </ParsedText>
  ) : (
    <Text
      style={[
        textStyle,
        color ? { color: color } : undefined,
        isTextColorWhite ? { color: colors.white } : {},
        isUpperCaseText ? { textTransform: 'uppercase' } : {},
        style
      ]}
      {...props}>
      {textValue}
    </Text>
  );
};
const s = StyleSheet.create({
  header: {
    ...Typography.header
  },
  title: {
    ...Typography.title
  },
  subTitle: {
    ...Typography.subTitle
  },
  headLine: {
    ...Typography.headline
  },
  bodyHead: {
    ...Typography.bodyHead
  },
  body: {
    ...Typography.body
  },
  bodyOne: {
    ...Typography.bodyOne
  },
  bodyTwo: {
    ...Typography.bodyTwo
  },
  caption: {
    ...Typography.caption
  },
  buttonText: {
    ...Typography.body
    // fontFamily: 'GothamBold'
  },
  numberText: {
    fontFamily: 'GothamBooks',
    ...Typography.body
  }
});
export default TextView;
