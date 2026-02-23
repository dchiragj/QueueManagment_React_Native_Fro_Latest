import { View, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Touchable } from '../../../components/Button';
import NavigationOptions from '../../../components/NavigationOptions';
import HeaderButton from '../../../components/HeaderButton';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import TextView from '../../../components/TextView/TextView';
import Icon from '../../../components/Icon';
import { verticalScale, scale } from 'react-native-size-matters';
import { borderRadius } from '../../../styles/dimensions';
import svgs from '../../../assets/svg';
import Modal from 'react-native-modalbox';
import React, { useState } from 'react';
import TokenCompletedModal from './TokenCompletedModal';
const MyTokenDetails = () => {
  const [isTokenCompletedModal, setTokenCompletedModal] = useState(false);
  const openTokenCompletedModal = () => {
    setTokenCompletedModal(true);
  };
  const closeTokenCompletedModal = () => {
    setTokenCompletedModal(false);
  };
  return (
    <SafeAreaView style={AppStyles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextView color={colors.white} text={'HOSPITAL QUEUE'} type={'body-one'} style={s.headerTitle} />
        <Image style={s.Image} source={require('../../../assets/images/completedToken.png')} />
        <TextView color={colors.primary} text={'Kiran Hospital'} type={'head-line'} style={s.title} />
        <TextView color={colors.white} text={'Dr. Chintan B. Patel'} type={'body-one'} style={s.subTitle} />
        <TextView color={colors.lightWhite} text={'(General Surgery)'} type={'body-one'} style={s.subTitle} />
        <View style={s.locationTextWrapper}>
          <Icon name='location' color={colors.primary} isFeather={false} />
          <TextView
            color={colors.lightWhite}
            text={'Vasta Devdi Road, near Sumul Dairy Road, Katargam, Surat, Gujarat 395004'}
            type={'body-one'}
            style={[AppStyles.titleStyle]}
          />
        </View>
        <View style={[s.locationTextWrapper, s.dateWrapper]}>
          <Icon name='calendar' color={colors.primary} isFeather={false} />
          <View style={s.dateSecondWrapper}>
            <TextView color={colors.white} text={'Selected Date : '} type={'body-one'} />
            <TextView color={colors.lightWhite} text={' Mon 02 oct 2021'} type={'body-one'} />
          </View>
        </View>
        <View style={[s.deskWrapper]}>
          <Icon name='desktop' color={colors.primary} isFeather={false} />
          <View style={s.dateSecondWrapper}>
            <TextView color={colors.white} text={'Desk No : '} type={'body-one'} />
            <TextView color={colors.lightWhite} text={' A'} type={'body-one'} />
          </View>
        </View>
        <View style={s.tokenWrapper}>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'52'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {}
              <TextView color={colors.lightWhite} text={'My Token'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'19'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {}
              <TextView color={colors.lightWhite} text={'Currently Serving'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
        </View>
        <Touchable style={s.timeWrapper} onPress={openTokenCompletedModal}>
          <TextView color={colors.primary} text={'17 : 30 : 56'} type={'header'} style={s.tokenText} />
          <View style={s.timeTextWrapper}>
            {}
            <TextView color={colors.lightWhite} text={'Expected Time'} type={'body-one'} />
          </View>
        </Touchable>
        <View style={[s.tokenSecondWrapper]}>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'150'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {}
              <TextView color={colors.lightWhite} text={'Total Token'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
          <Touchable style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text={'98'} type={'header'} color={colors.white} />
            <View style={s.tokenLogoMain}>
              {}
              <TextView color={colors.lightWhite} text={'Available Tokens'} type={'body-one'} style={s.tokenText} />
            </View>
          </Touchable>
        </View>
      </ScrollView>
      <Modal
        style={[AppStyles.modal, s.modal]}
        isOpen={isTokenCompletedModal}
        entry={'bottom'}
        position={'bottom'}
        coverScreen={true}
        backdrop={true}
        swipeToClose={false}
        backdropOpacity={1}
        backdropColor={colors.backdropModalColor}
        onClosed={closeTokenCompletedModal}>
        <TokenCompletedModal onClosed={closeTokenCompletedModal} />
      </Modal>
    </SafeAreaView>
  );
};
MyTokenDetails.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerRight: (
      <HeaderButton
        type={1}
        iconName={'trash'}
        iconType={'ionic'}
        color={colors.primary}
        isFeather={false}
        onPress={() => {}}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  headerTitle: {
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
    marginHorizontal: scale(80),
    textAlign: 'center',
    borderRadius: borderRadius,
    backgroundColor: colors.inputBackgroundColor
  },
  Image: {
    marginTop: verticalScale(30),
    alignSelf: 'center'
  },
  title: {
    marginTop: verticalScale(30),
    textAlign: 'center'
  },
  subTitle: {
    marginTop: verticalScale(20),
    textAlign: 'center'
  },
  locationTextWrapper: {
    flexDirection: 'row',
    marginTop: verticalScale(20),
    alignSelf: 'center'
  },
  dateWrapper: {
    marginTop: verticalScale(20)
  },
  dateSecondWrapper: {
    flexDirection: 'row',
    marginLeft: scale(5)
  },
  deskWrapper: {
    flexDirection: 'row',
    marginLeft: scale(36),
    marginTop: verticalScale(10)
  },
  tokenWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
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
  timeWrapper: {
    backgroundColor: colors.inputBackgroundColor,
    marginTop: verticalScale(10),
    marginHorizontal: scale(15),
    paddingVertical: verticalScale(25),
    borderRadius: borderRadius
  },
  timeTextWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginBottom: verticalScale(0),
    marginTop: verticalScale(10)
  },
  tokenSecondWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: verticalScale(30),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: borderRadius
  }
});
export default MyTokenDetails;
