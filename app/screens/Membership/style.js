import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { colors, fontWeights } from '../../styles';
import { halfindent, indent } from '../../styles/dimensions';

export default StyleSheet.create({
  formGroup: {
    marginTop: verticalScale(45),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40)
  },
  inputPlaceholderText: {
    marginLeft: scale(halfindent),
    color: 'white'
  },
  forgotPasswordLink: {
    marginTop: verticalScale(15),
    textAlign: 'right'
  },
  signBtn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(indent),
    borderRadius: borderRadius
  },
  secondaryBtn: {
    backgroundColor: colors.backgroundColor,
    marginHorizontal: scale(30),
    borderRadius: borderRadius,
    borderWidth: 1,
    borderColor: colors.primary
  },
  googleBtn: {
    marginTop: verticalScale(15)
  },
  fbBtn: {
    marginTop: verticalScale(10)
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(indent + 50),
    marginBottom: verticalScale(8)
  }
});
