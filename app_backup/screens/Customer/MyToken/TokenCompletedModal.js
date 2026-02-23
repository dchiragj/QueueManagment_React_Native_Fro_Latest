import Icon from '../../../components/Icon';
import TextView from '../../../components/TextView/TextView';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import { borderRadius } from '../../../styles/dimensions';
import React from 'react';
import { View, Text, StatusBar, ScrollView, StyleSheet, Image } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';

const TokenCompletedModal = (props) => {
  const { onClosed } = props;
  return (
    <>
      <StatusBar backgroundColor={colors.backdropModalColor} />
      <Text style={s.closeModal} onPress={onClosed} />
      <View style={AppStyles.modalWrapper}>
        <View style={AppStyles.rectView}></View>
        <View style={AppStyles.modalBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={AppStyles.modalHeader}>
              <TextView color={colors.inputBackgroundColor} text={'Token Completed'} type={'head-line'} />
            </View>
            <View style={s.modalWrapper}>
              <Image style={s.img} source={require('../../../assets/images/TokenCompletedModalimg.png')} />
              <View>
                <TextView
                  color={colors.inputBackgroundColor}
                  text={'Great! NAME Everything Is Ready'}
                  type={'body'}
                  style={[s.modalText, s.titleText]}
                />
                <TextView color={colors.primary} text={'52'} type={'header'} style={s.modalText} />
                <TextView
                  color={colors.inputBackgroundColor}
                  text={'Kiran Hospital'}
                  type={'body'}
                  style={s.modalText}
                />
                <TextView
                  color={colors.inputBackgroundColor}
                  text={'02 Oct 2021 - 11:28 AM '}
                  type={'body'}
                  style={s.modalText}
                />
              </View>
              <View style={s.starWrapper}>
                <Icon name='md-star' color={colors.primary} isFeather={false} style={s.starStyle} />
                <Icon name='md-star' color={colors.primary} isFeather={false} style={s.starStyle} />
                <Icon name='md-star' color={colors.primary} isFeather={false} style={s.starStyle} />
                <Icon name='star-outline' color={colors.primary} isFeather={false} style={s.starStyle} />
                <Icon name='star-outline' color={colors.primary} isFeather={false} style={s.starStyle} />
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
  img: {
    alignSelf: 'center'
  },
  titleText: {
    marginHorizontal: scale(75)
  },
  modalText: {
    marginTop: verticalScale(5),
    textAlign: 'center'
  },
  starWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: verticalScale(20)
  },
  starStyle: {
    paddingHorizontal: scale(10)
  }
});
export default TokenCompletedModal;
