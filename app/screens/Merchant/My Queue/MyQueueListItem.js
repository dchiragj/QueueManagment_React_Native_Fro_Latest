import { Touchable } from '../../../components/Button';
import Card from '../../../components/Card';
import Icon from '../../../components/Icon';
import Delete from 'react-native-vector-icons/MaterialIcons';
import TextView from '../../../components/TextView/TextView';
import colors from '../../../styles/colors';
import React, { useState } from 'react';
import { StyleSheet, View, Alert, Modal, TouchableOpacity, Text } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import AwesomeAlert from 'react-native-awesome-alerts';
// import SvgIcon from 'react-native-svg-icon/lib/components/SvgIcon';
import svgs from '../../../assets/svg';
import { getQueueDelete } from '../../../services/apiService';
import screens from '../../../constants/screens';
import Toast from 'react-native-toast-message';

const MyQueueListItem = ({ name, category, date, desks, people, navigation, item, onDeleteQueue, categoryid }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);


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


  const handleDeleteQueue = async () => {
    try {
      setDeleting(true);   // 👈 start loading
      await getQueueDelete(item.id || item._id);

      if (typeof onDeleteQueue === "function") {
        await onDeleteQueue();
      }

      console.log("Queue deleted");
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete queue. Please try again.',
      });

    } finally {
      setDeleting(false);  // 👈 stop loading
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

          <View style={[s.mainWrapper, s.secondTextWrapper]}>
            <Icon name='people-circle' color={colors.primary} isFeather={false} />
            <TextView style={s.LastText} color={colors.white} text={people?.toString() || '0'} type={'body-one'} />
          </View>
        </View>
      </Touchable>

      <View style={s.desksWrapper}>
        <Icon name='desktop' color={colors.primary} isFeather={false} />
        <TextView style={s.LastText} color={colors.white} text={desks?.toString() || '0'} type={'body-one'} />
      </View>

      <View style={s.topBorder} />
      <View style={s.linkTextWrapper}>
        <Touchable onPress={handleQueueDetails}>
          <TextView color={colors.primary} text={'View Details'} type={'body-one'} style={s.TextLink} />
        </Touchable>
        <Touchable onPress={handleSignInDesk}>
          {/* <TextView color={colors.primary} text={'Sign In-Desk'} type={'body-one'} style={s.TextLink} /> */}
          <TextView color={colors.primary} text={'Start Serving'} type={'body-one'} style={s.TextLink} />
        </Touchable>
        <Touchable
          onPress={() => setVisible(true)}
        >
          <Delete name="delete" size={30} color={colors.primary} />
        </Touchable>
      </View>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0006' }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ marginBottom: 20 }}>
              Are you sure you want to delete this queue?
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity disabled={deleting} onPress={() => setVisible(false)} style={{ marginRight: 20, backgroundColor: colors.gray, padding: 10, borderRadius: 5 }}>
                <Text>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={deleting}
                onPress={async () => {
                  await handleDeleteQueue();
                  setVisible(false);
                }}
                style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5 }}
              >
                <Text>

                  {deleting ? "Deleting..." : "Yes, Delete"}
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>


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
    // marginLeft: scale(10),
  },
  desksWrapper: {
    flexDirection: 'row',
    gap: scale(10),
    marginLeft: scale(10),
    marginBottom: scale(10)
  },
  touchableWrapper: {
    paddingVertical: verticalScale(20),
    paddingBottom: scale(10)
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