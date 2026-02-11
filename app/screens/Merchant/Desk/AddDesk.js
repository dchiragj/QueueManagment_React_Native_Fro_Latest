import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { SelectList } from 'react-native-dropdown-select-list';
import Icon from '../../../components/Icon';

import AppStyles from '../../../styles/AppStyles';
import colors from '../../../styles/colors';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import { createDesk, updateDesk, getBusinessList } from '../../../services/apiService';
import { indent } from '../../../styles/dimensions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { scale, verticalScale } from 'react-native-size-matters';
import { useBranch } from '../../../context/BranchContext';


const AddDesk = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const deskToEdit = route.params?.desk;
    const { selectedBranchId } = useBranch();

    const [loading, setLoading] = useState(false);

    const [businesses, setBusinesses] = useState([]);
    const [formData, setFormData] = useState({
        name: deskToEdit?.name || '',
        businessId: deskToEdit?.businessId || (selectedBranchId !== 'all' ? selectedBranchId : ''),
        email: deskToEdit?.email || '',
        password: '',
        status: deskToEdit?.status || 1,
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const businessRes = await getBusinessList();
                const businessData = businessRes?.data || [];

                const businessList = businessData.map((b) => ({
                    key: b.id,
                    value: b.businessName,
                }));
                setBusinesses(businessList);
            } catch (err) {
                console.error(err);
                setBusinesses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Desk name is required.',
            });
            return;
        }


        try {
            setLoading(true);
            if (deskToEdit) {
                await updateDesk(deskToEdit.id, formData);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Desk updated successfully!' });
            } else {

                await createDesk(formData);
                Toast.show({ type: 'success', text1: 'Success', text2: 'Desk created successfully!' });
            }
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to save desk',
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
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Desk Name *</Text>
                    <Input
                        placeholder="e.g. Desk A, Window 1"
                        value={formData.name}
                        onChangeText={(text) => handleChange('name', text)}
                        isIconLeft
                        leftIconName="desktop"
                        isFeather={false}
                    />

                    <Text style={styles.label}>Select Branch (Optional)</Text>

                    <View style={styles.pickerContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <SelectList

                                setSelected={(value) => handleChange('businessId', value)}
                                data={businesses.length > 0 ? businesses : [{ key: '', value: 'No branches available', disabled: true }]}
                                save="key"
                                defaultOption={businesses.find(b => String(b.key) === String(formData.businessId))}
                                placeholder={businesses.length > 0 ? "Select Branch" : "No branches available"}
                                boxStyles={styles.selectListBox}
                                inputStyles={{ color: colors.white }}
                                dropdownStyles={styles.selectListDropdown}
                                dropdownItemStyles={styles.selectListItem}
                                disabledItemStyles={styles.selectListItem}
                                dropdownTextStyles={{ color: colors.white }}
                                searchicon={<Icon name="search" size={20} color={colors.white} style={{ marginRight: scale(10) }} isFeather={false} />}
                            />

                        )}
                    </View>

                    <Text style={styles.label}>Operator Email (Optional)</Text>
                    <Input
                        placeholder="operator@example.com"
                        value={formData.email}
                        onChangeText={(text) => handleChange('email', text)}
                        isIconLeft
                        leftIconName="mail"
                        isFeather={false}
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Operator Password {deskToEdit ? "(Optional - Enter to change)" : "(Optional)"}</Text>
                    <Input
                        placeholder="Enter password"
                        value={formData.password}
                        onChangeText={(text) => handleChange('password', text)}
                        isIconLeft
                        leftIconName="lock-closed"
                        isFeather={false}
                        secureTextEntry
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            ButtonText={deskToEdit ? "Update Desk" : "Create Desk"}
                            onPress={handleSave}
                            isLoading={loading}
                            disabled={loading}
                            style={styles.saveButton}
                        />
                    </View>
                </View>
            </ScrollableAvoidKeyboard>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 0,
    },
    label: {
        color: colors.lightWhite,
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
        marginTop: 16,
    },
    pickerContainer: {
        marginBottom: 10,
    },
    selectListBox: {
        borderWidth: 1,
        borderColor: colors.lightWhite,
        borderRadius: 12,
        backgroundColor: colors.inputBackgroundColor,
        paddingVertical: scale(15),
    },
    selectListDropdown: {
        backgroundColor: colors.inputBackgroundColor,
        borderColor: colors.lightWhite,
    },
    selectListItem: {
        backgroundColor: colors.inputBackgroundColor,
        paddingVertical: 10,
    },
    buttonContainer: {


        marginTop: 40,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: indent,
    }
});

export default AddDesk;
