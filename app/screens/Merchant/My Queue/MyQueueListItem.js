import { Touchable } from '../../../components/Button';
import Card from'../../../components/Card';
import Icon from '../../../components/Icon';
import Delete from 'react-native-vector-icons/MaterialIcons';
import TextView from '../../../components/TextView/TextView';
import  colors  from '../../../styles/colors';
import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AwesomeAlert from 'react-native-awesome-alerts';
// import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../../../assets/svg';
import { getQueueDelete } from '../../../services/apiService';
import screens from '../../../constants/screens';

const MyQueueListItem = ({ name, category, date, desks, people, navigation, item, onDeleteQueue ,categoryid}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState(null);

const handleQueueDetails = () => {
  const queueId = item?.id || item?._id;
  if (!queueId) {
    console.error('No queueId');
    return;
  }

  navigation.navigate(screens.MyQueueRoot, {
    screen: screens.MyQueueDetail,
    params: { queueId, category },
  });
};


  const handleDeleteQueue = async (queueId) => {
    try {
      await getQueueDelete(queueId);
      if (onDeleteQueue) {
        onDeleteQueue(queueId);
      }
      console.log('Queue deleted successfully at', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    } catch (err) {
      console.error('Failed to delete queue', err);
      Alert.alert('Error', 'Failed to delete queue. Please try again.');
    }
  };
  
  const handleSignInDesk = () => {
  if (navigation && item) {
    const queueId = item.id || item._id;
    // navigation.navigate('Service', { queueId, categoryid });
     navigation.navigate(screens.MyQueueRoot, {
    screen: screens.Service,
    params: { queueId, categoryid },
  });
  }
  };
  
  return (
    <Card style={s.wrapper}>
      <Touchable style={[s.mainWrapper, s.touchableWrapper]}>
        <View style={s.mainImg}>
            <Icon name='storefront-sharp' color={colors.primary} isFeather={false} size={moderateScale(50)} />
        </View>
        <View style={s.textWrapper}>
          <TextView color={colors.white} text={name || 'Unnamed Queue'} type={'body-one'} />
          <TextView color={colors.lightWhite} text={category || 'Unknown Doctor'} type={'body-one'} />
          <TextView color={colors.lightWhite} text={date || 'No Date'} type={'body-one'} />
        </View>
        <View style={s.lastWrapper}>
          <View style={s.mainWrapper}>
            <Icon name='desktop' color={colors.primary} isFeather={false} />
            <TextView style={s.LastText} color={colors.white} text={desks?.toString() || '0'} type={'body-one'} />
          </View>
          <View style={[s.mainWrapper, s.secondTextWrapper]}>
            <Icon name='people-circle' color={colors.primary} isFeather={false} />
            <TextView style={s.LastText} color={colors.white} text={people?.toString() || '0'} type={'body-one'} />
          </View>
        </View>
      </Touchable>
      <View style={s.topBorder} />
      <View style={s.linkTextWrapper}>
        <Touchable onPress={handleQueueDetails}>
          <TextView color={colors.primary} text={'Queue Detail'} type={'body-one'} style={s.TextLink} />
        </Touchable>
          <Touchable onPress={handleSignInDesk}>
          {/* <TextView color={colors.primary} text={'Sign In-Desk'} type={'body-one'} style={s.TextLink} /> */}
          <TextView color={colors.primary} text={'Serving'} type={'body-one'} style={s.TextLink} />
          </Touchable>
        <Touchable
          onPress={() => {
            setSelectedQueueId(item.id || item._id);
            setShowAlert(true);
          }}
        >
          <Delete name="delete" size={30} color={colors.primary} />
        </Touchable>
      </View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Delete Queue?"
        message="Are you sure you want to delete this queue?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No"
        confirmText="Yes, Delete it"
        confirmButtonColor={colors.primary}
        onCancelPressed={() => {
          setShowAlert(false);
          setSelectedQueueId(null);
        }}
        onConfirmPressed={() => {
          if (selectedQueueId) {
            handleDeleteQueue(selectedQueueId, onDeleteQueue);
          }
          setShowAlert(false);
          setSelectedQueueId(null);
        }}
      />
    </Card>
  );
};

MyQueueListItem.navigationOptions = ({ navigation }) => ({
  title: '',
  headerLeft: null,
  headerStyle: {
    elevation: 0,
  },
});

const s = StyleSheet.create({
  wrapper: {
    marginBottom: verticalScale(10),
    flex: 1,
  },
  mainWrapper: {
    flexDirection: 'row',
  },
  touchableWrapper: {
    paddingVertical: verticalScale(20),
  },
  mainImg: {
    marginLeft: scale(10),
    flex: 0.2,
  },
  textWrapper: {
    flex: 0.6,
  },
  lastWrapper: {
    flex: 0.2,
  },
  LastText: {
    marginLeft: scale(5),
  },
  secondTextWrapper: {
    marginTop: verticalScale(10),
  },
  topBorder: {
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    marginHorizontal: scale(15),
  },
  linkTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  TextLink: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(5),
  },
});

export default MyQueueListItem;