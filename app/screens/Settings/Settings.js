import { Button, Touchable } from '../../components/Button';
import ScrollableAvoidKeyboard from '../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import TextView from '../../components/TextView/TextView';
import colors from '../../styles/colors';
import AppStyles from '../../styles/AppStyles';
import React, { useEffect } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { View, SafeAreaView, StyleSheet, Image } from 'react-native';
import { borderRadius } from '../../styles/dimensions';
import screens from '../../constants/screens';
// import NavigationOptions from '../../../components/NavigationOptions';
import HeaderButton from '../../components/HeaderButton';
import Icon from '../../components/Icon';
import { connect } from 'react-redux';
import { logout } from '../../services/authService';
import NavigationOptions from '../../components/NavigationOptions';

const Settings = (props) => {

  const { user } = props.auth;

  useEffect(() => {
    console.log('settings');
    props.navigation.setParams({ openDrawer: _openDrawer });
  }, []);

  const onPressSignOut = async () => {
    await props.logout();
    props.navigation.navigate('Auth', { screen: screens.Login });
  };

  const onPressProfile = async () => {
    // props.navigation.navigate(screens.Profile);
  };

  const _openDrawer = () => {
    props.navigation.openDrawer();
  };

  return (
    <SafeAreaView style={[AppStyles.root, AppStyles.rootWithoutPadding]} forceInset={{ top: 'never', bottom: 'never' }}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <Touchable onPress={onPressProfile} style={[s.profileMain, s.same]}>
          <View>
            <Image source={require('../../assets/images/sProfile.png')}></Image>
          </View>
          <View style={s.profileTextMain}>
            <TextView color={colors.white} text={user.name} type={'body'} style={s.profileText} />
            <TextView color={colors.lightWhite} text={user.email} type={'body-one'} style={s.profileText} />
          </View>
        </Touchable>
        <Touchable style={[s.scanMain, s.same]} onPress={() => props.navigation.navigate('QRScanner')}>
          <Icon name='scan-circle' color={colors.lightWhite} isFeather={false} />
          <TextView color={colors.lightWhite} text={'Scan QR For Generate Token'} type={'body'} />
          <Icon name='chevron-forward' color={colors.lightWhite} isFeather={false} />
        </Touchable>

        <View style={[s.rateMain, s.same]}>
          <Touchable style={s.rate}>
            <Icon name='star-sharp' color={colors.lightWhite} isFeather={false} style={s.rateLogo} />
            <TextView color={colors.lightWhite} text={'Rate This App'} type={'body'} style={s.profileText} />
          </Touchable>
          <Touchable style={[s.rate, s.help]}>
            <Icon name='help-circle' color={colors.lightWhite} style={s.rateLogo} />
            <TextView color={colors.lightWhite} text={'Help'} type={'body-one'} style={s.profileText} />
          </Touchable>
        </View>
        {/* <Button onPress={onPressSignOut} ButtonText='Sign Out' style={s.btn} animationStyle={s.btn} /> */}
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};

Settings.navigationOptions = ({ navigation }) => {
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
        onPress={navigation.getParam('openDrawer')}
      />
    ),
    headerStyle: { elevation: 0 }
  });
};

