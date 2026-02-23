import { Button } from '../../../components/Button';
import TextView from '../../../components/TextView/TextView';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import { borderRadius } from '../../../styles/dimensions';
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { verticalScale, scale } from 'react-native-size-matters';

const TokenSummaryModal = (props) => {
  const { onRequestClose } = props;
  return (
    <>
      <StatusBar backgroundColor={colors.backdropModalColor} />
      <Text style={s.closeModal} onPress={onRequestClose} />
      <View style={AppStyles.modalWrapper}>
        <View style={AppStyles.rectView}></View>
        <View style={AppStyles.modalBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={AppStyles.modalHeader}>
              <TextView
                color={colors.inputBackgroundColor}
                text={'Token Summary'}
                type={'head-line'}
                style={s.btnModalText}
              />
            </View>
            <View style={s.modalWrapper}>
              <Image style={s.img} source={require('../../../assets/images/voucher.png')} />

              <TextView
                color={colors.inputBackgroundColor}
                text={'Token Generation Confirmed'}
                type={'body'}
                style={s.modalTextTitle}
              />
              <TextView color={colors.primary} text={'52'} type={'title'} style={s.modalTextTitle} />
              <TextView color={colors.inputBackgroundColor} text={'Kiran Hospital'} type={'body'} style={s.modalText} />
              <TextView
                color={colors.inputBackgroundColor}
                text={'02 Oct 2021 - 11:28 AM '}
                type={'body'}
                style={s.modalTextTime}
              />
              <View style={s.btnWrapper}>
                <Button ButtonText='Download' style={s.btn} animationStyle={s.btn} />
                <Button ButtonText='Share' style={s.btnShare} animationStyle={s.btn} />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};
const s = StyleSheet.create({
  closeModal: {
    flex: 1
  },
  modalWrapper: {
    borderWidth: 2,
    borderRadius: borderRadius,
    borderColor: colors.primary,
    marginHorizontal: scale(15),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10)
  },
  btnModalText: {
    textAlign: 'center',
    marginTop: verticalScale(10)
  },
  img: {
    marginTop: verticalScale(20),
    alignSelf: 'center'
  },
  modalTextTitle: {
    marginTop: verticalScale(20),
    textAlign: 'center'
  },
  modalText: {
    marginTop: verticalScale(3),
    textAlign: 'center'
  },
  modalTextTime: {
    textAlign: 'center'
  },
  btnWrapper: {
    flexDirection: 'row',
    marginTop: verticalScale(25),
    marginHorizontal: scale(10),
    marginBottom: verticalScale(15),
    justifyContent: 'space-around'
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius,
    paddingHorizontal: scale(20)
  },
  btnShare: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius,
    paddingHorizontal: scale(35)
  }
});
export default TokenSummaryModal;
