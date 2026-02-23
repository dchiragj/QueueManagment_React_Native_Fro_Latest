import colors from '../../../styles/colors';
import AppStyles from '../../../styles/AppStyles';
import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, Alert, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import MyQueueListItem from './MyQueueListItem';
import { getCategories, getQueueList, getTokenCounts } from '../../../services/apiService';
import screens from '../../../constants/screens';
import { verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBranch } from '../../../context/BranchContext';

const MyQueue = ({ navigation, route }) => {
  const params = route.params || {};
  const { selectedBranchId } = useBranch();
  const [queues, setQueues] = useState(params.queues || []);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);


  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'running';
      case 2:
        return 'running';
      case 4:
        return 'cancel';
      default:
        return 'unknown';
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res?.data?.map((c) => ({ text: c.name, value: c.id }));
      setCategories(list);
    } catch (err) {
      
      setCategories([]);
    }
  };

  const fetchQueueList = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchParams = {};
      if (params.businessId) {
        fetchParams.businessId = params.businessId;
      } else if (selectedBranchId !== 'all') {
        fetchParams.businessId = selectedBranchId;
      }
      const queueRes = await getQueueList(fetchParams);
      let queueData = queueRes.data || [];

      const tokenCountsParams = selectedBranchId !== 'all' ? selectedBranchId : null;
      const tokenData = await getTokenCounts(tokenCountsParams);

      const tokenMap = {};
      tokenData.forEach(t => {
        tokenMap[t.id] = t.tokenCount;
      });

      queueData.sort((a, b) =>
        new Date(b.start_date || b.created_at || 0) -
        new Date(a.start_date || a.created_at || 0)
      );

      if (params.queues?.length > 0) {
        const unique = params.queues.filter(q => !queueData.some(x => x.id === q.id));
        queueData = [...unique, ...queueData];
      }

      const updatedQueues = queueData.map(queue => ({
        ...queue,
        tokenCount: tokenMap[queue.id] || 0
      }));

      setQueues(updatedQueues);

    } catch (e) {
      
      setError(e.message || 'Unable to fetch queue list');
    } finally {
      setLoading(false);
    }
  };

  const onrefresh = async () => {
    setRefreshing(true);
    await fetchQueueList();
    setRefreshing(false);
  }

  const filterQueues = (tab) => {
    let updatedQueues = [...queues];
    if (tab === 'all') {
      setFilteredQueues(updatedQueues);
    } else {
      const tabStatus = tab === 'running' ? 1 : tab === 'cancel' ? 4 : null;
      if (tabStatus !== null) {
        setFilteredQueues(updatedQueues.filter((queue) => queue.status === tabStatus));
      } else {
        setFilteredQueues(updatedQueues);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchQueueList();
  }, [params.queues, params.businessId, selectedBranchId]);

  useEffect(() => {
    filterQueues(activeTab);
  }, [activeTab, queues]);

  const renderQueueItem = ({ item }) => {
    const categoryName =
      categories?.find((c) => c.value.toString() === item.category.toString())?.text || 'Unknown Category';
    const statusLabel = getStatusLabel(item.status);

    return (
      <MyQueueListItem
        name={item.name || 'Unnamed Queue'}
        category={categoryName}
        categoryid={item.category}
        date={
          item.start_date
            ? new Date(item.start_date).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
            : 'No Date'
        }
        desks={item.desks?.length > 0 ? item.desks.map(d => d.name).join(', ') : item.Desk || '0'}
        people={item.tokenCount || 0}
        navigation={navigation}
        item={item}
        status={statusLabel}
        onDeleteQueue={fetchQueueList}
      />
    );
  };

  const renderTab = (tabName, label) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tabName ? styles.activeTab : styles.inactiveTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName ? styles.activeTabText : styles.inactiveTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
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
      {}


      <FlatList
        data={filteredQueues}
        renderItem={renderQueueItem}
        refreshing={refreshing}
        onRefresh={onrefresh}
        keyExtractor={(item) => item.id?.toString()}

        ListEmptyComponent={
          error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.noDataText}>No queues available</Text>
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  list: {
    paddingVertical: verticalScale(10),
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  noDataText: {
    color: colors.lightWhite,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
  addQueueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.inputBackgroundColor,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  addQueueText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(5),
    backgroundColor: colors.backgroundColor,
  },
  tab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: verticalScale(16),
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  inactiveTab: {
    backgroundColor: colors.gray,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.white,
  },
  inactiveTabText: {
    color: colors.black,
  },
});

export default MyQueue;