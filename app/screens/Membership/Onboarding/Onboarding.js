import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { saveAuthUser } from './../../../utils/localStorageHelpers';
import { borderRadius } from '../../../styles/dimensions';
import Input from '../../../components/Input';
import Validation from '../../../components/Validation/Validation';
import FormGroup from '../../../components/FormGroup';
import TextView from '../../../components/TextView/TextView';
import colors from '../../../styles/colors';
import { verticalScale, scale } from 'react-native-size-matters';
import NavigationOptions from '../../../components/NavigationOptions';
import screens from '../../../constants/screens';
import { Button, Touchable } from '../../../components/Button';
import Icon from '../../../components/Icon';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { View, Image, StyleSheet, Alert, PermissionsAndroid, Platform, ActionSheetIOS, TouchableOpacity } from 'react-native';
import AppStyles from '../../../styles/AppStyles';
import { getAuthUser } from '../../../utils/localStorageHelpers';
import { getUserProfile, updateUserProfile } from '../../../services/profileService';
import { setCurrentUser } from '../../../actions/authActions';
import { clearProfileResponseMsg, setProfile } from './../../../actions/profileActions';
import { getDisplayName } from '../../../global/Helpers';
import { logout } from '../../../services/authService';
import { stackReset } from './../../../global/Helpers';
import { genderArray } from './../../../data/raw';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { profileUpdate } from '../../../services/apiService';
import { getBaseUrl } from '../../../global/Environment';
import Toast from 'react-native-toast-message';

