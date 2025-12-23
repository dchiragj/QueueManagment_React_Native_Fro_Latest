// import React from 'react';
// import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
// import NavigationOptions from '../../../components/NavigationOptions';
// import  colors  from '../../../styles/colors';
// import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard' ;
// import AppStyles from '../../../styles/AppStyles';
// import TextView from '../../../components/TextView/TextView';
// import FormGroup from '../../../components/FormGroup';
// import Input from '../../../components/Input';
// import { verticalScale, scale } from 'react-native-size-matters';
// import Picker from '@app/app/components/Picker';
// import { QueueCategory, Desks } from '@app/app/data/raw';
// import DatePicker from '../../../components/DatePicker';
// import { borderRadius } from '../../../styles/dimensions';
// import { Button } from '../../../components/Button';
// import screens from '../../constants/screens';
// const Step1 = (props) => {
//   const onPressStep2 = () => {
//     props.navigation.navigate(screens.Step2);
//   };
//   return (
//     <SafeAreaView style={AppStyles.root}>
//       <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
//         <TextView text={'Queue Details'} type={'body-one'} isTextColorWhite={true} style={[AppStyles.titleStyle]} />
//         <FormGroup style={[AppStyles.formContainer, s.firstFormWrapper]}>
//           <Input returnKeyType={'next'} placeholder='Enter Queue Name' isIconLeft={true} leftIconName={'create'} />
//         </FormGroup>
//         <FormGroup>
//           <Picker
//             label={null}
//             isPlaceholderItem={true}
//             containerStyle={s.fullborderBox}
//             data={QueueCategory}
//             itemKeyField={'value'}
//             itemValueField={'text'}
//             isLeftIcon={true}
//             leftIconName={'search'}
//           />
//         </FormGroup>
//         <View style={s.topBorder} />
//         <View style={s.dateWrapper}>
//           <TextView
//             style={s.dateTextHeader}
//             text={'Queue Time Period Start To End'}
//             type={'body-one'}
//             isTextColorWhite={true}
//           />
//           <View style={s.DatePickerWrapper}>
//             <DatePicker style={s.DatePicker} containerStyle={s.containerStyle} />
//             <DatePicker style={s.DatePicker} containerStyle={s.containerStyle} />
//           </View>
//         </View>
//         <View style={s.topBorder} />
//         <View style={s.tokenWrapper}>
//           <View style={s.tokenOption}>
//             <TextView
//               style={s.tokenNumberText}
//               text={'Token starts with 01 to'}
//               type={'body-one'}
//               color={colors.white}
//             />
//             <Input returnKeyType={'next'} placeholder='50' wrapperStyle={s.wrapperStyle} style={s.inputPlaceholder} />
//           </View>
//           <View style={s.tokenOption}>
//             <TextView style={s.tokenNumberText} text={'Choose No Of Desks'} type={'body-one'} color={colors.white} />
//             <Picker
//               label={null}
//               isPlaceholderItem={true}
//               containerStyle={s.secondPickerContainerStyle}
//               data={Desks}
//               itemKeyField={'value'}
//               itemValueField={'text'}
//             />
//           </View>
//         </View>
//         <View style={s.topBorder} />
//         <TextView style={s.locationHeader} text={'Add Queue Location'} type={'body-one'} isTextColorWhite={true} />
//         <Input
//           returnKeyType={'next'}
//           placeholder='Enter Address'
//           isIconLeft={true}
//           leftIconName={'location'}
//           isIconRight={true}
//           rightIconName={'locate'}
//           style={s.addressInput}
//           wrapperStyle={s.addressInputWrapperStyle}
//         />
//         <View style={s.topBorder} />
//         <Input
//           returnKeyType={'done'}
//           placeholder='Queue Description'
//           isIconLeft={true}
//           leftIconName={'create'}
//           multiline={true}
//           numberOfLines={5}
//           style={s.queueInput}
//           iconStyle={s.iconInput}
//           wrapperStyle={[s.addressInputWrapperStyle]}
//         />
//         <Button
//           ButtonText='Next'
//           style={[s.btn, AppStyles.btnStyle]}
//           animationStyle={[s.btn, AppStyles.btnStyle]}
//           isIconRight={true}
//           rightIconName={'arrow-forward'}
//           onPress={onPressStep2}
//         />
//       </ScrollableAvoidKeyboard>
//     </SafeAreaView>
//   );
// };
// Step1.navigationOptions = ({ navigation }) => {
//   return NavigationOptions({
//     title: '',
//     isBack: true,
//     navigation: navigation,
//     headerStyle: { elevation: 0 }
//   });
// };
// const s = StyleSheet.create({
//   firstFormWrapper: {
//     marginTop: verticalScale(30)
//   },
//   topBorder: {
//     borderWidth: 0.5,
//     borderColor: colors.lightWhite,
//     marginTop: scale(30),
//     marginHorizontal: scale(15)
//   },
//   dateWrapper: {
//     marginTop: verticalScale(30)
//   },
//   dateTextHeader: {
//     textAlign: 'center'
//   },
//   DatePickerWrapper: {
//     flexDirection: 'row',
//     marginTop: verticalScale(15),
//     justifyContent: 'space-around'
//   },
//   DatePicker: {
//     marginRight: scale(120)
//   },
//   containerStyle: {
//     marginLeft: scale(5)
//   },
//   tokenWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: verticalScale(20),
//     justifyContent: 'center',
//     borderRadius: borderRadius
//   },
//   tokenOption: {
//     width: '45%',
//     paddingHorizontal: scale(20),
//     marginTop: verticalScale(10),
//     marginHorizontal: scale(5),
//     borderWidth: 1,
//     borderColor: colors.white,
//     borderRadius: borderRadius
//   },
//   tokenNumberText: {
//     marginTop: verticalScale(7),
//     textAlign: 'center'
//   },
//   wrapperStyle: {
//     marginTop: verticalScale(10),
//     marginHorizontal: scale(25)
//   },
//   inputPlaceholder: {
//     textAlign: 'center',
//     color: colors.white
//   },
//   secondPickerContainerStyle: {
//     marginTop: verticalScale(10),
//     marginLeft: scale(-7)
//   },
//   locationHeader: {
//     textAlign: 'center',
//     marginTop: verticalScale(30)
//   },
//   addressInput: {
//     color: colors.white
//   },
//   addressInputWrapperStyle: {
//     marginVertical: verticalScale(30)
//   },
//   queueInput: {
//     color: colors.white,
//     textAlignVertical: 'top'
//   },
//   iconInput: {
//     alignSelf: 'flex-start',
//     paddingTop: 10
//   },
//   btn: {
//     marginTop: verticalScale(50),
//     marginBottom: verticalScale(40)
//   }
// });
// export default Step1;
// screens/Step1.js
// screens/Step1.js
import TextView from '../../../components/TextView/TextView';
import colors from '../../../styles/colors';
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
// import NavigationOptions from '../../../components/NavigationOptions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import AppStyles from '../../../styles/AppStyles';
import FormGroup from '../../../components/FormGroup';
import Input from '../../../components/Input';
import { verticalScale, scale } from 'react-native-size-matters';
import { SelectList } from 'react-native-dropdown-select-list';
import DatePicker from '../../../components/DatePicker';
import { borderRadius } from '../../../styles/dimensions';
import { Button } from '../../../components/Button';
import { createQueue, getCategories, getQueueList, getDesksByCategory } from '../../../services/apiService';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';


