import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import AppStyles from '../../../styles/AppStyles';
import colors from '../../../styles/colors';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import screens from '../../../constants/screens';
import { createBusiness, updateBusiness } from '../../../services/apiService';
import { indent } from '../../../styles/dimensions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { useBranch } from '../../../context/BranchContext';

const AddBranch = () => {
   const navigation = useNavigation();
   const route = useRoute();
   const branchData = route.params?.branchData;
   const isEdit = !!branchData;

   const [loading, setLoading] = useState(false);
   const { refreshBranches } = useBranch();

   const [formData, setFormData] = useState({
      businessName: branchData?.businessName || '',
      businessRegistrationNumber: branchData?.businessRegistrationNumber || '',
      businessAddress: branchData?.businessAddress || '',
      businessPhoneNumber: branchData?.businessPhoneNumber || '',
      isActive: branchData ? (branchData.isActive == 1 || branchData.status == 1 || branchData.isActive === true || branchData.status === true ? 1 : 0) : 1,
      status: branchData ? (branchData.isActive == 1 || branchData.status == 1 || branchData.isActive === true || branchData.status === true ? 1 : 0) : 1
   });

   const handleChange = (name, value) => {
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleSave = async () => {
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
         if (isEdit) {
            await updateBusiness(branchData.id, formData);
         } else {
            await createBusiness(formData);
         }

         Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Business ${isEdit ? 'updated' : 'created'} successfully!`,
         });

         if (refreshBranches) {
            await refreshBranches();
         }

         navigation.goBack();

      } catch (error) {
         Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message || `Failed to ${isEdit ? 'update' : 'create'} business`,
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
            {}
            <Input
               placeholder="Enter business name"
               value={formData.businessName}
               onChangeText={(text) => handleChange('businessName', text)}
               isIconLeft
               leftIconName="business"
            />

            <Input
               placeholder="Business Registration No."
               value={formData.businessRegistrationNumber}
               onChangeText={(text) => handleChange('businessRegistrationNumber', text)}
               isIconLeft
               leftIconName="document-text"
            />

            <Input
               placeholder="Enter contact number"
               value={formData.businessPhoneNumber}
               onChangeText={(text) => handleChange('businessPhoneNumber', text)}
               keyboardType="phone-pad"
               isIconLeft
               leftIconName="call"
            />

            <Input
               placeholder="Enter full address"
               value={formData.businessAddress}
               onChangeText={(text) => handleChange('businessAddress', text)}
               multiline
               isIconLeft
               leftIconName="location"
               style={{ height: 100, textAlignVertical: 'center' }}
            />

            <View style={styles.statusContainer}>
               <View>
                  <Text style={styles.statusLabel}>Branch Status</Text>
                  <Text style={styles.statusSubLabel}>{(formData.isActive == 1 || formData.status == 1 || formData.isActive === true || formData.status === true) ? 'Active (Visible to users)' : 'Inactive (Hidden from users)'}</Text>
               </View>
               <Switch
                  value={!!(formData.isActive == 1 || formData.status == 1 || formData.isActive === true || formData.status === true)}
                  onValueChange={(value) => {
                     const val = value ? 1 : 0;
                     setFormData(prev => ({ ...prev, isActive: val, status: val }));
                  }}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor={(formData.isActive == 1 || formData.status == 1 || formData.isActive === true || formData.status === true) ? colors.white : '#f4f3f4'}
               />
            </View>

            <View style={styles.buttonContainer}>
               <Button
                  ButtonText={isEdit ? "Update Business" : "Create Business"}
                  onPress={handleSave}
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
   },
   statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.inputBackgroundColor,
      padding: 15,
      borderRadius: 12,
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#2E3650',
   },
   statusLabel: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
   },
   statusSubLabel: {
      color: colors.dustRodeo,
      fontSize: 12,
      marginTop: 2,
   }
});

export default AddBranch;