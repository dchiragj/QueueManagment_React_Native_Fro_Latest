import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar, Image, TouchableOpacity, Platform, PermissionsAndroid, Modal, Pressable } from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from '../../../styles/AppStyles';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { getQueueDetails } from '../../../services/apiService';
import NavigationOptions from '../../../components/NavigationOptions';
import Card from '../../../components/Card';
import { useRoute } from '@react-navigation/native';
import { getBaseUrl } from '../../../global/Environment';

const MyQueueDetail = ({ navigation }) => {
  const route = useRoute();
  const { queueId, category } = route.params || {};
  const [queue, setQueue] = useState({});
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullScreenQr, setFullScreenQr] = useState(null);


  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'running';
      case 2:
        return 'cancel';
      default:
        return 'unknown';
    }
  };
  const getTokenStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#FF9800';
      case 'CALLED':
        return '#2196F3';
      case 'COMPLETED':
        return '#4CAF50';
      case 'SKIPPED':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const handleShare = async (url, title) => {
    try {
      setLoading(true);
      const fileName = url.split('/').pop();
      const localFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

      const options = {
        fromUrl: url,
        toFile: localFile,
      };

      const result = await RNFS.downloadFile(options).promise;

      if (result.statusCode === 200) {
        const shareOptions = {
          title: title,
          url: `file://${localFile}`,
          type: 'image/png',
          failOnCancel: false,
        };
        await Share.open(shareOptions);
      } else {
        
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        setLoading(true);
        const response = await getQueueDetails(queueId);

        setQueue(response?.data?.queue);
        setTokens(response?.data?.tokens)
      } catch (err) {
        setError(err.message || 'Failed to fetch queue details');
        
      } finally {
        setLoading(false);
      }
    };

    if (queueId) {
      fetchQueueDetails();
    } else {
      setError('Queue ID is missing');
      setLoading(false);
    }
  }, [queueId]);

  if (loading) {
    return (
      <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading queue details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>âš ï¸</Text>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]} forceInset={{ top: 'never', bottom: 'never' }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.container}>


          {queue && (
            <Card style={styles.detailsCard}>
              {}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                <DetailRow label="Queue Name" value={queue.name || 'Unnamed Queue'} />
                <DetailRow label="Category" value={category || 'Unknown'} />
                <DetailRow label="Status" value={getStatusLabel(queue.status) || 'Unknown'} />
                {queue.desks?.length > 0 ? (
                  <DetailRow label="Desks" value={queue.desks.map(d => d.name).join(', ')} />
                ) : queue.Desk ? (
                  <DetailRow label="Desk" value={queue.Desk} />
                ) : null}
              </View>

              {}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date & Time</Text>
                <DetailRow label="Start Date" value={formatDate(queue.start_date) || 'No Date'} />
                {queue.start_time && <DetailRow label="Start Time" value={queue.start_time} />}
                {queue.end_time && <DetailRow label="End Time" value={queue.end_time} />}
              </View>
              {}
              {(queue.description || queue.location) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Additional Information</Text>
                  {queue.description && (
                    <View style={styles.infoRow}>
                      <DetailRow label="Description" value={queue.description || 'Unknown'} />
                    </View>
                  )}
                  {queue.location && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Location:</Text>
                      <Text style={styles.infoValue}>{queue.location}</Text>
                    </View>
                  )}
                </View>
              )}
            </Card>
          )}
          <View style={styles.qrshow}>

            {queue?.qrCode && (
              <View style={styles.qrBox}>
                <Text style={styles.qrTitle}>App QR Code</Text>
                <TouchableOpacity onPress={() => setFullScreenQr(`${getBaseUrl()}/${queue.qrCode}`)}>
                  <Image
                    style={styles.qrImage}
                    source={{ uri: `${getBaseUrl()}/${queue.qrCode}` }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShare(`${getBaseUrl()}/${queue.qrCode}`, 'App QR Code')}
                >
                  <Ionicons name="share-social-outline" size={20} color={colors.primary} />
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
              </View>
            )}

            {queue?.webBaseqrCode && (
              <View style={styles.qrBox}>
                <Text style={styles.qrTitle}>Web QR Code</Text>
                <TouchableOpacity onPress={() => setFullScreenQr(`${getBaseUrl()}/${queue.webBaseqrCode}`)}>
                  <Image
                    style={styles.qrImage}
                    source={{ uri: `${getBaseUrl()}/${queue.webBaseqrCode}` }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShare(`${getBaseUrl()}/${queue.webBaseqrCode}`, 'Web QR Code')}
                >
                  <Ionicons name="share-social-outline" size={20} color={colors.primary} />
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

          {}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tokens ({tokens?.length || 0})</Text>

            {tokens && tokens?.length > 0 ? (
              tokens?.map((token) => (
                <View key={token.id} style={styles.tokenItem}>
                  <View style={styles.tokenLeft}>
                    <Text style={styles.tokenNumber}>#{token?.tokenNumber}</Text>
                    <Text style={styles.tokenQueueName}>{token?.customer?.firstName || null} {token?.customer?.lastName || null}</Text>
                  </View>
                  <View style={styles.tokenStatusContainer}>
                    <Text style={[
                      styles.tokenStatus,
                      { backgroundColor: getTokenStatusColor(token.status) }
                    ]}>
                      {token.status}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noTokensText}>No tokens generated yet</Text>
            )}
          </View>
        </View>
      </ScrollableAvoidKeyboard>

      {}
      <Modal
        visible={!!fullScreenQr}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullScreenQr(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFullScreenQr(null)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFullScreenQr(null)}
            >
              <Ionicons name="close-circle" size={40} color="#fff" />
            </TouchableOpacity>
            {fullScreenQr && (
              <Image
                source={{ uri: fullScreenQr }}
                style={styles.fullQrImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const StatCard = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const getStatusColor = (status) => {
  const statusColors = {
    running: '#4CAF50',
    cancel: '#F44336',
    unknown: colors.primary,
  };
  return statusColors[status] || colors.primary;
};

const formatDate = (dateString) => {
  if (!dateString) return 'No Date';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text || '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.red || '#F44336',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: colors.text || '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryText: {
    fontSize: 16,
    color: colors.primary || '#e1511dff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text || '#333',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary || '#fff',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#e0e0e0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text || '#cdc2c2ff',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background || '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary || '#e1511dff',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomColor: colors.border || '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
  },
  qrshow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },

  qrBox: {
    alignItems: 'center',
    width: '48%',
  },

  qrTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.primary
  },

  qrImage: {
    width: 150,
    height: 150,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary
  },
  shareText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },


  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 10,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary || '#e1511dff',
    marginRight: 12,
    minWidth: 50,
  },
  tokenQueueName: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    overflow: 'hidden',
  },
  tokenStatusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  },
  tokenStatus: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
    textTransform: 'uppercase',
  },
  noTokensText: {
    fontSize: 14,
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 1,
  },
  fullQrImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
});

MyQueueDetail.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: 'Queue Detail',
    isBack: true,
    navigation: navigation,
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      backgroundColor: colors.background,
    },
  });
};

export default MyQueueDetail;