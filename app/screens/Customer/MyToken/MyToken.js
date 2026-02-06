// import HeaderButton from '../../../components/HeaderButton';
// import  colors  from '../../../styles/colors';
// import AppStyles from '../../../styles/AppStyles';
// import React from 'react';
// import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
// import NavigationOptions from '../../../components/NavigationOptions';
// import screens from '../../constants/screens';
// import CompletedTokenListItem from '../CompletedToken/CompletedTokenListItem';

// const MyToken = (props) => {
//   const onPressMyTokenDetails = () => {
//     // props.navigation.navigate(screens.MyTokenDetails);
//   };
//   return (
//     <SafeAreaView style={[AppStyles.root]}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <CompletedTokenListItem onPress={onPressMyTokenDetails} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// MyToken.navigationOptions = ({ navigation }) => {
//   return NavigationOptions({
//     title: '',
//     isBack: false,
//     navigation: navigation,
//     headerLeft: (
//       <HeaderButton
//         type={1}
//         iconName={'md-menu'}
//         color={colors.primary}
//         isFeather={false}
//         iconType={'ionic'}
//         onPress={() => navigation.openDrawer()}
//       />
//     ),
//     headerStyle: { elevation: 0 }
//   });
// };
// const s = StyleSheet.create({});
// export default MyToken;


// import HeaderButton from '../../../components/HeaderButton';
import colors from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import Card from '../../../components/Card';
import TextView from '../../../components/TextView/TextView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import { getCategories, getMyTokens, getTokenDelete, getTokenList } from '../../../services/apiService';
import { getAuthUser } from '../../../utils/localStorageHelpers';
import HeaderButton from '../../../components/HeaderButton';
import { useBranch } from '../../../context/BranchContext';

const MyToken = () => {

  const [myTokens, setMyTokens] = useState([]);
  const { selectedBranchId } = useBranch();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userRole, setUserRole] = useState(null);


  const loadMyTokens = async () => {
    setLoading(true);
    try {
      const user = await getAuthUser();
      setUserRole(user?.role);
      const branchId = selectedBranchId !== 'all' ? selectedBranchId : null;
      const res = await getTokenList(branchId);
      if (res.status === 'ok' && Array.isArray(res.data)) {
        setMyTokens(res.data);
      } else {
        setMyTokens([]);
      }
    } catch (err) {
      console.log('Failed to load my tokens', err);
      setMyTokens([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const user = await getAuthUser();
      setUserRole(user?.role);
      const branchId = selectedBranchId !== 'all' ? selectedBranchId : null;
      const res = await getTokenList(branchId);
      if (res.status === 'ok' && Array.isArray(res.data)) {
        setMyTokens(res.data);
      } else {
        setMyTokens([]);
      }
    } catch (err) {
      console.log('Failed to refresh tokens', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    loadMyTokens();
  }, [selectedBranchId]);

  const handleDeleteToken = async (tokenId) => {
    try {
      await getTokenDelete(tokenId);
      setMyTokens(prev => prev.filter(t => t.id !== tokenId));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res?.data?.map((c) => ({
        text: c.name,
        value: c.id,
      }));
      setCategories(list || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };
  const getCategoryName = (categoryId) => {
    if (categoryId === null || categoryId === undefined) {
      return 'Category';
    }
    const category = categories.find((cat) => cat.value === categoryId);
    return category ? category.text : ' Category';
  };

  if (loading) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <ActivityIndicator size="large" color={colors.primary} style={AppStyles.loading} />
      </SafeAreaView>
    );
  }

  if (myTokens.length === 0) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.emptyText}>You have no tokens yet</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {myTokens.map((token) => (
          <Card key={token.id} style={styles.wrapper}>
            <View style={styles.mainWrapper}>
              {/* Token Number */}
              <View style={styles.numberTextWrapper}>
                <TextView
                  color={colors.primary}
                  text={token.tokenNumber?.toString() || 'N/A'}
                  type="sub-title"
                  style={styles.numberText}
                />
              </View>

              {/* Details */}
              <View style={styles.textWrapper}>
                <TextView color={colors.white} text={token.queueName || 'Queue'} type="body-one" />
                {userRole === 'merchant' && token.customerName && (
                  <TextView
                    color={colors.lightWhite}
                    text={token.customerName}
                    type="body-one"
                    style={{ fontSize: moderateScale(14), fontWeight: '500' }}
                  />
                )}
                <TextView
                  color={colors.lightWhite}
                  text={formatDate(token.createdAt)}
                  type="body-one"
                />
                <TextView color={colors.lightWhite} text={getCategoryName(token.categoryId)} type="body-one" />
              </View>

              {/* Delete + Status */}
              <View style={styles.deleteIconWrapper}>


                <View style={styles.tokenStatusWrapper}>
                  <View style={styles.tokenStatusTriangle}></View>
                  <View style={[
                    styles.tokenStatusRectangle,
                    { backgroundColor: token.status === 'COMPLETED' ? '#4CAF50' : colors.primary }
                  ]}>
                    <TextView
                      color={colors.white}
                      text={token.status}
                      type="body-one"
                      style={styles.tokenStatusText}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTokenId(token.id);
                    setShowAlert(true);
                  }}
                  style={styles.deleteButton}
                  disabled={token.status === 'COMPLETED'}
                >
                  <Icon name="delete" size={28} color={
                    token.status === 'COMPLETED'
                      ? '#666'
                      : colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        <AwesomeAlert
          show={showAlert}
          title="Delete Token?"
          message="Are you sure you want to delete this token?"
          closeOnTouchOutside={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No"
          confirmText="Yes, Delete"
          confirmButtonColor="#d32f2f"
          onCancelPressed={() => {
            setShowAlert(false);
            setSelectedTokenId(null);
          }}
          onConfirmPressed={() => {
            if (selectedTokenId) handleDeleteToken(selectedTokenId);
            setShowAlert(false);
            setSelectedTokenId(null);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

MyToken.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: 'My Tokens',
    isBack: false,
    navigation,
    headerLeft: (
      <HeaderButton
        type={1}
        iconName={'md-menu'}
        color={colors.primary}
        isFeather={false}
        iconType={'ionic'}
        onPress={() => navigation.openDrawer()}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', fontSize: 18 },
  emptyText: { color: '#888', fontSize: 18, fontStyle: 'italic' },
  wrapper: {
    marginHorizontal: scale(10),
    marginBottom: verticalScale(12),
    paddingVertical: verticalScale(10),
    borderRadius: 15,
    elevation: 6,
    backgroundColor: '#252A34',
  },
  mainWrapper: { flexDirection: 'row', alignItems: 'center' },
  numberTextWrapper: { flex: 0.25 },
  numberText: {
    borderWidth: 2,
    borderColor: colors.primary,
    marginLeft: scale(15),
    borderRadius: 12,
    padding: moderateScale(12),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textWrapper: { flex: 0.5, marginLeft: scale(8) },
  deleteIconWrapper: {
    flex: 0.25,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingRight: scale(10),
  },
  deleteButton: { padding: moderateScale(5) },
  tokenStatusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  tokenStatusTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '270deg' }],
    marginRight: -1,
  },
  tokenStatusRectangle: {
    width: scale(78),
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  tokenStatusText: {
    fontSize: moderateScale(10),
  },
});

export default MyToken;