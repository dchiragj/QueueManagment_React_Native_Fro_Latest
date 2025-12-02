import { StyleSheet } from 'react-native';
import colors from './colors';
import { indent, halfindent, borderWidth, lessIndent, borderRadius } from './dimensions';
import Typography from './Typography';
import fontWeights from './fontWeights';
import { WIN_HEIGHT } from '../constants/constant';
import { verticalScale, scale } from 'react-native-size-matters';

const AppStyles = StyleSheet.create({
  rootStyle: {
    flex: 1
  },
  root: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingTop: indent,
    paddingHorizontal: indent
  },
  rootWithoutPadding: {
    paddingTop: 0,
    paddingHorizontal: 0
  },
  title: {
    marginTop: verticalScale(60)
  },
  subtitle: {
    marginTop: verticalScale(10)
  },
  btnStyle: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    borderRadius: borderRadius
  },
  primaryDarkenBg: {
    backgroundColor: colors.primaryDarken
  },
  url: {
    color: colors.primary,
    textDecorationLine: 'underline'
  },
  containerStyle: {
    flex: 1
  },
  containerView: {
    paddingVertical: indent,
    paddingHorizontal: indent
  },
  horizontalSpace: {
    marginHorizontal: indent,
    position: 'relative'
  },

  // Membership Style
  bgColorWhite: {
    backgroundColor: colors.white
  },
  membershipContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: indent
  },
  membershipHead: {
    alignItems: 'center'
  },
  membershipText: {
    color: colors.black,
    marginBottom: scale(8)
  },
  membershipTextWrap: {
    paddingTop: verticalScale(20),
    textAlign: 'center'
  },
  formContainer: {
    marginBottom: verticalScale(14)
    // height: "auto",
    // borderWidth: 0,
  },
  bottomOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(0)
  },
  membershipFootText: {
    color: colors.dustRodeo
  },
  linkBtnStyleText: {
    ...Typography.bodyOne,
    fontWeight: fontWeights.extraBold,
    color: colors.primary
  },
  errorMsg: {
    ...Typography.bodyTwo,
    color: colors.error
  },
  successMsg: {
    ...Typography.bodyTwo,
    color: colors.success,
    marginTop: halfindent,
    textAlign: 'center',
    justifyContent: 'center'
  },
  // Header Style
  headerStyle: {
    backgroundColor: colors.white,
    borderBottomWidth: borderWidth,
    borderBottomColor: colors.borderColor
  },
  headerTitleStyle: {
    ...Typography.headline,
    fontWeight: fontWeights.extraBold,
    color: colors.black
  },
  pTopIndent: {
    paddingTop: verticalScale(indent)
  },
  paddingVindent: {
    paddingVertical: verticalScale(indent + 8)
  },
  flexBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  flexCenter: {
    textAlign: 'center',
    flex: 1
  },
  headerButtonCover: {
    marginRight: 4,
    borderRadius: 12,
    overflow: 'hidden'
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.transparent,
    paddingVertical: scale(halfindent - 2),
    paddingHorizontal: scale(lessIndent)
  },
  headerButtonText: {
    ...Typography.caption,
    fontWeight: fontWeights.extraBold,
    color: colors.primary,
    marginRight: halfindent
  },
  headerButtonIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingTop: 2
  },
  footerWrapper: {
    paddingHorizontal: scale(6),
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: verticalScale(12),
    shadowColor: colors.borderColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 24,
    borderWidth: borderWidth,
    borderColor: colors.borderColorOpacity,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius
  },
  diablePrimaryButton: {
    backgroundColor: colors.disableColor,
    color: colors.borderColor
  },
  buttonStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    marginHorizontal: scale(6),
    paddingVertical: verticalScale(14)
  },
  headingStyle: {
    // fontFamily: 'CircularStd-Bold',
    textAlign: 'center'
  },
  titleStyle: {
    marginBottom: indent,
    textAlign: 'center'
  },
  subtitleStyle: {
    textAlign: 'center'
  },
  linkButtonContainerStyle: {
    paddingVertical: indent - 2
  },
  linkButtonStyle: {
    backgroundColor: colors.transparent,
    height: 'auto',
    paddingHorizontal: indent,
    paddingVertical: halfindent
  },
  linkTextStyle: {
    paddingVertical: indent,
    color: colors.primary
  },
  disabledLinkStyle: {
    backgroundColor: colors.transparent
  },
  linkBtnTextStyle: {
    color: colors.primary,
    paddingVertical: 0,
    textDecorationLine: 'underline',
    marginBottom: indent * 2 - 2
  },
  iconStyle: {
    // marginTop: scaleVertical(40),
    // marginBottom: scaleVertical(20),
  },
  // --- Session Style
  modal: {
    backgroundColor: colors.transparent
  },
  // modalWrapper: {
  //   height: '60%',
  //   borderTopLeftRadius: borderRadius + 25,
  //   borderTopRightRadius: borderRadius + 25
  // },
  modalBorder: {
    height: 5,
    width: 60,
    borderRadius: 25,
    marginTop: verticalScale(-15),
    borderColor: colors.white,
    backgroundColor: colors.white,
    alignSelf: 'center',
    position: 'relative'
  },
  modalWrapper: {
    marginTop: 'auto',
    backgroundColor: colors.transparent
  },
  keybordWrapper: {
    flex: 1
  },
  modalBox: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius + 25,
    borderTopRightRadius: borderRadius + 25,
    maxHeight: WIN_HEIGHT - verticalScale(105)
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: indent,
    paddingVertical: indent + 4
  },
  modalTitle: {
    textAlign: 'left',
    color: colors.black,
    lineHeight: 24
  },
  countDownText: {
    alignContent: 'center',
    color: colors.black,
    // fontFamily: 'CircularStd-Bold',
    ...Typography.header
  },
  modalBody: {
    paddingHorizontal: indent,
    paddingBottom: indent,
    position: 'relative'
  },
  rectView: {
    width: 50,
    height: 5,
    alignSelf: 'center',
    backgroundColor: colors.white,
    opacity: 0.8,
    borderRadius: 25,
    marginBottom: verticalScale(8)
  },
  svgIconStyle: {
    borderRadius: 50
  }
});

export default AppStyles;
