import Icon from '../../../components/Icon';
import TextView from '../../../components/TextView/TextView';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import { borderRadius } from '../../../styles/dimensions';
import React from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { verticalScale, scale } from 'react-native-size-matters';
import NavigationOptions from '../../../components/NavigationOptions';
// import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../../../assets/svg';
import screens from '../../../constants/screens';
import { Button } from '../../../components/Button';

const CustomerQueueDetails = (props) => {
  const onPressGenerateToken = () => {
    props.navigation.navigate(screens.GenerateToken);
  };
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextView color={colors.white} text={'HOSPITAL QUEUE'} type={'body-one'} style={s.headerTitle} />
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
        <View style={[s.locationTextWrapper]}>
          <Icon name='calendar' color={colors.primary} isFeather={false} />
          <TextView color={colors.white} text={'Date Range '} type={'body-one'} style={s.dateRangeText} />
        </View>
        <TextView
          color={colors.lightWhite}
          text={'Mon 02 oct 2021  - Thu 05 oct 2021 '}
          type={'body-one'}
          style={s.dateText}
        />
        <View style={[s.locationTextWrapper, s.totalTokenWrapper]}>
          {/* <SvgIcon svgs={svgs} name={'bag-primary'} fill={colors.primary} width={20} height={22} /> */}
          <View style={s.totalTokenSecondWrapper}>
            <TextView color={colors.white} text={'Total Token :'} type={'body-one'} style={s.dateRangeText} />
            <TextView color={colors.lightWhite} text={' 0 - 150 '} type={'body-one'} />
          </View>
        </View>
        <Button
          onPress={onPressGenerateToken}
          ButtonText='Join Queue'
          style={[s.btn, AppStyles.btnStyle]}
          animationStyle={s.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
CustomerQueueDetails.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,

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
  dateRangeText: {
    marginLeft: scale(5)
  },
  dateText: {
    marginTop: verticalScale(10),
    textAlign: 'center'
  },
  totalTokenWrapper: {
    marginTop: verticalScale(60)
  },
  totalTokenSecondWrapper: {
    flexDirection: 'row'
  },
  btn: {
    marginTop: verticalScale(200),
    marginBottom: verticalScale(10)
  }
});
export default CustomerQueueDetails;
