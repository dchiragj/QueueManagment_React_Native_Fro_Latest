import { StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import { colors } from '../../styles';
import { borderWidth, halfindent, indent } from '../../styles/dimensions';

export default StyleSheet.create({
  container: {
    marginTop: verticalScale(indent - 1)
  },
  imageStyle: {
    resizeMode: 'contain',
    flex: 1
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sideBorder: {
    width: '28%',
    borderColor: colors.primary,
    borderWidth: borderWidth
  },
  stampWrap: { flexDirection: 'row', justifyContent: 'space-between' },
  currentTextStyle: {
    marginHorizontal: scale(halfindent + 2),
    color: colors.primary
  },
  starWrapper: {
    borderBottomColor: colors.primary,
    borderBottomWidth: borderWidth,
    paddingVertical: verticalScale(halfindent + 2)
  },
  starStyle: {
    padding: scale(indent + halfindent),
    margin: scale(5)
  },
  contentWrap: {
    marginVertical: verticalScale(halfindent + 2)
  },
  contentTextStyle: {
    marginVertical: verticalScale(5),
    color: colors.white
  },
  buttonStyle: {
    backgroundColor: colors.white
  },
  buttonTextStyle: {
    color: colors.blue
  },
  stampsDisplayWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(indent * 2 - 2)
  },
  stampTextStyle: {
    marginTop: verticalScale(indent - 1)
  },
  scanQRView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center'
  },
  scanQRTextStyle: {
    textAlign: 'center'
  }
});