const Onboarding = (props) => {
  let { resError = {} } = props.profile;
  let { user } = props.auth;
  const source = props.navigation?.route?.params?.source;
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadData();
    return () => {
      props.clearProfileResponseMsg();
    };
  }, []);
  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
    await props.getUserProfile();
  };
  const handleFormChange = (key, value) => {
    if (!key) return;
    user = props.auth.user;
    if (user) {
      user[key] = value;
      props.setCurrentUser(user);
    }
  };

  const validateProfile = () => {
    const errors = [];

    if (!user.firstName) errors.push('First name');
    if (!user.lastName) errors.push('Last name');
    if (!user.address) errors.push('Address');
    if (!user.gender) errors.push('Gender');

    if (errors.length) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: `${errors.join(', ')} required`,
      });
      return false;
    }

    return true;
  };


  const onSubmit = async () => {
    setLoading(true);
    validateProfile()
    try {
      const data = new FormData();

      data.append('firstName', user.firstName);
      data.append('lastName', user.lastName);
      data.append('address', user.address);
      data.append('gender', user.gender);

      if (selectedImage) {
        data.append('ProfileUrl', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name,
        });
      }
      const result = await profileUpdate(data);

      if (result) {
        setSelectedImage(null);
        const userDetails = await getAuthUser();
        delete userDetails.onboardingRequired;
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile updated successfully',
        });
        await saveUserDetails(userDetails);

        const source = props.route.params?.source;

        if (source === screens.Profile) {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'MainApp' }],
            })
          );
          props.navigation.navigate('MainApp', {
            screen: screens.SettingsRoot,
            params: { screen: screens.Settings },
          });
        } else {
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'MainApp',
                  state: {
                    routes: [{ name: screens.HomeRoot }],
                  },
                },
              ],
            })
          );
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveUserDetails = async (userDetails) => {
    user = props.auth.user;
    const name = getDisplayName(user.firstName, user.lastName);
    const userInfo = { ...user, name };
    const localUser = {
      ...userDetails,
      firstName: user.firstName,
      lastName: user.lastName,
      name,
      ProfileUrl: selectedImage ? selectedImage.uri : userDetails.ProfileUrl || '',
    };
    await props.setCurrentUser(userInfo);
    await saveAuthUser(localUser);
  };

  const onSignOut = async () => {
    await props.logout();
    props.navigation.navigate(screens.Login);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera access to take a profile picture.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      
      return false;
    }
  };
  const handleImagePick = async () => {
    if (!launchCamera || !launchImageLibrary) {
      
      Alert.alert('Error', 'Image picker module not found. Please restart the app or contact support.');
      return;
    }
    const pickImage = async (source) => {
      try {
        const options = {
          mediaType: 'photo',
          maxWidth: 1024,
          maxHeight: 1024,
          quality: 0.8,
          includeBase64: false,
        };

        let result;
        if (source === 'camera') {
          if (!await requestCameraPermission()) return;
          result = await launchCamera(options);
        } else {
          result = await launchImageLibrary(options);
        }

        if (result.didCancel) return;
        if (result.errorCode) {
          Alert.alert('Error', result.errorMessage || 'Image pick failed');
          return;
        }

        if (result.assets && result.assets[0]) {
          const { uri, type, fileName } = result.assets[0];

          const imageData = {
            uri,
            type: type || 'image/jpeg',
            name: fileName || `profile_${Date.now()}.jpg`,
          };


          setSelectedImage(imageData);
          handleFormChange('ProfileUrl', uri);
        }

      } catch (error) {
        
        Alert.alert('Error', 'Failed to select image');
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage('camera');
          } else if (buttonIndex === 2) {
            pickImage('gallery');
          }
        }
      );
    } else {
      Alert.alert(
        'Select Image Source',
        'Choose an option to set your profile picture:',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: () => pickImage('camera') },
          { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={AppStyles.root} forceInset={{ top: 'never', bottom: 'never' }}>
      <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
        <Touchable onPress={handleImagePick}>
          <View style={s.profileImgMain}>
            {}
            {}
            <Image
              source={
                user?.ProfileUrl
                  ? {
                    uri: user.ProfileUrl.startsWith('file')
                      ? user.ProfileUrl
                      : user.ProfileUrl.startsWith('http')
                        ? user.ProfileUrl
                        : `${getBaseUrl()}/${user.ProfileUrl}`,
                  }
                  : require('../../../assets/images/profile.png')
              }
              style={s.ProfileUrl}
              resizeMode="cover"
            />

            <TextView color={colors.primary} text={'Upload Photo'} type={'body-head'} style={[s.uploadPhotoText]} />
          </View>
        </Touchable>
        <FormGroup style={[s.fromGroup]}>
          <Validation error={resError.firstname}>
            <Input
              returnKeyType={'next'}
              placeholder='First Name'
              isIconLeft={true}
              leftIconName={'create'}
              color={colors.white}
              value={user.firstName}
              editable={!loading}
              onChangeText={(text) => {
                handleFormChange('firstName', text);
              }}
            />
          </Validation>
          <Validation error={resError.lastname}>
            <Input
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Last Name'
              isIconLeft={true}
              leftIconName={'create'}
              color={colors.white}
              value={user.lastName}
              editable={!loading}
              onChangeText={(text) => {
                handleFormChange('lastName', text);
              }}
            />
          </Validation>
          <Validation error={resError.address}>
            <Input
              style={s.inputText}
              returnKeyType={'next'}
              placeholder='Enter Address'
              isIconLeft={true}
              isIconRight={true}
              leftIconName={'location'}
              rightIconName={'locate'}
              iconColor={colors.primary}
              color={colors.white}
              value={user.address}
              onChangeText={(text) => {
                handleFormChange('address', text);
              }}
              editable={!loading}
            />
          </Validation>
        </FormGroup>
        <View style={s.genderMain}>
          <TextView isTextColorWhite={true} text={'Gender'} type={'body-head'} style={[s.genderText]} />
          <Validation error={resError.gender}>
            <View style={s.genderWrapper}>
              {genderArray?.map((gender) => {
                return (
                  <TouchableOpacity
                    key={gender.value}
                    style={[s.genderbtn, user.gender === gender.value && s.genderbtnActive]}
                    onPress={() => handleFormChange('gender', gender.value)}
                  >
                    <Icon name={gender.iconName} color={colors.lightWhite} isFeather={false} />
                    <TextView
                      color={colors.lightWhite}
                      text={gender.text}
                      type={'body-one'}
                      style={[s.genderText]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </Validation>
        </View>
        <Button
          ButtonText='Submit'
          style={s.btn}
          onPress={onSubmit}
          isLoading={loading}
        />
        {(!props.route?.params ||
          props.route?.params?.source === screens.VerifyEmail) && (
            <TextView
              isClickableLink={true}
              color={colors.primary}
              text={'Sign Out'}
              type={'body-one'}
              style={[s.signOut]}
              onPress={onSignOut}
            />
          )}

      </ScrollableAvoidKeyboard>
    </SafeAreaView>
  );
};

Onboarding.navigationOptions = ({ navigation }) => {
  return NavigationOptions({
    title: '',
    isBack: true,
    navigation: navigation,
    headerStyle: { elevation: 0 },
  });
};

const s = StyleSheet.create({
  title: {
    marginTop: verticalScale(60),
  },
  profileImgMain: {
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  ProfileUrl: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  uploadPhotoText: {
    marginTop: verticalScale(15),
  },
  fromGroup: {
    marginTop: verticalScale(25),
  },
  genderWrapper: {
    marginTop: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalScale(13),
  },
  genderActive: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.primary,
  },
  genderbtnActive: {
    borderColor: colors.primary,
  },
  genderbtn: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.lightWhite,
  },
  genderInActive: {
    borderWidth: 1,
    borderRadius: scale(borderRadius),
    paddingVertical: verticalScale(13),
    paddingLeft: scale(7),
    paddingRight: scale(20),
    flexDirection: 'row',
    position: 'relative',
    borderColor: colors.lightWhite,
  },
  genderText: {
    letterSpacing: 0.5,
    marginLeft: scale(5),
  },
  genderMain: {},
  btn: {
    backgroundColor: colors.primary,
    marginHorizontal: scale(30),
    marginTop: verticalScale(80),
    marginBottom: verticalScale(15),
    borderRadius: borderRadius,
  },
  signOut: {
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getUserProfile,
  updateUserProfile,
  clearProfileResponseMsg,
  setCurrentUser,
  setProfile,
  logout,
})(Onboarding);