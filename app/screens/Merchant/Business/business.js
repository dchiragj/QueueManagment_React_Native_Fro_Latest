import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AppStyles from '../../../styles/AppStyles';
import colors from '../../../styles/colors';
import Icon from '../../../components/Icon';
import { getBusinessList } from '../../../services/apiService';
import screens from '../../../constants/screens';

const Business = () => {
  const navigation = useNavigation();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinesses = async () => {
    try {
      setError(null);
      const data = await getBusinessList();
      setBusinesses(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBusinesses();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBusinesses();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderBusinessItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon name="briefcase" type="feather" size={20} color={colors.white} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.businessName} numberOfLines={1}>
            {item?.businessName || 'Business Name'}
          </Text>
          <Text style={styles.businessType}>
            {item?.businessType || 'Retail'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="map-pin" type="feather" size={14} color={colors.dustRodeo} />
          <Text style={styles.infoText} numberOfLines={1}>
            {item?.businessAddress || 'No address provided'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="phone" type="feather" size={14} color={colors.dustRodeo} />
          <Text style={styles.infoText}>
            {item?.businessPhoneNumber || '-'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="file-text" type="feather" size={14} color={colors.dustRodeo} />
          <Text style={styles.infoText}>
            Reg: {item?.businessRegistrationNumber || '-'}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Created: {formatDate(item?.createdAt)}</Text>
      </View>
    </View>
  );

  const handleAddBranch = () => {
    navigation.navigate(screens.AddBranch);
  };

  const ListHeader = () => (
    <></>
    // <View style={styles.header}>
    //   <Text style={styles.headerTitle}>My Businesses</Text>
    //   <Text style={styles.headerSubtitle}>Manage your branches and shops</Text>
    // </View>
  );

  return (
    <SafeAreaView style={AppStyles.root}>
      <View style={styles.contentContainer}>
        {loading && !refreshing ? (
          <View style={styles.centerContainer}>
            <Text style={{ color: colors.white }}>Loading...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={{ color: colors.error }}>{error}</Text>
            <TouchableOpacity onPress={fetchBusinesses} style={{ marginTop: 10 }}>
              <Text style={{ color: colors.primary }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={businesses}
            renderItem={renderBusinessItem}
            keyExtractor={(item) => item.id || Math.random().toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="frown" type="feather" size={40} color={colors.dustRodeo} />
                <Text style={styles.emptyText}>No businesses found.</Text>
                <Text style={styles.emptySubText}>Add your first branch to get started.</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddBranch}>
        <Icon name="plus" type="feather" size={28} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.dustRodeo,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.white,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubText: {
    color: colors.dustRodeo,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.inputBackgroundColor, // Using a darker card bg
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2E3650',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 106, 0, 0.15)', // Primary color with opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  businessType: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#2E3650',
    marginBottom: 12,
  },
  cardBody: {
    marginBottom: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: colors.lightWhite, // Use a lighter gray
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateText: {
    fontSize: 11,
    color: colors.white,
  },
  fab: {
    position: 'absolute',
    bottom: 50, // Increased to avoid navigation bar overlap
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999, // Ensure it sits on top of other content
  },
});

export default Business;