const Step1 = ({ navigation }) => {
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    start_date: new Date(),
    end_date: null,
    start_number: 1,
    end_number: 50,
    address: '',
    deskDetails: [],
    joinMethods: '',
    latitude: 0,
    longitude: 0,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [desks, setDesks] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 0, long: 0 });
  const [errorMessages, setErrorMassages] = useState('')
  const [isDayQueue, setIsDayQueue] = useState(0);

  const JOIN_METHODS = [
    { key: 'private', label: 'Invite-only', icon: 'lock' },
    { key: 'link', label: 'Shareable Link', icon: 'link' },
    { key: 'location', label: 'Location-based', icon: 'map-marker' },
    { key: 'qr', label: 'QR-Code Scan', icon: 'qrcode' },
  ];

  const formatDateForSQL = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return null;
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const validateForm = () => {

    if (!formData.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name is required',
        position: 'top',
      });
      return false;
    }

    if (!formData.category) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Category is required',
        position: 'top',
      });
      return false;
    }

    if (!formData.description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Description is required',
        position: 'top',
      });
      return false;
    }

    if (!formData.start_date || isNaN(formData.start_date.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Valid start date is required',
        position: 'top',
      });
      return false;
    }

    if (!formData.end_date || isNaN(formData.end_date.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Valid end date is required',
        position: 'top',
      });
      return false;
    }

    if (formData.end_date <= formData.start_date) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'End date must be after start date',
        position: 'top',
      });
      return false;
    }

    if (!formData.end_number || parseInt(formData.end_number) <= formData.start_number) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'End number must be greater than start number',
        position: 'top',
      });
      return false;
    }

    if (!formData.address.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Address is required',
        position: 'top',
      });
      return false;
    }

    if (!formData.joinMethods) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a join method',
        position: 'top',
      });
      return false;
    }

    return true;
  };


  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to create a location-based queue',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const captureLocation = async () => {
    setLoading(true);
    setLocationError('');

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLocationError('Permission denied');
        setLoading(false);
        return false;
      }

      return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({ ...prev, latitude, longitude }));
            setUserLocation({ lat: latitude, long: longitude });
            setLoading(false);
            resolve(true);
          },
          (error) => {
            console.log('Location Error:', error);
            setLocationError('Failed to get location');
            setLoading(false);
            resolve(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (err) {
      setLocationError('Permission error');
      setLoading(false);
      return false;
    }
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        category: formData.category.toString(),
        start_date: formatDateForSQL(formData.start_date),
        end_date: formatDateForSQL(formData.end_date),
        isDayQueue:isDayQueue,
        end_number: parseInt(formData.end_number || 0),
        deskDetails: formData.deskDetails,
        joinMethods: formData.joinMethods,
      };
      
      await createQueue(payload);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Queue created successfully! QR sent to email.',
      });
      setLoading(false);
      const queue = await getQueueList();
      navigation.navigate('MyQueue', { queues: queue.data ?? [] });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to create queue',
      });
    } finally {
      setErrorMassages('')
      setLoading(false);
    }
  };

  const fetchDesksByCategory = async (categoryId) => {
    try {
      const res = await getDesksByCategory(categoryId);
      const deskList = (res?.data || []).map((desk) => ({
        key: desk.id,
        value: desk.name,
      }));
      setDesks(deskList);
    } catch (err) {
      console.error(err);
      setDesks([]);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategories();
        const list = (res?.data || []).map((c) => ({
          key: c.id,
          value: c.name,
        }));
        setCategories(list);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={AppStyles.root}>
      {loading && (
        <View style={s.loaderOverlay}>
          <ActivityIndicator size="large" color="#FF6A00" />
        </View>
      )}
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* <TextView text="Queue Details" type="body-one" isTextColorWhite style={ [ AppStyles.titleStyle ] } /> */}
        <FormGroup style={[AppStyles.formContainer, s.firstFormWrapper]}>
          <Input
            placeholder="Enter Queue Name"
            isIconLeft leftIconName="create"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            // error={errors.name}
            editable={!loading}
          />
        </FormGroup>

        <FormGroup>
          <SelectList
            setSelected={(value) => {
              setFormData({ ...formData, category: value });
              fetchDesksByCategory(value);
            }}
            data={categories}
            save="key"
            placeholder="Select Category"
            boxStyles={[s.fullborderBox, { borderColor: colors.lightWhite, backgroundColor: colors.background }]}
            inputStyles={{ color: colors.white }}
            dropdownStyles={{ backgroundColor: colors.background, borderColor: colors.lightWhite }}
            dropdownTextStyles={{ color: colors.white }}
            disabled={loading}
            searchicon={<Icon name="search" size={20} color={colors.white} style={{ marginRight: scale(10) }} />}
          />
          {/* {errors.category && <Text style={s.errorText}>{errors.category}</Text>} */}
        </FormGroup>

        <View style={s.topBorder} />
        <View style={s.dateWrapper}>
          <TextView style={s.dateTextHeader} text="Queue Time Period Start To End" type="body-one" isTextColorWhite />
          <View style={s.DatePickerWrapper}>
            <View style={s.containerStyle}>
              <DatePicker
                onDateChange={(date) => {
                  const d = typeof date === 'string' ? new Date(date) : date;
                  if (d && !isNaN(d)) setFormData({ ...formData, start_date: d });
                }}
                placeholder="Start Date"
                selectedDate={formData.start_date}
                disabled={loading}
              />
              {/* {errors.start_date && <Text style={s.errorText}>{errors.start_date}</Text>} */}
            </View>
            <View style={s.containerStyle}>
              <DatePicker
                onDateChange={(date) => {
                  const d = typeof date === 'string' ? new Date(date) : date;
                  if (d && !isNaN(d)) setFormData({ ...formData, end_date: d });
                }}
                placeholder="End Date"
                selectedDate={formData.end_date}
                disabled={loading}
              />
              {/* {errors.end_date && <Text style={s.errorText}>{errors.end_date}</Text>} */}
            </View>
          </View>
        </View>

        <View style={s.dayaWrapper}>
          <TextView
          style={s.dateTextHeader}
            text="Is this a day-based queue?"
            type="body-one"
            isTextColorWhite
          />
          <View style={s.DaybasedQueue}>
            <TouchableOpacity
              onPress={() => setIsDayQueue(1)}
              style={{
                padding: 10,
                marginRight: 10,
                backgroundColor: isDayQueue === 1 ? '#4CAF50' : '#252A34',
                borderRadius: 5
              }}
            >
              <Text style={{ color: '#fff' }}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsDayQueue(0)}
              style={{
                padding: 10,
                backgroundColor:  isDayQueue === 0 ? '#F44336' : '#252A34',
                borderRadius: 5
              }}
            >
              <Text style={{ color: '#fff' }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.topBorder} />

        <View style={s.tokenWrapper}>
          <View style={s.tokenOption}>
            <TextView style={s.tokenNumberText} text="Token starts with 01" type="body-one" color={colors.white} />
            <Input
              placeholder="50"
              wrapperStyle={s.wrapperStyle}
              style={s.inputPlaceholder}
              value={formData.end_number}
              onChangeText={(text) => setFormData({ ...formData, end_number: text })}
              keyboardType="numeric"
              // error={errors.end_number}
              editable={!loading}
            />
          </View>
        </View>

        <View style={s.topBorder} />

        <TextView style={s.locationHeader} text="Add Queue Location" type="body-one" isTextColorWhite />
        <Input
          placeholder="Enter Address"
          isIconLeft leftIconName="location"
          isIconRight rightIconName="locate"
          style={s.addressInput}
          wrapperStyle={s.addressInputWrapperStyle}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          // error={errors.address}
          editable={!loading}
        />

        <Input
          placeholder="Queue Description"
          isIconLeft leftIconName="create"
          multiline numberOfLines={5}
          style={s.queueInput}
          iconStyle={s.iconInput}
          wrapperStyle={s.addressInputWrapperStyle}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          // error={errors.description}
          editable={!loading}
        />

        <FormGroup>
          <TextView text="How can people join this queue?" type="body-one" isTextColorWhite />
          <View style={s.radioRow}>
            {JOIN_METHODS.map(({ key, label, icon }) => {
              const isChecked = formData.joinMethods === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={s.radio}
                  onPress={async () => {
                    setFormData({ ...formData, joinMethods: key });
                    if (key === 'location') {
                      const success = await captureLocation();
                      if (!success) {
                        setFormData((prev) => ({ ...prev, joinMethods: '' }));
                      }
                    } else {
                      setFormData((prev) => ({ ...prev, latitude: 0, longitude: 0 }));
                    }
                  }}
                  disabled={loading}
                >
                  <Icon name={isChecked ? 'dot-circle-o' : 'circle-o'} size={24} color={colors.primary} />
                  <Icon name={icon} size={20} color={colors.primary} style={{ marginLeft: scale(8) }} />
                  <Text style={s.radioLabel}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* {errors.joinMethods && <Text style={s.errorText}>{errors.joinMethods}</Text>}
          {locationError ? <Text style={s.errorText}>{locationError}</Text> : null} */}
        </FormGroup>

        <Button
          ButtonText="Submit"
          style={[s.btn, AppStyles.btnStyle]}
          isIconRight rightIconName="arrow-forward"
          onPress={onSubmit}
          isLoading={loading}
          disabled={loading}
        />
      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};



const s = StyleSheet.create({
  firstFormWrapper: { marginTop: verticalScale(30) },
  topBorder: { borderWidth: 0.5, borderColor: colors.lightWhite, marginTop: scale(30), marginHorizontal: scale(15) },
  dateWrapper: { marginTop: verticalScale(30) },
  dayaWrapper: { marginTop: verticalScale(0) },
  dateTextHeader: { textAlign: 'center' },
  DatePickerWrapper: { flexDirection: 'row', marginTop: verticalScale(15), justifyContent: 'space-around' },
  DaybasedQueue: { flexDirection: 'row', marginTop: verticalScale(15), justifyContent: 'center' },
  containerStyle: { flex: 1, marginHorizontal: scale(5) },
  tokenWrapper: { flexDirection: 'row', justifyContent: 'center', marginTop: verticalScale(20) },
  tokenOption: { width: '45%', paddingHorizontal: scale(20), marginHorizontal: scale(5), borderWidth: 1, borderColor: colors.white, borderRadius: borderRadius },
  tokenNumberText: { marginTop: verticalScale(7), textAlign: 'center' },
  wrapperStyle: { marginTop: verticalScale(10), marginHorizontal: scale(25) },
  inputPlaceholder: { textAlign: 'center', color: colors.white },
  locationHeader: { textAlign: 'center', marginTop: verticalScale(30) },
  addressInput: { color: colors.white },
  addressInputWrapperStyle: { marginVertical: verticalScale(20) },
  queueInput: { color: colors.white, textAlignVertical: 'top' },
  iconInput: { alignSelf: 'flex-start', paddingTop: 10 },
  btn: { marginTop: verticalScale(20), marginBottom: verticalScale(40) },
  errorText: { color: colors.red, fontSize: scale(12), marginTop: verticalScale(5), marginLeft: scale(15) },
  fullborderBox: { borderWidth: 1, borderColor: colors.lightWhite, borderRadius: borderRadius, paddingVertical: scale(22) },
  radioRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: verticalScale(12) },
  radio: { flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: verticalScale(10), paddingVertical: verticalScale(6) },
  radioLabel: { color: colors.white, marginLeft: scale(8), fontSize: scale(13) },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

});

export default Step1;