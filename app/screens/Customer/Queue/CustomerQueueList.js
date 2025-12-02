import HeaderButton from '../../../components/HeaderButton';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard' ;
import AppStyles from '../../../styles/AppStyles';
import NavigationOptions from '../../../components/NavigationOptions';
import  colors  from '../../../styles/colors';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CustomerQueueListItem from './CustomerQueueListItem';
import screens from '../../../constants/screens';
import { scale } from 'react-native-size-matters';
import Modal from 'react-native-modalbox';
import CustomerQueueListFilterModal from './CustomerQueueListFilterModal';

const CustomerQueueList = (props) => {
  const [isFilterModal, setFilterModal] = useState(false);
  useEffect(() => {
    props.navigation.setParams({ openFilterModal });
  }, []);

  const openFilterModal = () => {
    setFilterModal(true);
  };
  const closeFilterModal = () => {
    setFilterModal(false);
  };

  const onPressQueueList = () => {
    props.navigation.navigate(screens.CustomerQueueDetails);
  };
  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <CustomerQueueListItem onPress={onPressQueueList} />
        <CustomerQueueListItem />
        <CustomerQueueListItem />
        <CustomerQueueListItem />
        <CustomerQueueListItem />
      </ScrollableAvoidKeyboard>
      <Modal
        style={[AppStyles.modal]}
        isOpen={isFilterModal}
        entry={'bottom'}
        position={'bottom'}
        coverScreen={true}
        backdrop={true}
        swipeToClose={false}
        backdropOpacity={1}
        backdropColor={colors.backdropModalColor}
        onClosed={closeFilterModal}>
        <CustomerQueueListFilterModal onClosed={closeFilterModal} />
      </Modal>
    </SafeAreaView>
  );
};
CustomerQueueList.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,

    headerRight: (
      <HeaderButton
        type={1}
        iconName={'options-outline'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={navigation.getParam('openFilterModal')}
      />
    ),

    headerStyle: { elevation: 0 }
  });
};
const s = StyleSheet.create({
  HeaderRightButton: {
    marginRight: scale(12),
    padding: 10
  }
});
export default CustomerQueueList;
