import React, { useState, useEffect } from 'react';
import HeaderButton from '../../../components/HeaderButton';
import  colors  from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NavigationOptions from '../../../components/NavigationOptions';
import screens from '../../../constants/screens';
import { getCategories, getCompletedHistory, getTokenList } from '../../../services/apiService';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Card from '../../../components/Card';

import Icon from 'react-native-vector-icons/MaterialIcons';
import AwesomeAlert from 'react-native-awesome-alerts';
import TextView from '../../../components/TextView/TextView';

const CompletedToken = ({ navigation }) => {
  const [myTokens, setMyTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [ categories, setCategories ] = useState( [] );
  
  const onPressMyTokenDetails = (tokenId) => {
    navigation.navigate(screens.MyTokenDetails, { tokenId });
  };

  useEffect(() => {
    const loadMyTokens = async () => {
      try {
        const res = await getTokenList();
        if (res.status === 'ok' && Array.isArray(res.data)) {
            const filtered = res.data.filter(t => t.status === 'COMPLETED');
          setMyTokens(filtered);
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
   fetchCategories()
    loadMyTokens();
    const interval = setInterval(loadMyTokens, 10000);
    return () => clearInterval(interval);
  }, []);

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
      const list = res?.data?.map( ( c ) => ( {
        text: c.name,
        value: c.id,
      } ) );
      setCategories( list || [] );
    } catch ( err ) {
      console.error( "Error fetching categories:", err );
      setCategories( [] );
    }
  };
  const getCategoryName = ( categoryId ) => {
    if ( categoryId === null || categoryId === undefined ) {
      return 'Category';
    }
    const category = categories.find( ( cat ) => cat.value === categoryId );
    return category ? category.text : ' Category';
  };

 if ( loading ) {
    return (
      <SafeAreaView style={ [ AppStyles.root ] }>
        <ActivityIndicator size="large" color={ colors.primary } style={ AppStyles.loading } />
      </SafeAreaView>
    );
  } 

  if (myTokens.length === 0) { 
    return (
      <SafeAreaView style={[AppStyles.root, styles.center]}>
        <Text style={styles.emptyText}>You have no tokens yet</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {myTokens.map((token) => (
          <Card key={token.id} style={styles.wrapper} onPress={() => onPressMyTokenDetails(token.id)}>
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
                <TextView color={colors.lightWhite} text={getCategoryName( token.categoryId )} type="body-one" />
                <TextView
                  color={colors.lightWhite}
                  text={formatDate(token.createdAt)}
                  type="body-one"
                />
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
                >
                  <Icon name="delete" size={28} color={colors.primary} />
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

CompletedToken.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: 'Completed Tokens',
    isBack: false,
    navigation: navigation,
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
  textWrapper: { flex: 0.5, marginLeft: scale(15) },
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
    padding:4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  tokenStatusText: {
    fontSize: moderateScale(10),
  },
});

export default CompletedToken;