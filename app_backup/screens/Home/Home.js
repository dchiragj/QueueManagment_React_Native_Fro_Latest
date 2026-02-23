import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Modal,
  Alert,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import TextView from '../../components/TextView/TextView';
import AppStyles from '../../styles/AppStyles';
import { colors } from '../../styles';
import screens from '../../constants/screens';
import ScrollableAvoidKeyboard from '../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import Input from '../../components/Input';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import { borderRadius } from '../../styles/dimensions';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  checkToken,
  generateToken,
  getCategories,
  getQueueList,
  getDeskList,
  getMerchantAnalytics,
  sendBroadcast,
  getQueueDetails
} from '../../services/apiService';
import { Button } from '../../components/Button';
import Card from '../../components/Card';
import Toast from 'react-native-toast-message';
import { useBranch } from '../../context/BranchContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RefreshControl, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';

// Vision Camera Imports (built-in QR support)
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Loading from '../../components/Loading';

const Home = (props) => {
  let { user } = props.auth;
  const [isScanning, setIsScanning] = useState(false);
  const [qrDetails, setQrDetails] = useState(null);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState(''); // "lat,lng"
  const [joinMethod, setJoinMethod] = useState(null);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const { selectedBranchId, activeBranch, businesses } = useBranch();
  const [refreshing, setRefreshing] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [dashCounts, setDashCounts] = useState({
    queues: 0,
    desks: 0,
    branches: businesses.length,
    totalCompleted: 0,
    totalPending: 0,
    avgWaitTime: '0 min',
    weeklyTrend: [],
    recentHistory: [],
  });


  const fetchDashCounts = async () => {
    if (user?.role === 'customer') return;

    try {
      const fetchParams = { businessId: selectedBranchId !== 'all' ? selectedBranchId : undefined };

      const [queueRes, deskRes, analyticsRes] = await Promise.all([
        getQueueList(fetchParams),
        getDeskList(fetchParams),
        getMerchantAnalytics(selectedBranchId !== 'all' ? selectedBranchId : 'all')
      ]);

      const summary = analyticsRes?.data?.summary || {};

      setDashCounts({
        queues: queueRes?.data?.length || 0,
        desks: deskRes?.data?.length || 0,
        branches: businesses.length,
        totalCompleted: summary.totalCompleted || summary.totalServed || 0,
        totalPending: summary.totalPending || 0,
        avgWaitTime: summary.avgWaitTime || '0 min',
        weeklyTrend: analyticsRes?.data?.weeklyTrend || [],
        recentHistory: analyticsRes?.data?.history || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashCounts();
  };

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    try {
      await sendBroadcast({
        businessId: selectedBranchId !== 'all' ? selectedBranchId : undefined,
        message: broadcastMessage
      });
      Toast.show({
        type: 'success',
        text1: 'Broadcast Sent',
        text2: 'All active customers have been notified.'
      });
      setBroadcastModal(false);
      setBroadcastMessage('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to broadcast',
        text2: error.message
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'customer') {
      fetchDashCounts();
    }
  }, [selectedBranchId, businesses]);

  const getGreeting = () => {
    const hour = moment().hour();
    if (hour < 12) return { text: "Good Morning", icon: "wb-sunny", color: "#f1c40f" };
    if (hour < 17) return { text: "Good Afternoon", icon: "sunny", color: "#FF6B00" };
    return { text: "Good Evening", icon: "nights-stay", color: "#9b59b6" };
  };

  const tabs = user?.role === 'customer'
    ? [
      { key: 'private', label: 'Invite Code', icon: 'confirmation-number' },
      { key: 'link', label: 'Link', icon: 'link' },
      { key: 'location', label: 'Location', icon: 'location-on' },
      { key: 'qr', label: 'QR Code', icon: 'qr-code-scanner' },
    ]
    : [];


  useEffect(() => {
    props.navigation.setParams({ openDrawer: _openDrawer });

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const res = await getCategories();
        const list = res?.data?.map((c) => ({
          text: c.name,
          value: c.id,
        }));
        setCategories(list);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Alert.alert('Error', 'Failed to load categories.');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const _openDrawer = () => {
    props.navigation.openDrawer();
    setQrDetails(null);
  };

  const onPressHome = () => {
    props.navigation.navigate(screens.Categories);
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  };

  const requestCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      let status = await check(permission);
      if (status !== RESULTS.GRANTED) {
        status = await request(permission);
      }
      return status === RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      showToast('error', 'Permission Error', 'Failed to access camera');
      return false;
    }
  };

  const clearInputs = () => {
    setJoinCode('');
    setLink('');
    setLocation('');
    setQrDetails(null);
    setTokenDetails(null);
  };

  const handleTabPress = async (tab) => {
    setActiveTab(tab);
    setJoinMethod(tab);
    if (tab === 'qr') {
      const granted = await requestCameraPermission();
      if (granted) {
        setIsScanning(true);
      }
    }
  };

  const processJoin = async (qrData) => {
    setIsLoading(true);
    try {

      let payload = { joinMethods: joinMethod };

      switch (joinMethod) {
        case 'private':
          payload.joinCode = joinCode;
          break;
        case 'link':
          payload.link = link;
          break;
        case 'location':
          const [latStr, longStr] = location.split(',');
          const lat = parseFloat(latStr?.trim());
          const long = parseFloat(longStr?.trim());
          if (isNaN(lat) || isNaN(long)) {
            throw new Error('Enter valid lat,long (e.g., 23.12,72.57)');
          }
          payload.lat = lat;
          payload.long = long;
          break;
        case 'qr':
          if (!qrData?.queueId || !qrData?.category) {
            throw new Error('QR code missing queueId or category');
          }
          payload.queueId = qrData.queueId;
          payload.categoryId = qrData.category;
          break;
        default:
          throw new Error('Invalid join method');
      }

      const tokenCheckResponse = await checkToken(payload);

      if (tokenCheckResponse.status === 200 && tokenCheckResponse.data?.data && tokenCheckResponse.data.status === "ok") {
        setTokenDetails(tokenCheckResponse.data.data);
        showToast(
          'info',
          'Token Already Generated',
          `You already have a token, your token number is ${tokenCheckResponse.data.data.tokenNumber}`
        );
        clearInputs();
        setActiveTab();
        setQrDetails(null);
      } else {
        setQrDetails(tokenCheckResponse.data.data);
        showToast('info', 'No Token', 'Please press "Generate Token" to create a new token.');
      }
    } catch (error) {
      console.error('Error processing QR code:', error.message, error.response?.data);
      showToast('error', 'Scan Failed', error.message || 'Could not process QR code');
      setIsScanning(false);
    } finally {
      setIsLoading(false);
    }
  };
  const onScanSuccess = async (e) => {
    try {
      const data = e.data || e.rawValue;
      if (!data) throw new Error('Empty QR code');

      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        throw new Error('QR code is not valid JSON');
      }

      setIsScanning(false);
      await processJoin(parsed);
    } catch (error) {
      showToast('error', 'Scan Failed', error.message);
      setIsScanning(false);
    }
  };

  const onPressGenerateToken = async () => {
    setIsLoading(true);
    try {
      if (!qrDetails) {
        Alert.alert('Error', 'No queue data. Scan QR code first.');
        return;
      }

      // Fetch latest queue details to check limit
      const queueDetailsRes = await getQueueDetails(qrDetails.queueId);
      const queueData = queueDetailsRes?.data?.queue;
      const currentTokens = queueDetailsRes?.data?.tokens || [];
      const endNumber = parseInt(queueData?.end_number || 0);

      if (endNumber > 0 && currentTokens.length >= endNumber) {
        showToast(
          'error',
          'Token Limit Reached',
          'You cannot generate a token now, the token limit has been reached.'
        );
        setQrDetails(null);
        clearInputs();
        setActiveTab(null);
        return;
      }

      const res = await generateToken({
        queueId: qrDetails.queueId,
        categoryId: qrDetails.category,
      });
      if (res.status === 'ok' && res.data) {
        setTokenDetails(res.data);
        showToast(
          'success',
          'Token Generated!',
          `Your token number is ${res.data.tokenNumber} 🎉`
        );
        setQrDetails(null);
        clearInputs();
        setActiveTab(null);
      } else {
        throw new Error(res.message || 'Failed');
      }
    } catch (error) {
      showToast('error', 'Failed', error.message || 'Could not generate token');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categories || categoryId == null) return 'Unknown';
    const cat = categories.find((c) => c.value === Number(categoryId));
    return cat ? cat.text : 'Unknown';
  };

  // Built-in Vision Camera QR Scanner (no external deps)
  const VisionQRScanner = () => {
    const device = useCameraDevice('back');

    const codeScanner = useCodeScanner({
      codeTypes: ['qr'],
      onCodeScanned: (codes) => {
        // Scan once and close
        if (codes.length > 0 && codes[0]?.value) {
          onScanSuccess({ data: codes[0].value });
        }
      },
    });

    if (device == null) {
      return (
        <View style={styles.noCamera}>
          <TextView text="No camera available" color="white" />
        </View>
      );
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
          photo={false}
          video={false}
        />
        {/* Scan Frame Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <TextView
            text="Point camera at QR code"
            color="white"
            type="body-one"
            style={styles.scanText}
          />
        </View>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => setIsScanning(false)}>
          <TextView text="✕ Close" color="white" type="body" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {isLoading && <Loading isTransparent={true} />}
      <SafeAreaView style={[AppStyles.root]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollableAvoidKeyboard
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {user?.role === 'customer' && (
            <Input placeholder="Search Shop Here" isIconLeft leftIconName="search" color={colors.white} />
          )}
          {tabs.length > 0 && (
            <View style={s.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => handleTabPress(tab.key)}
                  style={[s.tab, activeTab === tab.key && s.activeTab]}
                >
                  <Icon
                    name={tab.icon}
                    size={20}
                    color={activeTab === tab.key ? colors.white : colors.lightWhite}
                    style={{ marginBottom: 4 }}
                  />
                  <TextView
                    text={tab.label}
                    color={activeTab === tab.key ? colors.white : colors.lightWhite}
                    type="tiny"
                    style={{ fontWeight: activeTab === tab.key ? '700' : '500' }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {user?.role === 'merchant' && (
            <View style={s.dashboardContainer}>
              {/* PREMIUM HEADER SECTION */}
              <View style={s.merchantHeader}>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={getGreeting().icon} size={16} color={getGreeting().color} style={{ marginRight: 5 }} />
                    <TextView
                      text={`${getGreeting().text},`}
                      type="caption"
                      color={colors.lightWhite}
                    />
                  </View>
                  <TextView
                    text={user?.name || 'Merchant'}
                    type="title"
                    color={colors.white}
                    style={s.name}
                  />
                </View>
                <View style={s.branchBadge}>
                  <Icon name="store" size={16} color={colors.primary} />
                  <TextView
                    text={selectedBranchId === 'all' ? "All Branches" : (activeBranch?.businessName || 'Main Store')}
                    type="tiny"
                    color={colors.white}
                    style={s.branchBadgeText}
                  />
                </View>
              </View>

              <View style={s.sectionHeader}>
                <TextView text="Quick Actions" type="body-head" color={colors.white} />
              </View>

              <View style={s.quickActionsRow}>
                <TouchableOpacity style={s.actionBtn} onPress={() => props.navigation.navigate(screens.MyQueueRoot)}>
                  <View style={[s.actionIcon, { backgroundColor: 'rgba(255, 107, 0, 0.1)' }]}>
                    <Icon name="queue" size={20} color={colors.primary} />
                  </View>
                  <TextView text="Queues" type="tiny" color={colors.white} />
                </TouchableOpacity>

                <TouchableOpacity style={s.actionBtn} onPress={() => props.navigation.navigate(screens.DeskList)}>
                  <View style={[s.actionIcon, { backgroundColor: 'rgba(52, 152, 219, 0.1)' }]}>
                    <Icon name="desktop-windows" size={20} color="#3498db" />
                  </View>
                  <TextView text="Desks" type="tiny" color={colors.white} />
                </TouchableOpacity>

                <TouchableOpacity style={s.actionBtn} onPress={() => props.navigation.navigate(screens.Business)}>
                  <View style={[s.actionIcon, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
                    <Icon name="store" size={20} color={colors.success} />
                  </View>
                  <TextView text="Branches" type="tiny" color={colors.white} />
                </TouchableOpacity>

                <TouchableOpacity style={s.actionBtn} onPress={() => setBroadcastModal(true)}>
                  <View style={[s.actionIcon, { backgroundColor: 'rgba(155, 89, 182, 0.1)' }]}>
                    <Icon name="campaign" size={20} color="#9b59b6" />
                  </View>
                  <TextView text="Broadcast" type="tiny" color={colors.white} />
                </TouchableOpacity>
              </View>

              <View style={s.sectionHeader}>
                <TextView text="Business Summary" type="body-head" color={colors.white} />
                <TextView text="Today's live metrics" type="tiny" color={colors.lightWhite} />
              </View>

              <View style={s.statsGrid}>
                {/* COMPLETED TOKENS CARD */}
                <View style={[s.statCard, s.completedCard]}>
                  <View style={s.cardIconContainer}>
                    <Icon name="check-circle" size={24} color={colors.success} />
                  </View>
                  <View>
                    <TextView text="Served" type="tiny" color={colors.lightWhite} />
                    <TextView text={String(dashCounts.totalCompleted)} type="title" color={colors.white} style={s.statValue} />
                  </View>
                </View>

                {/* PENDING TOKENS CARD */}
                <View style={[s.statCard, s.pendingCard]}>
                  <View style={s.cardIconContainer}>
                    <Icon name="timer" size={24} color={colors.primary} />
                  </View>
                  <View>
                    <TextView text="Waiting" type="tiny" color={colors.lightWhite} />
                    <TextView text={String(dashCounts.totalPending)} type="title" color={colors.white} style={s.statValue} />
                  </View>
                </View>

                {/* ACTIVE QUEUES CARD */}
                <View style={[s.statCard, s.queuesCard]}>
                  <View style={s.cardIconContainer}>
                    <Icon name="list" size={24} color="#3498db" />
                  </View>
                  <View>
                    <TextView text="Queues" type="tiny" color={colors.lightWhite} />
                    <TextView text={String(dashCounts.queues)} type="title" color={colors.white} style={s.statValue} />
                  </View>
                </View>

                {/* TOTAL DESKS CARD */}
                <View style={[s.statCard, s.desksCard]}>
                  <View style={s.cardIconContainer}>
                    <Icon name="desktop-windows" size={24} color="#f1c40f" />
                  </View>
                  <View>
                    <TextView text="Desks" type="tiny" color={colors.lightWhite} />
                    <TextView text={String(dashCounts.desks)} type="title" color={colors.white} style={s.statValue} />
                  </View>
                </View>

                {/* TOTAL BRANCHES CARD */}
                <View style={[s.statCard, s.branchesCard]}>
                  <View style={s.cardIconContainer}>
                    <Icon name="store" size={24} color="#9b59b6" />
                  </View>
                  <View>
                    <TextView text="Branches" type="tiny" color={colors.lightWhite} />
                    <TextView text={String(dashCounts.branches)} type="title" color={colors.white} style={s.statValue} />
                  </View>
                </View>

                {/* AVG WAIT TIME CARD */}
                <View style={[s.statCard, s.waitCard]}>
                  <View style={s.cardIconContainer}>
                    <Icon name="access-time" size={24} color="#e74c3c" />
                  </View>
                  <View>
                    <TextView text="Avg Wait" type="tiny" color={colors.lightWhite} />
                    <TextView text={dashCounts.avgWaitTime} type="title" color={colors.white} style={s.statValue} />
                  </View>
                </View>
              </View>

              {/* WEEKLY PERFORMANCE CHART */}
              {dashCounts.weeklyTrend && dashCounts.weeklyTrend.length > 0 && (
                <View style={s.chartContainer}>
                  <TextView text="Weekly Performance (Tokens Served)" type="button-text" color={colors.white} style={s.chartTitle} />

                  {dashCounts.weeklyTrend.reduce((acc, curr) => acc + curr.count, 0) > 0 ? (
                    <BarChart
                      data={{
                        labels: dashCounts.weeklyTrend.map(d => d.day),
                        datasets: [
                          {
                            data: dashCounts.weeklyTrend.map(d => d.count),
                          },
                        ],
                      }}
                      width={Dimensions.get("window").width - scale(60)}
                      height={200}
                      yAxisLabel=""
                      yAxisSuffix=""
                      withInnerLines={false}
                      fromZero
                      showValuesOnTopOfBars
                      chartConfig={{
                        backgroundColor: "transparent",
                        backgroundGradientFrom: colors.inputBackgroundColor,
                        backgroundGradientTo: colors.inputBackgroundColor,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
                        barPercentage: 0.5,
                        propsForBackgroundLines: {
                          strokeWidth: 0,
                        },
                      }}
                      style={{
                        marginVertical: 8,
                        borderRadius: 16,
                      }}
                    />
                  ) : (
                    <View style={s.noDataContainer}>
                      <Icon name="insert-chart" size={40} color="rgba(255,255,255,0.2)" />
                      <TextView
                        text="No tokens served yet this week"
                        type="caption"
                        color={colors.lightWhite}
                        style={{ marginTop: 10 }}
                      />
                      <TextView
                        text="Complete sessions at the Desk to see your progress here."
                        type="tiny"
                        color="rgba(255,255,255,0.4)"
                        style={{ marginTop: 5, textAlign: 'center' }}
                      />
                    </View>
                  )}
                </View>
              )}

              {/* RECENT ACTIVITY SECTION */}
              {dashCounts.recentHistory && dashCounts.recentHistory.length > 0 && (
                <View style={s.activitySection}>
                  <View style={s.sectionHeader}>
                    <TextView text="Recent Activity" type="body-head" color={colors.white} />
                    <TextView text="History" type="tiny" color={colors.lightWhite} />
                  </View>

                  {(showAllHistory ? dashCounts.recentHistory : dashCounts.recentHistory.slice(0, 2)).map((item, index) => (
                    <View key={item.id || index} style={s.activityItem}>
                      <View style={[s.activityIcon, { backgroundColor: item.status === 'COMPLETED' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 107, 0, 0.1)' }]}>
                        <Icon
                          name={item.status === 'COMPLETED' ? "check-circle" : "play-circle-filled"}
                          size={18}
                          color={item.status === 'COMPLETED' ? colors.success : colors.primary}
                        />
                      </View>
                      <View style={s.activityInfo}>
                        <TextView text={`Token #${item.tokenNumber} | ${item.customerName || 'Guest'}`} type="body-head" color={colors.white} />
                        <TextView text={item.queueName || 'General Queue'} type="tiny" color={colors.lightWhite} />
                      </View>
                      <View style={s.activityTime}>
                        <TextView
                          text={moment(item.completedAt || item.updatedAt, "YYYY-MM-DD HH:mm:ss.SSS Z").format('h:mm A')}
                          type="tiny"
                          color={colors.lightWhite}
                        />
                        <TextView
                          text={item.status}
                          type="tiny"
                          style={{ color: item.status === 'COMPLETED' ? colors.success : colors.primary, fontSize: 10, fontWeight: '700' }}
                        />
                      </View>
                    </View>
                  ))}

                  {dashCounts.recentHistory.length > 2 && (
                    <TouchableOpacity
                      style={s.moreButton}
                      onPress={() => setShowAllHistory(!showAllHistory)}
                    >
                      <TextView
                        text={showAllHistory ? "Hide" : `More... (${dashCounts.recentHistory.length - 2} previous)`}
                        type="tiny"
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* BROADCAST MODAL */}
              <Modal
                visible={broadcastModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setBroadcastModal(false)}
              >
                <View style={s.modalOverlay}>
                  <View style={s.broadcastContainer}>
                    <View style={s.modalHeader}>
                      <TextView text="Send Broadcast" type="body-head" color={colors.white} />
                      <TouchableOpacity onPress={() => setBroadcastModal(false)}>
                        <Icon name="close" size={24} color={colors.white} />
                      </TouchableOpacity>
                    </View>

                    <TextView
                      text={`Announce to all active customers in ${activeBranch?.name || 'all branches'}`}
                      type="tiny"
                      color={colors.lightWhite}
                      style={{ marginBottom: 15 }}
                    />

                    <Input
                      placeholder="Type your message here... (e.g. Taking 15 mins break)"
                      multiline
                      numberOfLines={4}
                      value={broadcastMessage}
                      onChangeText={setBroadcastMessage}
                      style={s.broadcastInput}
                      inputStyle={{ height: verticalScale(100), textAlignVertical: 'top' }}
                    />

                    <Button
                      ButtonText={isBroadcasting ? "Sending..." : "Send"}
                      onPress={handleSendBroadcast}
                      isLoading={isBroadcasting}
                      disabled={!broadcastMessage.trim() || isBroadcasting}
                      style={{ marginTop: 20, backgroundColor: colors.primary, borderRadius: 12 }}
                    />
                  </View>
                </View>
              </Modal>

              {/* QUICK START GUIDE FOR MERCHANTS */}
              <View style={s.sectionHeader}>
                <TextView text="Quick Start Guide" type="body-head" color={colors.white} />
                <TextView text="Setup your business in 4 easy steps" type="tiny" color={colors.lightWhite} />
              </View>

              <View style={s.guideContainer}>
                <View style={s.timelineLine} />

                <View style={s.stepItem}>
                  <View style={[s.stepNumber, { backgroundColor: colors.success }]}>
                    <Icon name="business" size={16} color="white" />
                  </View>
                  <View style={s.stepContent}>
                    <TextView text="1. Setup Your Business" type="body-head" color={colors.white} />
                    <TextView text="Add your branches and locations in 'Branch Service' menu." type="caption" color={colors.lightWhite} />
                  </View>
                </View>

                <View style={s.stepItem}>
                  <View style={[s.stepNumber, { backgroundColor: "#3498db" }]}>
                    <Icon name="desktop-windows" size={16} color="white" />
                  </View>
                  <View style={s.stepContent}>
                    <TextView text="2. Configure Desks" type="body-head" color={colors.white} />
                    <TextView text="Assign service counters to each branch in 'Desk Management'." type="caption" color={colors.lightWhite} />
                  </View>
                </View>

                <View style={s.stepItem}>
                  <View style={[s.stepNumber, { backgroundColor: "#f1c40f" }]}>
                    <Icon name="queue" size={16} color="white" />
                  </View>
                  <View style={s.stepContent}>
                    <TextView text="3. Create a Queue" type="body-head" color={colors.white} />
                    <TextView text="Start a new queue and map it to your desks in 'My Queue'." type="caption" color={colors.lightWhite} />
                  </View>
                </View>

                <View style={s.stepItem}>
                  <View style={[s.stepNumber, { backgroundColor: colors.primary }]}>
                    <Icon name="people" size={16} color="white" />
                  </View>
                  <View style={s.stepContent}>
                    <TextView text="4. Serve Customers" type="body-head" color={colors.white} />
                    <TextView text="Share your QR. Customers join and you serve them via Desk." type="caption" color={colors.lightWhite} />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Tab Content */}
          {activeTab === 'private' && (
            <View style={s.inputWrapper}>
              <TextView text="Use Invite Code" type="body-head" color={colors.white} style={s.inputHeading} />
              <Input
                placeholder="Enter 6-digit code"
                value={joinCode}
                onChangeText={setJoinCode}
                keyboardType="numeric"
                maxLength={6}
                style={s.input}
              />
            </View>
          )}
          {activeTab === 'location' && (
            <View style={s.inputWrapper}>
              <TextView text="Join by Location" type="body-head" color={colors.white} style={s.inputHeading} />
              <Input
                placeholder="Enter lat,long (e.g., 23.12,72.57)"
                value={location}
                onChangeText={setLocation}
                style={s.input}
              />
            </View>
          )}
          {activeTab === 'link' && (
            <View style={s.inputWrapper}>
              <TextView text="Join via Link" type="body-head" color={colors.white} style={s.inputHeading} />
              <Input
                placeholder="Enter link https://..."
                value={link}
                onChangeText={setLink}
                style={s.input}
              />
            </View>
          )}
          {activeTab === 'qr' && (
            <View style={s.inputWrapper}>
              <TextView text="Join by QR Scan" type="body-head" color={colors.white} style={s.inputHeading} />
              <TouchableOpacity style={s.qrPlaceholder} onPress={() => handleTabPress('qr')}>
                <Icon name="qr-code-scanner" size={40} color={colors.primary} />
                <TextView text="Tap to Scan QR Code" color={colors.lightWhite} style={{ marginTop: 10 }} />
              </TouchableOpacity>
            </View>
          )}

          {activeTab && activeTab !== 'qr' && (
            <Button
              ButtonText="Check & Join"
              onPress={processJoin}
              isLoading={isLoading}
              disabled={isLoading}
              style={s.SendBut}
            />
          )}

          {/* QR Details Card */}
          {qrDetails && (
            <Card>
              <View style={s.qrDetails}>
                <TextView
                  text={`Queue: ${qrDetails.queueName || 'N/A'}`}
                  color={colors.white}
                  type="body"
                  style={s.profileText}
                />
                <TextView
                  text={`Category: ${isLoadingCategories ? 'Loading...' : getCategoryName(qrDetails.category)}`}
                  color={colors.white}
                  type="body"
                  style={s.profileText}
                />
                <TextView
                  text={`Token Range: ${qrDetails.tokenRange}`}
                  color={colors.white}
                  type="body"
                  style={s.profileText}
                />
                {tokenDetails && (
                  <TextView
                    text={`Your Token: ${tokenDetails.tokenNumber}`}
                    color={colors.primary}
                    type="title"
                    style={[s.profileText, s.token]}
                  />
                )}
                <View style={s.buttonContainer}>
                  <Button
                    onPress={onPressGenerateToken}
                    ButtonText="Generate Token"
                    style={[s.btn, s.generateBtn]}
                    disabled={isLoading || !!tokenDetails}
                  />
                  <Button
                    onPress={() => {
                      setQrDetails(null);
                      setTokenDetails(null);
                    }}
                    ButtonText="Cancel"
                    style={[s.btn, s.cancelBtn]}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </Card>
          )}

          {/* Bottom Content */}
          {user?.role === 'customer' && (
            <>
              <Image style={s.mainImg} source={require('../../assets/images/home.png')} />
              <TextView text="Categories" type="button-text" color={colors.lightWhite} style={s.Text} />
              <View style={s.Categories}>
                <TouchableOpacity style={s.CategoriesOption}>
                  <TextView text="Hospitals" type="body-one" color={colors.lightWhite} />
                </TouchableOpacity>
                <TouchableOpacity style={s.CategoriesOption}>
                  <TextView text="Beverages" type="body-one" color={colors.lightWhite} />
                </TouchableOpacity>
                <TouchableOpacity style={s.CategoriesOption}>
                  <TextView text="Banquets" type="body-one" color={colors.lightWhite} />
                </TouchableOpacity>
                <TouchableOpacity style={s.CategoriesOption} onPress={onPressHome}>
                  <TextView text="View More" type="body-one" color={colors.lightWhite} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollableAvoidKeyboard>
      </SafeAreaView>

      {/* QR Scanner Modal */}
      <Modal visible={isScanning} animationType="slide" onRequestClose={() => setIsScanning(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
          <VisionQRScanner />
        </SafeAreaView>
      </Modal>
    </>
  );
};

// Scanner Styles
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#00ff00',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  scanText: {
    marginTop: 20,
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

const s = StyleSheet.create({
  mainImg: { marginTop: verticalScale(15), alignSelf: 'center' },
  Text: { marginTop: verticalScale(20), marginLeft: 12 },
  Categories: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  CategoriesOption: {
    width: '45%',
    padding: moderateScale(20),
    marginTop: verticalScale(10),
    marginHorizontal: scale(5),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: borderRadius,
  },
  qrDetails: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(15),
    flexDirection: 'column',
  },
  profileText: { marginTop: verticalScale(5) },
  token: { fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  btn: {
    flex: 1,
    borderRadius: borderRadius,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  generateBtn: { marginRight: scale(5), backgroundColor: colors.primary },
  cancelBtn: { marginLeft: scale(5), backgroundColor: '#808080' },
  tabContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(15),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 16,
    padding: 6,
    marginHorizontal: scale(5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  input: { marginHorizontal: 5 },
  inputWrapper: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(10),
  },
  inputHeading: {
    marginBottom: verticalScale(10),
    marginLeft: scale(5),
  },
  qrPlaceholder: {
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 12,
    paddingVertical: verticalScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    marginVertical: verticalScale(10),
  },
  SendBut: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginHorizontal: scale(15),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dashboardContainer: {
    paddingBottom: verticalScale(20),
  },
  merchantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    paddingHorizontal: scale(5),
  },
  name: {
    lineHeight: verticalScale(30),
  },
  branchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.3)',
  },
  branchBadgeText: {
    marginLeft: scale(5),
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(5),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: verticalScale(5),
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 12,
    padding: scale(12),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  completedCard: { borderLeftWidth: 3, borderLeftColor: colors.success },
  pendingCard: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  queuesCard: { borderLeftWidth: 3, borderLeftColor: "#3498db" },
  desksCard: { borderLeftWidth: 3, borderLeftColor: "#f1c40f" },
  branchesCard: { borderLeftWidth: 3, borderLeftColor: "#9b59b6" },
  waitCard: { borderLeftWidth: 3, borderLeftColor: "#e74c3c" },
  statValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(5),
  },
  statValue: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  guideContainer: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(20),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  timelineLine: {
    position: 'absolute',
    left: scale(32),
    top: verticalScale(40),
    bottom: verticalScale(40),
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  guideTitle: {
    marginBottom: verticalScale(15),
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
    zIndex: 1,
  },
  stepNumber: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chartContainer: {
    marginTop: verticalScale(15),
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 12,
    padding: scale(15),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chartTitle: {
    marginBottom: verticalScale(20),
    alignSelf: 'flex-start',
    marginLeft: scale(5),
    fontWeight: '700',
  },
  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  activitySection: {
    marginTop: verticalScale(10),
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackgroundColor,
    padding: scale(12),
    borderRadius: 12,
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activityIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  activityInfo: {
    flex: 1,
  },
  activityTime: {
    alignItems: 'flex-end',
  },
  moreButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: verticalScale(5),
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.2)',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(5),
    marginBottom: verticalScale(10),
  },
  actionBtn: {
    width: '23.5%',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 12,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  broadcastContainer: {
    width: '100%',
    backgroundColor: colors.inputBackgroundColor,
    borderRadius: 16,
    padding: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  broadcastInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, {})(Home);