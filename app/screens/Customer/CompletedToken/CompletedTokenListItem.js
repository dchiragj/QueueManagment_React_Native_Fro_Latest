

import React, { useEffect, useState } from 'react';
import Card from '../../../components/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TextView from '../../../components/TextView/TextView';
import { getCategories, getTokenDelete, getTokenList } from '@app/app/services/apiService';
import colors from '../../../styles/colors';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import AwesomeAlert from 'react-native-awesome-alerts';

const CompletedTokenListItem = (props) => {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res?.data?.map((c) => ({
        text: c.name,
        value: c.id,
      }));
      setCategories(list || []);
    } catch (err) {
      
      setCategories([]);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await getTokenList();
        if (response.data && Array.isArray(response.data.List)) {
          const filtered = response.data.filter(t => t.status === 'COMPLETED');
          setTokens(filtered);
        } else if (Array.isArray(response.data)) {
          setTokens(response.data);
        } else {
          setTokens([]);
        }
      } catch (err) {
        
        setError('Failed to load tokens. Please try again later.');
      }
    };

    fetchTokens();
    fetchCategories();
  }, []);
  const handleDeleteToken = async (tokenId) => {
    try {
      await getTokenDelete(tokenId);
      setTokens((prevTokens) =>
        prevTokens.filter((token) => token.id !== tokenId)
      );
    } catch (err) {
      
      setError('Failed to cancel token. Please try again.');
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date)) return dateString;

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} - ${time}`;
  };

  const getCategoryName = (categoryId) => {
    if (categoryId === null || categoryId === undefined) {
      return 'Category';
    }
    const category = categories.find((cat) => cat.value === categoryId);
    return category ? category.text : ' Category';
  };

  return (
    <>
      {tokens.map((token, index) => (
        <Card key={index} style={styles.wrapper} onPress={props.onPress}>
          <View style={styles.mainWrapper}>
            <View style={styles.numberTextWrapper}>
              <TextView
                color={colors.primary}
                text={token.tokenNumber || 'N/A'}
                type="sub-title"
                style={styles.numberText}
              />
            </View>
            <View style={styles.textWrapper}>
              <TextView
                color={colors.white}
                text={token.queueName || 'Queue'}
                type="body-one"
              />
              <TextView
                color={colors.lightWhite}
                text={getCategoryName(token.categoryId)}
                type="body-one"
              />
              <TextView
                color={colors.lightWhite}
                text={formatDate(token.createdAt)}
                type="body-one"
              />
            </View>
            <View style={styles.deleteIconWrapper}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTokenId(token.id);
                    setShow
                  }}
                >
                  <Icon name="delete" size={30} color={colors.primary} />
                </TouchableOpacity>
                <AwesomeAlert
                  show={showAlert}
                  showProgress={false}
                  title="Delete Token?"
                  message="Are you sure you want to delete this token?"
                  closeOnTouchOutside={false}
                  closeOnHardwareBackPress={false}
                  showCancelButton={true}
                  showConfirmButton={true}
                  cancelText="No"
                  confirmText="Yes, Delete it"
                  confirmButtonColor={colors.primary}
                  onCancelPressed={() => {
                    setShow
                    setSelectedTokenId(null);
                  }}
                  onConfirmPressed={() => {
                    if (selectedTokenId) {
                      handleDeleteToken(selectedTokenId);
                    }
                    setShow
                    setSelectedTokenId(null);
                  }}
                />
              </View>

              <View style={styles.tokenStatusWrapper}>
                <View style={styles.tokenStatusTriangle}></View>
                <View style={styles.tokenStatusRectangle}></View>
                <TextView
                  color={colors.white}
                  text={token.status}
                  type="body-one"
                  style={styles.tokenStatusText}
                />
              </View>
            </View>
          </View>
        </Card>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  mainWrapper: {
    flexDirection: 'row',
  },
  numberTextWrapper: {
    flex: 0.3,
  },
  numberText: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: scale(20),
    borderRadius: 5,
    padding: moderateScale(10),
    textAlign: 'center',
  },
  textWrapper: {
    marginLeft: scale(15),
    flex: 0.4,
    flexGrow: 1
  },
  deleteIconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  tokenStatusWrapper: {
    flex: 0.4,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginTop: 3,
  },
  tokenStatusTriangle: {
    borderLeftWidth: 15.5,
    borderRightWidth: 15.5,
    borderBottomWidth: 18,
    marginTop: verticalScale(7.5),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
    transform: [{ rotate: '270deg' }],
  },
  tokenStatusRectangle: {
    width: scale(80),
    backgroundColor: colors.primary,
    marginLeft: -7,
    height: verticalScale(30),
  },
  tokenStatusText: {
    position: 'absolute',
    marginTop: verticalScale(5),
    padding: 2
  },
  errorText: {
    color: colors.lightWhite,
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
});
export default CompletedTokenListItem;