const s = StyleSheet.create({
  same: {
    backgroundColor: colors.inputBackgroundColor,
    marginHorizontal: scale(15),
    marginTop: verticalScale(30),
    paddingVertical: verticalScale(20),
    borderRadius: borderRadius
  },
  profileMain: {
    flexDirection: 'row',
    paddingLeft: scale(15),
    alignItems: 'center'
  },
  profileTextMain: {
    marginLeft: scale(15)
  },
  profileText: {
    marginTop: verticalScale(5)
  },
  scanMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  rateMain: {
    paddingLeft: verticalScale(15)
  },
  rate: {
    flexDirection: 'row'
  },
  rateLogo: {
    marginRight: scale(15)
  },
  help: {
    marginTop: verticalScale(15)
  },
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(170),
    borderRadius: borderRadius
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { logout })(Settings);
// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, Image, Modal, Alert, PermissionsAndroid } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { scale, verticalScale } from 'react-native-size-matters';
// import  colors  from '../../../styles/colors';
// import AppStyles from '../../../styles/AppStyles';
// import { borderRadius } from '../../../styles/dimensions';
// import screens from '../../constants/screens';
// import { connect } from 'react-redux';
// import { logout } from'../../../services/authService';
// import { checkToken, generateToken, getCategories } from '@app/app/services/apiService';
// import { Button, Touchable } from '../../../components/Button';
// import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard' ;
// import TextView from '../../../components/TextView/TextView';
// import Icon from '../../../components/Icon';
// import HeaderButton from '../../components/HeaderButton';
// import NavigationOptions from '../../../components/NavigationOptions';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { QueueCategory } from '@app/app/data/raw';

// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const Settings = ( props ) => {
//   const { user } = props.auth || {};
//   const [ isScanning, setIsScanning ] = useState( false );
//   const [ qrDetails, setQrDetails ] = useState( null );
//   const [ tokenDetails, setTokenDetails ] = useState( null );
//   const [ categories, setCategories ] = useState( [] );

//   useEffect( () => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getCategories();
//         const list = res?.data?.map( ( c ) => ( {
//           text: c.name,
//           value: c.id,
//         } ) );
//         setCategories( list );
//       } catch ( err ) {
//         console.error( "Error fetching categories:", err );
//         setCategories( [] );
//       }
//     };
//     fetchCategories();
//   }, [] );

// const getCategoryName = (categoryId) => {
//   if (!categories || categoryId === null || categoryId === undefined) {
//     return 'Unknown Category';
//   }
//   const category = categories.find((cat) => cat.value === Number(categoryId));
//   return category ? category.text : 'Unknown Category';
// };

//   useEffect( () => {
//     props.navigation.setParams( { openDrawer: _openDrawer } );
//   }, [] );

//   const onPressSignOut = async () => {
//     try {
//       await props.logout();
//       props.navigation.navigate( screens.Login );
//     } catch ( error ) {
//       console.error( 'Logout error:', error );
//       Alert.alert( 'Error', 'Failed to sign out' );
//     }
//   };

//   const onPressProfile = async () => {
//     props.navigation.navigate( screens.Profile );
//   };

//   const _openDrawer = () => {
//     props.navigation.openDrawer();
//   };

//   const checkCameraPermission = async () => {
//     try {
//       const result = await check( PERMISSIONS.ANDROID.CAMERA );
//       if ( result === RESULTS.GRANTED ) return true;
//       const requestResult = await request( PERMISSIONS.ANDROID.CAMERA );
//       return requestResult === RESULTS.GRANTED;
//     } catch ( err ) {
//       console.warn( err );
//       return false;
//     }
//   };

//   const onPressScan = async () => {
//     const hasPermission = await checkCameraPermission();
//     if ( hasPermission ) {
//       setIsScanning( true );
//     } else {
//       Alert.alert( 'Permission Denied', 'Camera permission is required to scan QR codes.' );
//     }
//   };

//   const onScanSuccess = async ( e ) => {
//     try {
//       if ( !e.data || e.data === 'undefined' ) {
//         throw new Error( 'Invalid QR code data: received undefined' );
//       }
//       let qrData;
//       try {
//         qrData = JSON.parse( e.data );
//         if ( !qrData.queueId || !qrData.category ) {
//           throw new Error( 'Queue ID or Category is missing in QR code data' );
//         }
//       } catch {
//         throw new Error( 'QR code data is not valid JSON' );
//       }

//       setQrDetails( qrData );
//       setIsScanning( false );
//       const tokenCheckResponse = await checkToken( {
//         queueId: qrData.queueId,
//         categoryId: qrData.category,
//       } );
//       if ( tokenCheckResponse.status === 200 && tokenCheckResponse.data?.data ) {
//         setTokenDetails( tokenCheckResponse.data.data );
//         Alert.alert(
//           'Token Already Generated',
//           `You already have a token, your token number is ${ tokenCheckResponse.data.data.tokenNumber }`
//         );
//         setQrDetails( null );
//       } else {
//         Alert.alert( 'Token not found', 'Please press "Generate Token" to create a new token.' );
//       }
//     } catch ( error ) {
//       console.error( 'Error processing QR code:', error.message, error.response?.data );
//       Alert.alert( 'Error', error.message || 'Failed to process QR code' );
//       setIsScanning( false );
//     }
//   };

//   const onPressGenerateToken = async () => {
//     try {
//       if ( !qrDetails ) {
//         Alert.alert( 'Error', 'No QR code data available. Please scan a QR code first.' );
//         return;
//       }
//       const tokenResponse = await generateToken( {
//         queueId: qrDetails.queueId,
//         categoryId: qrDetails.category,
//       } );
//       if ( tokenResponse.status === 'ok' && tokenResponse.data ) {
//         setTokenDetails( tokenResponse.data );
//         Alert.alert(
//           'Token Generated',
//           `Token generated successfully: ${ tokenResponse.data.tokenNumber }`
//         );
//         setQrDetails( null );
//       } else {
//         throw new Error( tokenResponse.message || 'Failed to generate token' );
//       }
//     } catch ( error ) {
//       console.error( 'Error generating token:', error.message, error.response?.data );
//       Alert.alert( 'Error', error.message || 'Failed to generate token' );
//     }
//   };
//   if ( !user ) {
//     Alert.alert( 'Error', 'User data not available' );
//     return null;
//   }

//   return (
//     <SafeAreaView
//       style={ [ AppStyles.root, AppStyles.rootWithoutPadding ] }
//       forceInset={ { top: 'never', bottom: 'never' } }
//     >
//       <ScrollableAvoidKeyboard showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps={ 'handled' }>
//         <Touchable onPress={ onPressProfile } style={ [ s.profileMain, s.same ] }>
//           <View>
//             <Image source={ require( '../../assets/images/sProfile.png' ) } />
//           </View>
//           <View style={ s.profileTextMain }>
//             <TextView color={ colors.white } text={ user.name } type={ 'body' } style={ s.profileText } />
//             <TextView color={ colors.lightWhite } text={ user.email } type={ 'body-one' } style={ s.profileText } />
//           </View>
//         </Touchable>

//         <Touchable onPress={ onPressScan } style={ [ s.scanMain, s.same ] }>
//           <Icon name='scan-circle' color={ colors.lightWhite } isFeather={ false } />
//           <TextView color={ colors.lightWhite } text={ 'Scan QR For Generate Token' } type={ 'body' } />
//           <Icon name='chevron-forward' color={ colors.lightWhite } isFeather={ false } />
//         </Touchable>

//         { qrDetails && (
//           <View style={ [ s.qrDetails, s.same ] }>
//             <TextView
//               color={ colors.white }
//               text={ `Queue Name: ${ qrDetails.queueName }` }
//               type={ 'body' }
//               style={ s.profileText }
//             />
//             <TextView
//               color={ colors.white }
//               text={ `Category: ${getCategoryName(qrDetails.category)}`}
//               type={ 'body' }
//               style={ s.profileText }
//             />
//             <TextView
//               color={ colors.white }
//               text={ `Queue ID: ${ qrDetails.queueId }` }
//               type={ 'body' }
//               style={ s.profileText }
//             />
//             <TextView
//               color={ colors.white }
//               text={ `Token Range: ${ qrDetails.tokenNumber }` }
//               type={ 'body' }
//               style={ s.profileText }
//             />
//             { tokenDetails && (
//               <TextView
//                 color={ colors.white }
//                 text={ `Your Token: ${ tokenDetails.tokenNumber }` }
//                 type={ 'body' }
//                 style={ s.profileText }
//               />
//             ) }
//             <View style={ s.buttonContainer }>
//               <Button
//                 onPress={ onPressGenerateToken }
//                 ButtonText="Generate Token"
//                 style={ [ s.btn, s.generateBtn ] }
//               />
//               <Button
//                 onPress={ () => {
//                   setQrDetails( null );
//                   setTokenDetails( null );
//                 } }
//                 ButtonText="Cancel"
//                 style={ [ s.btn, s.cancelBtn ] }
//               />
//             </View>
//           </View>
//         ) }
//         <View style={ [ s.rateMain, s.same ] }>
//           <Touchable style={ s.rate }>
//             <Icon name='star-sharp' color={ colors.lightWhite } isFeather={ false } style={ s.rateLogo } />
//             <TextView color={ colors.lightWhite } text={ 'Rate This App' } type={ 'body' } style={ s.profileText } />
//           </Touchable>
//           <Touchable style={ [ s.rate, s.help ] }>
//             <Icon name='help-circle' color={ colors.lightWhite } style={ s.rateLogo } />
//             <TextView color={ colors.lightWhite } text={ 'Help' } type={ 'body-one' } style={ s.profileText } />
//           </Touchable>
//         </View>

//         <Button onPress={ onPressSignOut } ButtonText="Sign Out" style={ s.btn } />
//       </ScrollableAvoidKeyboard>

//       <Modal visible={ isScanning } animationType="slide" onRequestClose={ () => setIsScanning( false ) }>
//         <SafeAreaView style={ AppStyles.root }>
//           <QRCodeScanner
//             onRead={ onScanSuccess }
//             reactivate={ true }
//             showMarker={ true }
//           />
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// Settings.navigationOptions = ( { navigation } ) => {
//   return NavigationOptions( {
//     title: '',
//     isBack: false,
//     navigation: navigation,
//     headerLeft: (
//       <HeaderButton
//         type={ 1 }
//         iconName={ 'md-menu' }
//         color={ colors.primary }
//         isFeather={ false }
//         iconType={ 'ionic' }
//         onPress={ navigation.getParam( 'openDrawer' ) }
//       />
//     ),
//     headerStyle: { elevation: 0 },
//   } );
// };

// const s = StyleSheet.create( {
//   same: {
//     backgroundColor: colors.inputBackgroundColor,
//     marginHorizontal: scale( 15 ),
//     marginTop: verticalScale( 30 ),
//     paddingVertical: verticalScale( 20 ),
//     borderRadius: borderRadius,
//   },
//   profileMain: {
//     flexDirection: 'row',
//     paddingLeft: scale( 15 ),
//     alignItems: 'center',
//   },
//   profileTextMain: {
//     marginLeft: scale( 15 ),
//   },
//   profileText: {
//     marginTop: verticalScale( 5 ),
//   },
//   scanMain: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//   },
//   qrDetails: {
//     paddingHorizontal: scale( 15 ),
//   },
//   rateMain: {
//     paddingLeft: verticalScale( 15 ),
//   },
//   rate: {
//     flexDirection: 'row',
//   },
//   rateLogo: {
//     marginRight: scale( 15 ),
//   },
//   help: {
//     marginTop: verticalScale( 15 ),
//   },
//   btn: {
//     backgroundColor: colors.primary,
//     marginHorizontal: scale( 30 ),
//     marginTop: verticalScale( 20 ),
//     borderRadius: borderRadius,
//   },
// } );

// const mapStateToProps = ( state ) => ( {
//   auth: state.auth,
//   profile: state.profile,
// } );

// export default connect( mapStateToProps, { logout } )( Settings );