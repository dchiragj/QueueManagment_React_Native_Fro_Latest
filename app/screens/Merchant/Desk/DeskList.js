import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AppStyles from '../../../styles/AppStyles';
import colors from '../../../styles/colors';
import Icon from '../../../components/Icon';
import { getDeskList, deleteDesk } from '../../../services/apiService';
import screens from '../../../constants/screens';

const DeskList = () => {
    const navigation = useNavigation();
    const [desks, setDesks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchDesks = async () => {
        try {
            setError(null);
            const res = await getDeskList();
            console.log(res);
            setDesks(res.data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDesks();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchDesks();
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Desk",
            "Are you sure you want to delete this desk?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDesk(id);
                            fetchDesks();
                        } catch (err) {
                            Alert.alert("Error", err.message);
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = (item) => {
        navigation.navigate(screens.AddDesk, { desk: item });
    };

    const handleAddDesk = () => {
        navigation.navigate(screens.AddDesk);
    };

    const renderDeskItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Icon name="monitor" type="feather" size={20} color={colors.white} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.deskName} numberOfLines={1}>
                        {item?.name || 'Desk Name'}
                    </Text>
                    <Text style={styles.categoryName}>
                        {item?.category_name || 'General'}
                    </Text>
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                        <Icon name="edit-2" type="feather" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                        <Icon name="trash-2" type="feather" size={18} color={colors.red} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Icon name="mail" type="feather" size={14} color={colors.dustRodeo} />
                    <Text style={styles.infoText} numberOfLines={1}>
                        {item?.email || 'No email associated'}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="activity" type="feather" size={14} color={colors.dustRodeo} />
                    <Text style={[styles.infoText, { color: item?.status === 1 ? '#4CAF50' : colors.dustRodeo }]}>
                        {item?.status === 1 ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={AppStyles.root}>
            <View style={styles.contentContainer}>
                {loading && !refreshing ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error ? (
                    <View style={styles.centerContainer}>
                        <Text style={{ color: colors.red }}>{error}</Text>
                        <TouchableOpacity onPress={fetchDesks} style={{ marginTop: 10 }}>
                            <Text style={{ color: colors.primary }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={desks}
                        renderItem={renderDeskItem}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Icon name="monitor" type="feather" size={40} color={colors.dustRodeo} />
                                <Text style={styles.emptyText}>No desks found.</Text>
                                <Text style={styles.emptySubText}>Add your first desk to start serving queues.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            <TouchableOpacity style={styles.fab} onPress={handleAddDesk}>
                <Icon name="plus" type="feather" size={28} color={colors.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.inputBackgroundColor,
        borderRadius: 16,
        padding: 16,
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
        backgroundColor: 'rgba(255, 106, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deskName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    categoryName: {
        fontSize: 12,
        color: colors.primary,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionBtn: {
        padding: 8,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#2E3650',
        marginBottom: 12,
    },
    cardBody: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        color: colors.lightWhite,
        fontSize: 13,
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
        zIndex: 999, // Ensure it sit
    },
});

export default DeskList;
