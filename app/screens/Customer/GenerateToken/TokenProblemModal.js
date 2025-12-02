import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Touchable } from '../../../components/Button';
import { borderRadius } from '../../../styles/dimensions';
import Input from '../../../components/Input';
import TextView from '../../../components/TextView/TextView';
import AppStyles from '../../../styles/AppStyles';
import  colors  from '../../../styles/colors';
import { verticalScale, scale } from 'react-native-size-matters';
import CheckBox from '../../../components/Checkbox';

const TokenProblemModal = (props) => {
  const { onClosed } = props;
  const [isChecked, setCheckbox] = useState(false);
  return (
    <>
      <StatusBar backgroundColor={colors.backdropModalColor} />
      <Text style={s.closeModal} onPress={onClosed} />
      <View style={AppStyles.modalWrapper}>
        <View style={AppStyles.rectView}></View>
        <View style={AppStyles.modalBox}>
          <View style={s.headerWrapper}>
            <TextView
              color={colors.inputBackgroundColor}
              text={'Select Problems'}
              type={'head-line'}
              style={[s.modalTextHeder, s.modalHeder]}
            />
            <TextView
              onPress={onClosed}
              color={colors.primary}
              isClickableLink={true}
              text={'Done'}
              type={'head-line'}
              style={[s.modalDoneBtn]}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Touchable style={s.modalInput}>
              <CheckBox
                isChecked={isChecked}
                style={s.modalIcon}
                onClick={() => {
                  setCheckbox(!isChecked);
                }}
              />
              <TextView text={'Select Problems'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Touchable style={s.modalInput}>
              <CheckBox
                isChecked={isChecked}
                style={s.modalIcon}
                onClick={() => {
                  setCheckbox(!isChecked);
                }}
              />
              <TextView text={'Select Problems'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Touchable style={s.modalInput}>
              <CheckBox
                isChecked={isChecked}
                style={s.modalIcon}
                onClick={() => {
                  setCheckbox(!isChecked);
                }}
              />
              <TextView text={'Select Problems'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Touchable style={s.modalInput}>
              <CheckBox
                isChecked={isChecked}
                style={s.modalIcon}
                onClick={() => {
                  setCheckbox(!isChecked);
                }}
              />
              <TextView text={'Other...'} type={'body-one'} color={colors.lightWhite} />
            </Touchable>
            <Input
              style={s.input}
              returnKeyType={'next'}
              placeholder='Enter your problem...'
              wrapperStyle={s.inputWrapper}
            />
            <Input
              style={s.input}
              returnKeyType={'next'}
              placeholder='Enter your problem...'
              wrapperStyle={s.inputWrapper}
            />
            <Input
              style={s.input}
              returnKeyType={'next'}
              placeholder='Enter your problem...'
              wrapperStyle={s.inputWrapper}
            />
            <Input
              style={s.input}
              returnKeyType={'next'}
              placeholder='Enter your problem...'
              wrapperStyle={s.inputWrapper}
            />
            <Input
              style={s.input}
              returnKeyType={'next'}
              placeholder='Enter your problem...'
              wrapperStyle={s.inputWrapper}
            />
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default TokenProblemModal;

const s = StyleSheet.create({
  closeModal: {
    flex: 1
  },
  headerWrapper: {
    // backgroundColor: colors.red,
    paddingBottom: verticalScale(15)
  },
  modalHeder: {
    marginTop: scale(12)
  },
  modalTextHeder: {
    textAlign: 'center'
  },
  modalDoneBtn: {
    textAlign: 'right',
    position: 'absolute',
    right: 20,
    top: 15
  },
  modalInput: {
    backgroundColor: colors.inputBackgroundColor,
    flexDirection: 'row',
    padding: 15,
    borderRadius: borderRadius,
    marginTop: verticalScale(15),
    marginHorizontal: scale(10)
  },
  modalIcon: {
    marginRight: scale(10)
  },
  inputWrapper: {
    marginLeft: scale(35),
    marginRight: scale(10)
  },
  input: {
    marginLeft: scale(20),
    color: colors.white
  }
});
