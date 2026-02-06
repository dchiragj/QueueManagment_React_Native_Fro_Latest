import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../../styles/AppStyles';
import { completeToken, getCategories, getCompletedHistory, getCurrentToken, getQueueDetails, getServicingList, getServicingSkip, getSkippedList, recoverSkippedToken } from '../../services/apiService';
import NavigationOptions from '../../components/NavigationOptions';
import HeaderButton from '../../components/HeaderButton';
import CheckBox from 'react-native-check-box';
import colors from '../../styles/colors';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { connect } from 'react-redux';
import screens from '../../constants/screens';
import Speech from '@mhpdev/react-native-speech';
import { useBranch } from '../../context/BranchContext';


const Servicing = (props) => {
  const { navigation, auth } = props;
  const route = useRoute();
  const { selectedBranchId } = useBranch();
  const role = auth.user?.role;

  // Use params if available, otherwise fallback to user's assigned queue (for direct operator login)
  const queueId = route.params?.queueId || auth.user?.queue_id || auth.user?.assignedQueueId;
  const categoryid = route.params?.categoryid || auth.user?.category_id || auth.user?.categoryId;

  const SERVICE_TIME = 10;

  const [nowServing, setNowServing] = useState(0);

  useEffect(() => {
    navigation.setParams({ role });
  }, [role]);
  const [lastIssued, setLastIssued] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [lastRecords, setLastRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [completedHistory, setCompletedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  const showToast = (type, title, message) => {
    Toast.show({
      type: String(type),
      text1: String(title),
      text2: String(message),
      position: 'top',
      visibilityTime: 3000,
    });
  };
  // Fetch Queue Data
  useEffect(() => {
    if (queueId && categoryid) {
      fetchQueueData(queueId, categoryid);
      fetchSkippedData(queueId, categoryid);
    } else {
      console.error('Queue or category missing in params', { queueId, categoryid });
      showToast('error', 'Error', 'Missing queue or category information.');
      setLoading(false);
    }
  }, [queueId, categoryid, selectedBranchId]);
  useEffect(() => {
    if (!queueId || !categoryid) return;

    const fetchCurrentAndUpcoming = async () => {
      try {
        const result = await getCurrentToken(queueId, categoryid);
        if (result.current) {
          setNowServing(result.current.tokenNumber);
        }

      } catch (err) {
        console.log("Current token fetch failed:", err);

      }
    };


    fetchCurrentAndUpcoming();
    // const interval = setInterval(fetchCurrentAndUpcoming, 8000);

    // return () => clearInterval(interval);
  }, [queueId, categoryid, selectedBranchId]);

  useEffect(() => {
    if (!queueId || !categoryid) return;

    // First time load
    fetchCompletedHistory();

    // Auto refresh every 8 seconds
    const interval = setInterval(() => {
      fetchCompletedHistory();
    }, 8000);

    return () => clearInterval(interval);
  }, [queueId, categoryid, selectedBranchId]);
  const fetchCompletedHistory = async () => {
    try {
      const branchId = selectedBranchId !== 'all' ? selectedBranchId : null;
      const res = await getCompletedHistory(queueId, categoryid, branchId);
      if (res) {
        setCompletedHistory(res.data);
      }
    } catch (err) {
      console.log('History load failed');
    }
  };
  const handledcategorylist = async () => {
    try {
      const res = await getCategories();
      const list = res?.data?.map(c => ({ key: c.id, value: c.name })) || [];
      setCategories(list);
      return list;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      return [];
    }
  };

  const calculateEstimatedTimes = (allCustomers, currentServing) => {
    const sorted = [...allCustomers].sort((a, b) => a.tokenNumber - b.tokenNumber);
    const pending = sorted.filter(c => c.tokenNumber >= currentServing);
    return pending.map((c, index) => ({
      ...c,
      estimatedWait: index * SERVICE_TIME,
    }));
  };

  const fetchQueueData = async (queueId, categoryId) => {
    setLoading(true);
    try {
      const categoryList = await handledcategorylist();
      const categoryMap = new Map(categoryList.map(cat => [cat.key, cat.value]));

      const branchId = selectedBranchId !== 'all' ? selectedBranchId : null;
      const [servicingData, queueDetails] = await Promise.all([
        getServicingList(queueId, categoryId, branchId),
        getQueueDetails(queueId),
      ]);

      if (servicingData.status === 'ok' && servicingData.data) {
        const mappedCustomers = servicingData.data.map(token => {
          const category =
            token.categoryid != null
              ? categoryMap.get(token.categoryid) || token.queue.name || 'Unknown Category'
              : token.queue.name || 'No Category ID Provided';

          return {
            id: token.id,
            name: `${token.customer.FirstName} ${token.customer.LastName}`.trim() || 'Unknown Customer',
            service: token.queue.name || 'Unknown Service',
            tokenNumber: token.tokenNumber,
            queueId: token.queueId,
            category: category,
            isSkipped: token.isSkipped || false,
            isActive: false,
          };
        });

        const activeCustomers = mappedCustomers.filter(c => !c.isSkipped);
        if (activeCustomers.length === 0) {
          setCustomers([]);
          setLastIssued(0);
          setNowServing(0);
          showToast('info', 'No Customers', 'No active customers in queue.');
          return;
        }

        const firstToken = Math.min(...activeCustomers.map(c => c.tokenNumber));
        const lastToken = Math.max(...activeCustomers.map(c => c.tokenNumber));

        const updatedCustomers = activeCustomers.map(c => ({
          ...c,
          isActive: c.tokenNumber === firstToken,
        }));

        const customersWithTime = calculateEstimatedTimes(updatedCustomers, firstToken);

        setCustomers(customersWithTime);
        setNowServing(firstToken);
        setLastIssued(lastToken);
      } else {
        setCustomers([]);
        setLastIssued(0);
        setNowServing(0);
        showToast('info', 'Empty Queue', servicingData.message || 'No tokens found');
      }
    } catch (error) {
      console.error('Fetch queue data error:', error);
      showToast('error', 'Error', error.message || 'Failed to load queue data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkippedData = async (queueId, categoryId) => {
    const categoryList = await handledcategorylist();
    const categoryMap = new Map(categoryList.map(cat => [cat.key, cat.value]));
    try {
      const branchId = selectedBranchId !== 'all' ? selectedBranchId : null;
      const response = await getSkippedList(queueId, categoryid, branchId);
      if (response.status === 'ok' && response.data) {
        const mappedCustomers = response.data.map(token => {
          const category =
            token.categoryid != null
              ? categoryMap.get(token.categoryid) || token.queue.name || 'Unknown Category'
              : token.queue.name || 'No Category ID Provided';

          return {
            id: token.id,
            name: `${token.customer.FirstName} ${token.customer.LastName}`.trim() || 'Unknown Customer',
            service: token.queue.name || 'Unknown Service',
            tokenNumber: token.tokenNumber,
            queueId: token.queueId,
            category: category,
            isSkipped: token.isSkipped || false,
            isActive: false,
            status: token.status
          };
        });
        setLastRecords(mappedCustomers);
      }

    } catch (error) {

    }
  };
  const callNext = async () => {
    if (customers.length === 0) {
      showToast('info', 'Empty', 'No customers in queue');
      return;
    }

    const current = customers.find(c => c.isActive);
    if (!current) return;

    try {
      const res = await completeToken(current.id);
      if (res.status !== 'ok') throw new Error(res.message);

      // Add to Completed History
      setCompletedHistory(prev => [{
        id: current.id,
        tokenNumber: current.tokenNumber,
        name: current.name,
        service: current.service,
        completedAt: new Date().toISOString()
      }, ...prev]);

      const remaining = customers.filter(c => c.id !== current.id);

      if (remaining.length > 0) {
        const sorted = [...remaining].sort((a, b) => a.tokenNumber - b.tokenNumber);
        const next = sorted[0];

        // Voice Announcement (in English)
        const announceText = `Token number ${next.tokenNumber}, please come to the counter.`;

        Speech.speak(announceText, {
          language: 'en-US',  // English (you can also use 'en-IN' for Indian accent)
          rate: 2.0,
          pitch: 0.5,
        });

        // UI Update
        setNowServing(next.tokenNumber);
        setCustomers(sorted.map(c => ({
          ...c,
          isActive: c.tokenNumber === next.tokenNumber
        })));

        showToast('success', 'Next Called', `Now serving token ${next.tokenNumber}`);

      } else {
        setCustomers([]);
        setNowServing(0);

        Speech.speak('The queue has been completed. All work for today is finished.', {
          language: 'en-US',
        });

        showToast('success', 'All Done!', 'Queue completed!');
      }

    } catch (err) {
      console.log(err);
      showToast('error', 'Failed', err.message || 'Could not complete token');
    }
  };

  const skip = async () => {
    if (selected.length === 0) {
      showToast('error', 'Selection Required', 'Please select at least one customer to skip.');
      return;
    }

    try {
      const data = await getServicingSkip(selected);
      if (data.status !== 'ok') throw new Error(data.message || 'Failed to skip tokens');

      const tokens = Array.isArray(data.data) ? data.data : [data.data];

      // Add to lastRecords (only SKIPPED)
      const skippedRecords = tokens.map(token => {
        const customer = customers.find(c => c.id === token.id);
        return {
          tokenNumber: token.tokenNumber,
          name: customer?.name || 'Unknown',
          status: 'SKIPPED'
        };
      });

      setLastRecords(prev => [...skippedRecords, ...prev].slice(-3));

      // Remove from customers
      setCustomers(prev => prev.filter(c => !selected.includes(c.id)));
      setSelected([]);

      // Update nowServing
      const remaining = customers.filter(c => !selected.includes(c.id));
      if (remaining.length > 0) {
        const sorted = remaining.sort((a, b) => a.tokenNumber - b.tokenNumber);
        setNowServing(sorted[0].tokenNumber);
      } else {
        setNowServing(0);
      }

      showToast('success', 'Skipped', `${selected.length} token(s) skipped.`);

    } catch (error) {
      showToast('error', 'Skip Failed', error.message || 'Could not skip tokens');
    }
  };

  const recoverToken = async (record) => {
    try {
      const response = await recoverSkippedToken(record.tokenNumber);

      if (response.status !== 'ok') {
        throw new Error(response.message || 'Failed to recover token');
      }

      fetchSkippedData(queueId, categoryid);
      fetchQueueData(queueId, categoryid);
      showToast('success', 'Recovered', `Token ${record.tokenNumber} recovered!`);
    } catch (error) {
      console.error('Recover error:', error);
      showToast('error', 'Recover Failed', error.message || 'Could not recover token');
    }
  };

  useEffect(() => {
    if (customers.length > 0 && nowServing > 0) {
      setCustomers(prev =>
        prev.map(c => ({
          ...c,
          isActive: !c.isSkipped && c.tokenNumber === nowServing,
        }))
      );
    }
  }, [nowServing]);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const renderCustomer = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.customerItem}>
        <CheckBox
          isChecked={isSelected}
          onClick={() => toggleSelect(item.id)}
          checkBoxColor={isSelected ? colors.primary : colors.gray}
        />
        <View style={styles.customerDetails}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerService}>{item.service}</Text>
          <Text style={styles.waitTime}>
            Token: {item.tokenNumber} | Wait Time: {item.estimatedWait} min
          </Text>
          {item.isSkipped && (
            <Text style={styles.skippedBadge}>Skipped - Waiting for Arrival</Text>
          )}
          {item.isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>Arrived</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderLastRecord = ({ item }) => (
    <View style={styles.lastRecord}>
      <Text style={{ color: '#fff', flex: 1 }}>
        Token {item.tokenNumber} - {item.status} ({item.name})
      </Text>
      {item.status === 'SKIPPED' && (
        <TouchableOpacity onPress={() => recoverToken(item)} style={styles.recoverButton}>
          <Text style={styles.recoverText}>Recover</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  if (loading) {
    return (
      <SafeAreaView style={[AppStyles.root]}>
        <ActivityIndicator size="large" color={colors.primary} style={AppStyles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.servingContainer}>
            <View style={styles.servingcount}>
              <Text style={styles.label}>Now Serving</Text>
              <Text style={styles.number}>{nowServing}</Text>
            </View>
          </View>
          <View style={styles.issuedContainer}>
            <Text style={styles.label}>Last Issued</Text>
            <Text style={styles.number}>{lastIssued}</Text>
          </View>
        </View>
        <Text style={styles.customersTitle}>Customers in Queue</Text>
        <FlatList
          data={customers.slice(0, 3)}
          renderItem={renderCustomer}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.noCustomers}>No customers to serve</Text>}
          scrollEnabled={false}
        />

        {lastRecords.length > 0 && (
          <View style={styles.lastRecords}>
            <Text style={styles.recordsTitle}>Skipped token</Text>
            <FlatList
              data={lastRecords}
              renderItem={renderLastRecord}
              keyExtractor={(item, index) => index.toString()}
              style={styles.recordList}
              scrollEnabled={false}
            />
          </View>
        )}
        {completedHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>
              Completed History (Served Today) - {completedHistory.length}
            </Text>

            {/* Always show the most recent (latest) served token */}
            {completedHistory[0] && (
              <View style={styles.historyItem}>
                <Text style={styles.historyToken}>
                  Token {completedHistory[0].tokenNumber} - {completedHistory[0].name}
                </Text>
                <Text style={styles.historyTime}>
                  Served at{' '}
                  {new Date(completedHistory[0].completedAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </View>
            )}

            {/* Expandable "More..." section */}
            {completedHistory.length > 1 && (
              <View>
                <TouchableOpacity
                  onPress={() => setShowMore(prev => !prev)}
                  style={styles.moreButton}
                >
                  <Text style={styles.moreText}>
                    {showMore ? 'Hide' : 'More…'} ({completedHistory.length - 1} previous)
                  </Text>
                </TouchableOpacity>

                {/* Show older tokens when expanded */}
                {showMore && (
                  <View style={styles.expandedHistory}>
                    <FlatList
                      data={completedHistory.slice(1)} // All except the latest
                      keyExtractor={item => item.id.toString()}
                      scrollEnabled={false}
                      renderItem={({ item }) => (
                        <View style={styles.historyItem}>
                          <Text style={styles.historyToken}>
                            Token {item.tokenNumber} - {item.name}
                          </Text>
                          <Text style={styles.historyTime}>
                            Served at{' '}
                            {new Date(item.completedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <View>
        <Text style={styles.textcount}>Total Tokens in Queue:{customers.length}</Text>
      </View>
      <View style={styles.queuingControls}>
        <TouchableOpacity style={styles.buttonGreen} onPress={callNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRed} onPress={skip}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

Servicing.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
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
    headerRight: ({ route }) => {
      const role = route?.params?.role;
      if (role === 'desk') {
        return null;
      }
      return (
        <HeaderButton
          type={1}
          iconName={'close-circle'}
          color={colors.primary}
          isFeather={false}
          iconType={'ionic'}
          onPress={() => navigation.goBack()}
        />
      );
    },
    headerStyle: { elevation: 0 },
  });
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  servingContainer: {
    alignItems: 'center',
  },
  issuedContainer: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: colors.gray,
  },
  servingcount: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  customersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    color: colors.primary,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  customerDetails: {
    flex: 1,
    marginLeft: 10,
  },
  customerName: {
    fontSize: 16,
    color: '#fff',
  },
  customerService: {
    fontSize: 14,
    color: '#fff',
  },
  waitTime: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 5,
  },
  list: {
    paddingHorizontal: 20,
  },
  noCustomers: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  queuingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  fixedBottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    elevation: 10,
    zIndex: 1000,
  },
  moreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    marginTop: 4,
  },
  moreText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },
  expandedHistory: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  buttonRed: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastRecords: {
    padding: 10,
  },
  recordsTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },

  recordList: {
    marginTop: 5,
  },
  lastRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  recoverButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  recoverText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    padding: 20,
    fontSize: 18,
  },
  skippedBadge: {
    fontSize: 12,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: 'green',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonGreen: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  historySection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  historyTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#222',
    padding: 12,
    marginVertical: 4,
    borderRadius: 10,
    borderLeftWidth: 2.5,
    borderLeftColor: colors.primary,
  },
  historyToken: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  historyTime: {
    color: '#4CAF50',
    fontSize: 11,
    marginTop: 4,
  },
  buttonGray: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    marginRight: 10,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textcount: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Servicing);