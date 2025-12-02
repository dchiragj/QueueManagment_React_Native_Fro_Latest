import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { colors, fontWeights } from '../../styles';
import { halfindent, indent } from '../../styles/dimensions';

export default StyleSheet.create({
  // container: { paddingHorizontal: scale(10), marginTop: scaleVertical(120) },
  // inputLabelStyle: { marginBottom: 5 },
  // inputStyle: { paddingLeft: 12 },
  // input: { marginBottom: 0 },
  // imageStyle: {
  //   resizeMode: 'contain',
  //   flex: 1
  // },
  // backDrop: {
  //   flex: 1,
  //   backgroundColor: colors.black,
  //   opacity: 0.6,
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  //   zIndex: 0
  // },
  // buttonStyle: {
  //   marginTop: scaleVertical(15)
  // },
  // rememberMeWrapper: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-start'
  // },
  // checkBox: {
  //   flex: 1
  // },
  // checkBoxRightTextStyle: {
  //   color: colors.white
  // },
  // menuText: {
  //   position: 'absolute',
  //   top: scaleVertical(100),
  //   right: scale(0),
  //   color: colors.white,
  //   fontWeight: fontWeights.bold,
  //   transform: [{ rotate: '270deg' }]
  // }
  // loginpage
  fromGroup: {
    marginTop: verticalScale(45),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40)
  },
  inputplaceholderText: {
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
