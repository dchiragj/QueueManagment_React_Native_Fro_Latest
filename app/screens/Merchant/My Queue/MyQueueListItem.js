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
import svgs from '../../../assets/svg';
import { getQueueDelete } from '../../../services/apiService';
import screens from '../../../constants/screens';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MyQueueListItem = ({ name, category, date, desks, people, navigation, item, onDeleteQueue, categoryid }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const handleQueueDetails = () => {
    const queueId = item?.id || item?._id;
    if (!queueId) {
      
      return;
    }

    navigation.navigate(screens.MyQueueRoot, {
      screen: screens.MyQueueDetail,
      params: { queueId, category },
    });
  };


  const handleDeleteQueue = async () => {
    
    try {
      setDeleting(true);
      
      const result = await getQueueDelete(item.id || item._id);
      

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Queue deleted successfully',
      });

      setVisible(false);
      

      if (typeof onDeleteQueue === "function") {
        
        await onDeleteQueue();
        
      } else {
        
      }

    } catch (err) {
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Failed to delete queue. Please try again.',
      });
    } finally {
      setDeleting(false);
      
    }
  };


  const handleSignInDesk = () => {
    if (navigation && item) {
      const queueId = item.id || item._id;
      navigation.navigate(screens.MyQueueRoot, {
        screen: screens.Service,
        params: { queueId, categoryid },
      });
    }
  };

  return (
    <Card style={s.wrapper}>
      <View style={[s.mainWrapper, s.touchableWrapper]} pointerEvents="box-none">
        <View style={s.mainImg}>
          <Icon name='storefront-sharp' color={colors.primary} isFeather={false} size={moderateScale(50)} />
        </View>
        <View style={s.textWrapper}>
          <TextView color={colors.white} text={name || 'Unnamed Queue'} type={'body-one'} />
          <TextView color={colors.lightWhite} text={category || 'Unknown Doctor'} type={'body-one'} />
          <TextView color={colors.lightWhite} text={date || 'No Date'} type={'body-one'} />

        </View>
        <View style={s.lastWrapper}>
          <View style={s.badgeBorder}>
            <Icon name='people' color={colors.primary} isFeather={false} size={moderateScale(15)} />
            <TextView style={s.LastText} color={colors.white} text={people?.toString() || '0'} type={'body-one'} />
          </View>
        </View>
      </View>

      <View style={s.desksWrapperBg}>
        <View style={s.desksWrapper}>
          <MaterialCommunityIcons name='monitor' color={colors.primary} size={moderateScale(18)} />
          <TextView style={s.LastText} color={colors.white} text={desks?.toString() || '0'} type={'body-one'} />
        </View>
      </View>

      <View style={s.topBorder} />
      <View style={s.linkTextWrapper}>
        <TouchableOpacity onPress={handleQueueDetails} style={s.actionRow}>
          <MaterialCommunityIcons name="eye-outline" size={20} color={colors.primary} />
          <TextView color={colors.primary} text={'View Details'} type={'body-one'} style={s.actionText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignInDesk} style={s.actionRow}>
          <MaterialCommunityIcons name="play-circle-outline" size={20} color={colors.primary} />
          <TextView color={colors.primary} text={'Start Serving'} type={'body-one'} style={s.actionText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setVisible(true)}>
          <Delete name="delete-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
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
                onPress={handleDeleteQueue}
                style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 5 }}
              >
                <Text style={{ color: '#fff' }}>
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
    alignItems: 'center',
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
    flex: 0.55,
  },
  lastWrapper: {
    flex: 0.25,
    alignItems: 'flex-end',
    marginRight: scale(15),
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(5),
  },
  actionText: {
    marginLeft: scale(5),
  },
  badgeBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(6),
  },
  desksWrapperBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: scale(15),
    borderRadius: 8,
    marginBottom: verticalScale(10),
  },
  desksWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
  },
});

export default MyQueueListItem;