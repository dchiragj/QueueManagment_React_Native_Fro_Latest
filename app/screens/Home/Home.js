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
import { checkToken, generateToken, getCategories } from '../../services/apiService';
import { Button } from '../../components/Button';
import Card from '../../components/Card';
import Toast from 'react-native-toast-message';

// Vision Camera Imports (built-in QR support)
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

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

  const tabs = user?.role === 'customer'
    ? [
        { key: 'private', label: 'Invite code' },
        { key: 'link', label: 'Link' },
        { key: 'location', label: 'Location' },
        { key: 'qr', label: 'QR Code' },
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
        Alert.alert('Error', 'Failed to load categories.');
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
  try {
    console.log('Scanned QR Data:', qrData);

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

         const tokenCheckResponse = await checkToken( payload );

      if ( tokenCheckResponse.status === 200 && tokenCheckResponse.data?.data && tokenCheckResponse.data.status === "ok" ) {
        setTokenDetails( tokenCheckResponse.data.data );
        showToast(
          'info',
          'Token Already Generated',
          `You already have a token, your token number is ${ tokenCheckResponse.data.data.tokenNumber }`
        );
        clearInputs();
        setActiveTab();
        setQrDetails( null );
      } else {
        setQrDetails( tokenCheckResponse.data.data );
        showToast( 'info', 'No Token', 'Please press "Generate Token" to create a new token.' );
      }
    } catch ( error ) {
      console.error( 'Error processing QR code:', error.message, error.response?.data );
      showToast( 'error', 'Scan Failed', error.message || 'Could not process QR code' );
      setIsScanning( false );
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
    try {
      if (!qrDetails) {
        Alert.alert('Error', 'No queue data. Scan QR code first.');
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
      <SafeAreaView style={[AppStyles.root]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input placeholder="Search Shop Here" isIconLeft leftIconName="search" color={colors.white} />
          <View style={s.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                style={[s.tab, activeTab === tab.key && s.activeTab]}
              >
                <TextView
                  text={tab.label}
                  color={activeTab === tab.key ? colors.white : colors.lightWhite}
                  type="body-one"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'private' && (
            <Input
              placeholder="Enter 6-digit code"
              value={joinCode}
              onChangeText={setJoinCode}
              keyboardType="numeric"
              maxLength={6}
              style={s.input}
            />
          )}
          {activeTab === 'location' && (
            <Input
              placeholder="Enter lat,long (e.g., 23.12,72.57)"
              value={location}
              onChangeText={setLocation}
              style={s.input}
            />
          )}
          {activeTab === 'link' && (
            <Input
              placeholder="Enter link https://..."
              value={link}
              onChangeText={setLink}
              style={s.input}
            />
          )}
          {activeTab === 'qr' && (
            <TouchableOpacity style={s.input} onPress={() => handleTabPress('qr')}>
              <TextView text="Tap to Scan QR Code" color={colors.lightWhite} />
            </TouchableOpacity>
          )}

          {activeTab && activeTab !== 'qr' && (
            <Button 
              ButtonText="Check & Join" 
              onPress={processJoin} 
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
    borderColor: colors.grey,
    marginTop: 10,
    backgroundColor: colors.inputBackgroundColor,
  },
  tab: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: colors.primary },
  input: { marginHorizontal: 5, marginVertical: 5 },
  SendBut: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, {})(Home);