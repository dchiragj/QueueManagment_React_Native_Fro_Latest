
import React from 'react';
// import React, { useEffect, useState } from 'react';
import Onboarding from '../../Membership/Onboarding/Onboarding';
const EditProfile = () => {
  // const [gender, setGender] = useState(false);
  // const changeGender = (gender) => {
  //   setGender(() => {
  //     return {
  //       [gender]: true
  //     };
  //   });
  // };
  return (
    // <SafeAreaView style={AppStyles.root} forceInset={{ top: 'never', bottom: 'never' }}>
    //   <ScrollableAvoidKeyboard showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
    //     <View style={s.profilephotowmain}>
    //       <Image source={require('../../../assets/images/profile.png')} />
    //       <TextView color={colors.primary} text={'Upload Photo'} type={'body-head'} style={[s.uploadphotoText]} />
    //     </View>
    //     <FormGroup style={[s.fromGroup]}>
    //       <Validation>
    //         <Input
    //           returnKeyType={'next'}
    //           placeholder='First Name'
    //           isIconLeft={true}
    //           leftIconName={'create'}
    //           color={colors.white}
    //         />
    //       </Validation>
    //       <Validation>
    //         <Input
    //           style={s.inputText}
    //           returnKeyType={'next'}
    //           placeholder='Last Name'
    //           isIconLeft={true}
    //           leftIconName={'create'}
    //           color={colors.white}
    //         />
    //       </Validation>
    //       <Validation>
    //         <Input
    //           style={s.inputText}
    //           returnKeyType={'next'}
    //           placeholder='Enter Address'
    //           isIconLeft={true}
    //           isIconRight={true}
    //           leftIconName={'md-location'}
    //           rightIconName={'locate'}
    //           iconColor={colors.primary}
    //           color={colors.white}
    //         />
    //       </Validation>
    //     </FormGroup>
    //     <View style={s.genderMain}>
    //       <TextView isTextColorWhite={true} text={'Gender'} type={'body-head'} style={[s.genderText]} />
    //       <View style={s.genderWrapper}>
    //         <Touchable style={gender?.male ? s.genderbtn1 : s.genderbtn2} onPress={() => changeGender('male')}>
    //           <Icon name='male' color={gender?.male ? colors.primary : colors.lightWhite} isFeather={false} />
    //           <TextView
    //             color={gender?.male ? colors.primary : colors.lightWhite}
    //             text={'Male'}
    //             type={'body-one'}
    //             style={[s.genderText]}
    //           />
    //         </Touchable>
    //         <Touchable style={gender?.female ? s.genderbtn1 : s.genderbtn2} onPress={() => changeGender('female')}>
    //           <Icon name='female-sharp' color={gender?.female ? colors.primary : colors.lightWhite} isFeather={false} />
    //           <TextView
    //             color={gender?.female ? colors.primary : colors.lightWhite}
    //             text={'Female'}
    //             type={'body-one'}
    //             style={[s.genderText]}
    //           />
    //         </Touchable>
    //         <Touchable style={gender?.other ? s.genderbtn1 : s.genderbtn2} onPress={() => changeGender('other')}>
    //           <Icon name='male-female' color={gender?.other ? colors.primary : colors.lightWhite} isFeather={false} />
    //           <TextView
    //             color={gender?.other ? colors.primary : colors.lightWhite}
    //             text={'Other'}
    //             type={'body-one'}
    //             style={[s.genderText]}
    //           />
    //         </Touchable>
    //       </View>
    //     </View>
    //     <Button ButtonText='Submit' style={s.btn} animationStyle={s.btn} />
    //   </ScrollableAvoidKeyboard>
    // </SafeAreaView>
    <Onboarding />
  );
};
// EditProfile.navigationOptions = ({ navigation }) => {
//   return NavigationOptions({
//     title: '',
//     isBack: false,
//     navigation: navigation,
//     headerLeft: (
//       <HeaderButton
//         type={1}
//         iconName={'md-chevron-back'}
//         color={colors.primary}
//         isFeather={false}
//         iconType={'ionic'}
//         onPress={() => {
//           navigation.goBack();
//         }}
//       />
//     ),
//     // headerRight: (
//     //   <TextView
//     //     isClickableLink={false}
//     //     color={colors.primary}
//     //     text={'Edit'}
//     //     type={'body-head'}
//     //     style={s.edit}
//     //     onPress={() => navigation.navigate(screens.EditProfile)}
//     //   />
//     // ),
//     headerStyle: { elevation: 0 }
//   });
// };
// const s = StyleSheet.create({
//   title: {
//     marginTop: verticalScale(60)
//   },
//   profilephotowmain: {
//     // backgroundColor: colors.red,
//     marginTop: verticalScale(20),
//     alignItems: 'center'
//   },
//   uploadphotoText: {
//     marginTop: verticalScale(15)
//   },
//   fromGroup: {
//     marginTop: verticalScale(25)
//   },
//   genderWrapper: {
//     // backgroundColor: colors.limegreen,
//     marginTop: verticalScale(12),
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     paddingVertical: verticalScale(13)
//   },
//   genderbtn1: {
//     borderWidth: 1,
//     borderRadius: scale(borderRadius),
//     paddingVertical: verticalScale(13),
//     paddingLeft: scale(7),
//     paddingRight: scale(20),
//     flexDirection: 'row',
//     position: 'relative',
//     borderColor: colors.primary
//   },
//   genderbtn2: {
//     borderWidth: 1,
//     borderRadius: scale(borderRadius),
//     paddingVertical: verticalScale(13),
//     paddingLeft: scale(7),
//     paddingRight: scale(20),
//     flexDirection: 'row',
//     position: 'relative',
//     borderColor: colors.lightWhite
//   },
//   genderText: {
//     letterSpacing: 0.5,
//     marginLeft: scale(5)
//   },
//   genderMain: {
//     // backgroundColor: colors.success
//   },
//   btn: {
//     backgroundColor: colors.primary,
//     marginHorizontal: scale(30),
//     marginTop: verticalScale(80),
//     marginBottom: verticalScale(15),
//     borderRadius: borderRadius
//   }
// });
export default EditProfile;
