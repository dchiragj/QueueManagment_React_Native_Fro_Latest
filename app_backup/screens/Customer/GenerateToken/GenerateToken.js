import NavigationOptions from '../../../components/NavigationOptions';
import TextView from '../../../components/TextView/TextView';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import { borderRadius, indent } from '../../../styles/dimensions'
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
// import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../../../assets/svg';
import React, { useState } from 'react';
import Modal from 'react-native-modalbox';
import TokenProblemModal from './TokenProblemModal';
import TokenSummaryModal from './TokenSummaryModal';
import { Button, Touchable } from '../../../components/Button';
import Icon from '../../../components/Icon';
import {ScrollableAvoidKeyboard} from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';

const GenerateToken = () => {
  const [date, setDate] = useState(false);
  const [isProblemModal, setProblemModal] = useState(false);
  const [isTokenSummaryModal, setTokenSummaryModal] = useState(false);
  const changeGender = (date) => {
    setDate(() => {
      return {
        [date]: true
      };
    });
  };
  const openSelectProblemModal = () => {
    setProblemModal(true);
  };
  const closeSelectProblemModal = () => {
    setProblemModal(false);
  };
  const openTokenSummaryModal = () => {
    setTokenSummaryModal(true);
  };
  const closeTokenSummaryModal = () => {
    setTokenSummaryModal(false);
  };
  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <TextView
          text={'Kiran Hospital'}
          type={'title'}
          isTextColorWhite={true}
          style={[AppStyles.titleStyle, s.title]}
        />
        <TextView
          color={colors.white}
          text={'Dr. Chintan B. Patel'}
          type={'body-head'}
          style={[AppStyles.titleStyle]}
        />
        <View style={s.locationMain}>
          <Icon name='location' color={colors.primary} isFeather={false} />
          <TextView
            color={colors.white}
            text={'Vasta Devdi Road, near Sumul Dairy Road, Katargam, Surat, Gujarat 395004'}
            type={'body-one'}
            style={[AppStyles.titleStyle]}
          />
        </View>
        <View style={s.tokenWrapper}>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'98'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {/* <SvgIcon svgs={svgs} name={'bag-loss'} fill={colors.primary} width={20} height={22} style={s.tokenLogo} /> */}
              <TextView color={colors.white} text={'Available Tokens'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'150'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {/* <SvgIcon svgs={svgs} name={'bag-logo'} fill={colors.primary} width={20} height={22} style={s.tokenLogo} /> */}
              <TextView color={colors.white} text={'Total Token'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'52'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {/* <SvgIcon svgs={svgs} name={'bag-plus'} fill={colors.primary} width={20} height={22} style={s.tokenLogo} /> */}
              <TextView color={colors.white} text={'Next Token'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'19'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              <SvgIcon svgs={svgs} name={'bag-true'} fill={colors.primary} width={20} height={22} style={s.tokenLogo} />
              <TextView color={colors.white} text={'Currently Serving'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
        </View>
        <View style={s.topBorder} />
        <TextView color={colors.white} text={'Select A Date'} type={'body'} style={s.dateText} />
        <ScrollView horizontal={true}>
          <View style={s.dateWrapper}>
            <Touchable style={date?.date1 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date1')}>
              <TextView
                color={date?.date1 ? colors.white : colors.primary}
                text={'02 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
            <Touchable style={date?.date2 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date2')}>
              <TextView
                color={date?.date2 ? colors.white : colors.primary}
                text={'03 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
            <Touchable style={date?.date3 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date3')}>
              <TextView
                color={date?.date3 ? colors.white : colors.primary}
                text={'04 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
            <Touchable style={date?.date4 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date4')}>
              <TextView
                color={date?.date4 ? colors.white : colors.primary}
                text={'05 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
            <Touchable style={date?.date5 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date5')}>
              <TextView
                color={date?.date5 ? colors.white : colors.primary}
                text={'06 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
            <Touchable style={date?.date6 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date6')}>
              <TextView
                color={date?.date6 ? colors.white : colors.primary}
                text={'07 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
            <Touchable style={date?.date7 ? s.dateActive : s.dateInActive} onPress={() => changeGender('date7')}>
              <TextView
                color={date?.date7 ? colors.white : colors.primary}
                text={'08 oct'}
                type={'body-one'}
                style={[s.dateScrollTextText]}
              />
            </Touchable>
          </View>
        </ScrollView>
        <View style={s.bottomBorder} />
        <Touchable style={s.problemBtnMain} onPress={openSelectProblemModal}>
          <Icon name='help-circle' color={colors.primary} isFeather={false} style={s.problemLogo} />
          <View style={s.problemBtnView}>
            <TextView
              color={colors.lightWhite}
              text={'Select Problems'}
              type={'body-one'}
              style={[s.dateScrollTextText]}
            />
            <TextView color={colors.white} text={'03'} type={'body-one'} style={[s.dateScrollTextText]} />
          </View>
        </Touchable>

        <Button
          onPress={openTokenSummaryModal}
          isIcon={true}
          iconName={'md-medkit'}
          isFeather={false}
          ButtonText='Generate Token : 52'
          style={s.btn}
          animationStyle={s.btn}
        />
      </ScrollableAvoidKeyboard>
      {/* selectProblemModal */}
      <Modal
        style={[AppStyles.modal, s.modal]}
        isOpen={isProblemModal}
        entry={'bottom'}
        position={'bottom'}
        coverScreen={true}
        backdrop={true}
        swipeToClose={false}
        backdropOpacity={1}
        backdropColor={colors.backdropModalColor}
        onClosed={closeSelectProblemModal}>
        <TokenProblemModal onClosed={closeSelectProblemModal} />
      </Modal>
      {/* TokenSummaryModal */}
      <Modal
        style={AppStyles.modal}
        isOpen={isTokenSummaryModal}
        entry={'bottom'}
        position={'bottom'}
        coverScreen={true}
        backdrop={true}
        swipeToClose={false}
        backdropOpacity={1}
        backdropColor={colors.backdropModalColor}
        onClosed={closeTokenSummaryModal}>
        <TokenSummaryModal onRequestClose={closeTokenSummaryModal} />
      </Modal>
    </SafeAreaView>
  );
};
GenerateToken.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,

    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  title: {
    marginTop: verticalScale(30)
  },
  locationMain: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  tokenWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(15),
    marginTop: verticalScale(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: borderRadius
  },
  tokenTouchable: {
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: scale(borderRadius),
    alignItems: 'center',
    paddingHorizontal: scale(10),
    position: 'relative'
  },
  tokenNumberText: {
    marginTop: verticalScale(30),
    textAlign: 'center'
  },
  tokenLogo: {
    marginRight: scale(5)
  },

  tokenOption: {
    width: '45%',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius
  },
  tokenLogoMain: {
    flexDirection: 'row',
    marginBottom: verticalScale(0),
    marginTop: verticalScale(10)
  },
  tokenText: {
    textAlign: 'center'
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    marginTop: scale(30)
  },
  dateText: {
    marginTop: scale(10),
    textAlign: 'center'
  },
  dateWrapper: {
    marginTop: verticalScale(12),
    flexDirection: 'row',
    paddingVertical: verticalScale(13)
  },
  dateActive: {
    borderWidth: 1,
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(20),
    position: 'relative',
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    marginRight: scale(10)
  },
  dateInActive: {
    borderWidth: 1,
    paddingVertical: verticalScale(3),
    paddingHorizontal: scale(20),
    position: 'relative',
    borderColor: colors.primary,
    marginRight: scale(10)
  },
  dateScrollTextText: {
    textAlignVertical: 'center'
  },
  bottomBorder: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    marginTop: scale(10)
  },
  problemBtnMain: {
    flex: 1,
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(5),
    marginTop: verticalScale(40),
    paddingVertical: verticalScale(15)
  },
  problemLogo: {
    flex: 0.2,
    marginLeft: scale(7)
  },
  problemBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.7
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(130),
    marginBottom: verticalScale(10),
    borderRadius: borderRadius
  },
  modal: {
    position: 'relative'
  }
});
export default GenerateToken;
