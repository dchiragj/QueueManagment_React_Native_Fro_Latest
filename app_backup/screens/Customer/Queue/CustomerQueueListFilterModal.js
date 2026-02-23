import React from 'react';
import Input from '../../../components/Input';
import TextView from '../../../components/TextView/TextView';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import { borderRadius } from '../../../styles/dimensions';
import { View, Text, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const CustomerQueueListFilterModal = (props) => {
  const { onClosed } = props;
  return (
    <>
      <StatusBar backgroundColor={colors.backdropModalColor} />
      <Text style={s.closeModal} onPress={onClosed} />
      <View style={AppStyles.modalWrapper}>
        <View style={AppStyles.rectView}></View>
        <View style={AppStyles.modalBox}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
            <View style={s.modalHeader}>
              <TextView isClickableLink={true} color={colors.primary} text={'Reset'} type={'head-line'} />
              <TextView color={colors.inputBackgroundColor} text={'Filters'} type={'head-line'} />
              <TextView
                onPress={onClosed}
                isClickableLink={true}
                color={colors.primary}
                text={'Done'}
                type={'head-line'}
              />
            </View>
            <View style={s.inputWrapper}>
              <Input returnKeyType={'next'} placeholder='Select By City' style={s.inputPlaceholder} />
              <Input returnKeyType={'next'} placeholder='Select By Name' style={s.inputPlaceholder} />
            </View>
            <View style={s.locationWrapper}>
              <TextView
                color={colors.inputBackgroundColor}
                text={'Near By Location'}
                type={'body-one'}
                style={s.locationText}
              />
              <View style={s.kmWrapper}>
                <TextView
                  color={colors.inputBackgroundColor}
                  text={'Around Radius In'}
                  type={'body-one'}
                  style={s.kmTextFirst}
                />
                <Input
                  returnKeyType={'next'}
                  placeholder='0'
                  style={s.kmInputStyle}
                  wrapperStyle={s.kmInputWrapperStyle}
                />
                <TextView color={colors.inputBackgroundColor} text={'KM'} type={'body-one'} style={s.kmTextSecond} />
              </View>
            </View>
            <View style={[s.locationWrapper, s.dateWrapper]}>
              <TextView
                color={colors.inputBackgroundColor}
                text={'Date Range'}
                type={'body-one'}
                style={s.locationText}
              />
              <Input
                returnKeyType={'next'}
                placeholder='Start Date'
                style={s.dateInputPlaceholder}
                wrapperStyle={s.dateInput}
              />
              <TextView color={colors.inputBackgroundColor} text={'To'} type={'body-one'} style={s.locationText} />
              <Input
                returnKeyType={'next'}
                placeholder='End Date'
                style={s.dateInputPlaceholder}
                wrapperStyle={s.dateInput}
              />
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(10)
  },
  inputWrapper: {
    marginHorizontal: scale(10),
    marginTop: verticalScale(20)
  },
  inputPlaceholder: {
    marginLeft: scale(15),
    color: colors.white
  },
  locationWrapper: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius,
    marginHorizontal: scale(40),
    marginTop: verticalScale(10)
  },
  locationText: {
    textAlign: 'center',
    marginTop: verticalScale(5)
  },
  kmWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: verticalScale(15)
  },
  kmInputStyle: {
    color: colors.white,
    textAlign: 'center'
  },
  kmInputWrapperStyle: {
    width: '20%'
  },
  kmTextFirst: {
    flex: 0.8,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  kmTextSecond: {
    flex: 0.3,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  dateWrapper: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(15)
  },
  dateInputPlaceholder: {
    color: colors.white,
    textAlign: 'center'
  },
  dateInput: {
    marginHorizontal: scale(30)
  }
});
export default CustomerQueueListFilterModal;
