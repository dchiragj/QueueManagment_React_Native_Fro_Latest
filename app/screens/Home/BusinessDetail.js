
import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import TextView from '../../components/TextView/TextView';
import AppStyles from '../../styles/AppStyles';
import { colors } from '../../styles';
import { getQueuesByBusiness, checkToken } from '../../services/apiService';
import screens from '../../constants/screens';
import Loading from '../../components/Loading';

const BusinessDetail = ({ route, navigation }) => {
    const { business } = route.params;
    const [queues, setQueues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchQueues();
    }, []);

    const fetchQueues = async () => {
        try {
            const res = await getQueuesByBusiness(business.id);
            setQueues(res?.data || []);
        } catch (error) {
            console.error('Error fetching queues:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load queues',
            });
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchQueues();
    };

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                return status === RESULTS.GRANTED;
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'We need your location to join this queue.',
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (err) {
            return false;
        }
    };

    const handleQueuePress = async (queue) => {
        setIsLoading(true);
        try {
            let payload = { joinMethods: queue.joinMethods, queueId: queue.id, categoryId: queue.category };

            if (queue.joinMethods === 'location') {
                const hasPermission = await requestLocationPermission();
                if (hasPermission) {
                    const position = await new Promise((resolve, reject) => {
                        Geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 10000,
                        });
                    });
                    payload.lat = position.coords.latitude;
                    payload.long = position.coords.longitude;
                } else {
                    throw new Error('Location permission is required for this queue.');
                }
            }

            const tokenCheckResponse = await checkToken(payload);

            if (
                tokenCheckResponse.status === 200 &&
                tokenCheckResponse.data?.data &&
                tokenCheckResponse.data.status === 'ok'
            ) {
                // Navigate to token details if already joined
                navigation.navigate(screens.MyToken, {
                    tokenDetails: tokenCheckResponse.data.data
                });
            } else {
                // Navigate to Generate Token screen
                navigation.navigate(screens.GenerateToken, {
                    queueData: {
                        queueId: queue.id,
                        category: queue.category,
                        queueName: queue.name,
                        businessName: business.businessName,
                    }
                });
            }
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: e.message || 'Could not load queue',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderQueueItem = ({ item }) => (
        <TouchableOpacity
            style={s.queueCard}
            onPress={() => handleQueuePress(item)}
        >
            <View style={s.queueIcon}>
                <Icon name="queue" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <TextView text={item.name} type="body-head" color={colors.white} />
                <TextView
                    text={`${item.totalTokens || 0} people in line`}
                    type="tiny"
                    color={colors.lightWhite}
                    style={{ marginTop: 4 }}
                />
            </View>
            <Icon name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[AppStyles.root, { backgroundColor: '#0F121E' }]}>
            <StatusBar barStyle="light-content" />
            {isLoading && <Loading isTransparent={true} />}

            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <Icon name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <TextView text="Business Details" type="body-head" color={colors.white} style={{ flex: 1, textAlign: 'center', marginRight: 40 }} />
            </View>

            <View style={s.container}>
                {/* Business Info Card */}
                <View style={s.businessCard}>
                    <View style={s.businessHeader}>
                        <View style={s.iconWrapper}>
                            <Icon name="store" size={30} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <TextView text={business.businessName} type="title" color={colors.white} />
                            <TextView text={business.businessType || 'Retail'} type="caption" color={colors.primary} />
                        </View>
                    </View>

                    <View style={s.divider} />

                    <View style={s.infoRow}>
                        <Icon name="location-on" size={18} color={colors.lightWhite} />
                        <TextView
                            text={business.businessAddress}
                            type="body"
                            color={colors.lightWhite}
                            style={s.infoText}
                        />
                    </View>

                    {business.businessPhoneNumber ? (
                        <View style={s.infoRow}>
                            <Icon name="phone" size={18} color={colors.lightWhite} />
                            <TextView text={business.businessPhoneNumber} type="body" color={colors.lightWhite} style={s.infoText} />
                        </View>
                    ) : null}
                </View>

                <TextView text="Available Queues" type="body-head" color={colors.white} style={s.sectionTitle} />

                <FlatList
                    data={queues}
                    renderItem={renderQueueItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                    ListEmptyComponent={
                        !isLoading && (
                            <View style={s.emptyState}>
                                <Icon name="event-busy" size={50} color={colors.lightWhite} />
                                <TextView text="No active queues for this business" type="body" color={colors.lightWhite} style={{ marginTop: 10 }} />
                            </View>
                        )
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(15),
        paddingHorizontal: scale(10),
    },
    backBtn: {
        padding: 10,
    },
    businessCard: {
        backgroundColor: '#1C2234',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#2E3650',
    },
    businessHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 107, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#2E3650',
        marginVertical: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    infoText: {
        marginLeft: 10,
        flex: 1,
    },
    sectionTitle: {
        marginTop: 30,
        marginBottom: 15,
    },
    queueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C2234',
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2E3650',
    },
    queueIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 107, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
});

export default BusinessDetail;
