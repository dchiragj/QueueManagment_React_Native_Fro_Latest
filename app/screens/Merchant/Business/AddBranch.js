import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppStyles from '../../../styles/AppStyles';
import colors from '../../../styles/colors';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import { createBusiness } from '../../../services/apiService';
import { indent } from '../../../styles/dimensions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';

const AddBranch = () => {
   const navigation = useNavigation();
   const [loading, setLoading] = useState(false);

   const [formData, setFormData] = useState({
      businessName: '',
      businessType: '',
      businessRegistrationNumber: '',
      businessAddress: '',
      businessPhoneNumber: '',
   });

   const handleChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleCreate = async () => {
      const { businessName, businessAddress, businessPhoneNumber } = formData;
      if (!businessName || !businessAddress || !businessPhoneNumber) {
         Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Please fill in all required fields.',
         });
         return;
      }

      try {
         setLoading(true);
         await createBusiness(formData);

         Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Business created successfully!',
         });

         navigation.goBack();

      } catch (error) {
         Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message || 'Failed to create business',
         });
      } finally {
         setLoading(false);
      }
   };

   return (
      <SafeAreaView style={AppStyles.root}>
         <ScrollableAvoidKeyboard
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={{ paddingBottom: 40 }}
         >
            {/* Form Fields */}
            <Input
               // label="Business Name"
               placeholder="Enter business name"
               value={formData.businessName}
               onChangeText={(text) => handleChange('businessName', text)}
               isIconLeft
               leftIconName="business"
            />

            <Input
               // label="Business Type"
               placeholder="e.g. Retail, Clinic, Restaurant"
               value={formData.businessType}
               onChangeText={(text) => handleChange('businessType', text)}
               isIconLeft
               leftIconName="pricetag"
            />

            <Input
               // label="Registration Number"
               placeholder="Business Registration No."
               value={formData.businessRegistrationNumber}
               onChangeText={(text) => handleChange('businessRegistrationNumber', text)}
               isIconLeft
               leftIconName="document-text"
            />

            <Input
               // label="Phone Number"
               placeholder="Enter contact number"
               value={formData.businessPhoneNumber}
               onChangeText={(text) => handleChange('businessPhoneNumber', text)}
               keyboardType="phone-pad"
               isIconLeft
               leftIconName="call"
            />

            <Input
               // label="Address"
               placeholder="Enter full address"
               value={formData.businessAddress}
               onChangeText={(text) => handleChange('businessAddress', text)}
               multiline
               isIconLeft
               leftIconName="location"
               style={{ height: 100, textAlignVertical: 'center', paddingTop: 10 }}
            />

            <View style={styles.buttonContainer}>
               <Button
                  ButtonText="Create Business"
                  onPress={handleCreate}
                  isLoading={loading}
                  disabled={loading}
                  style={styles.createButton}
               />
            </View>

         </ScrollableAvoidKeyboard>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   buttonContainer: {
      marginTop: 20,
   },
   createButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: indent,
   }
});

export default AddBranch;