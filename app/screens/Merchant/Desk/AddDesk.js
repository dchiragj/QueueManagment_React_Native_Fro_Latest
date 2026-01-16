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
import { createDesk, updateDesk, getCategories, getQueueList } from '../../../services/apiService';
import { indent } from '../../../styles/dimensions';
import ScrollableAvoidKeyboard from '../../../components/ScrollableAvoidKeyboard/ScrollableAvoidKeyboard';
import { scale, verticalScale } from 'react-native-size-matters';

const AddDesk = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const deskToEdit = route.params?.desk;

    const [loading, setLoading] = useState(false);
    const [queues, setQueues] = useState([]);
    const [rawQueues, setRawQueues] = useState([]);
    const [formData, setFormData] = useState({
        name: deskToEdit?.name || '',
        categoryId: deskToEdit?.category_id || '',
        queueId: deskToEdit?.queue_id || '',
        email: deskToEdit?.email || '',
        password: '',
        status: deskToEdit?.status || 1,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const queueRes = await getQueueList();
                const queueData = queueRes?.data || [];

                setRawQueues(queueData);

                const queueList = queueData.map((q) => ({
                    key: q.id,
                    value: q.name,
                }));
                setQueues(queueList);
            } catch (err) {
                console.error(err);
                setQueues([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (name, value) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // If selecting a queue, automatically set the categoryId
            if (name === 'queueId') {
                const selectedQueue = rawQueues.find(q => q.id === value);
                if (selectedQueue) {
                    newData.categoryId = selectedQueue.category;
                }
            }

            return newData;
        });
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.categoryId || !formData.queueId) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Desk name, category, and queue are required.',
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

                    <Text style={styles.label}>Select Queue *</Text>
                    <View style={styles.pickerContainer}>
                        {!loading && queues.length > 0 ? (
                            <SelectList
                                setSelected={(value) => handleChange('queueId', value)}
                                data={queues}
                                save="key"
                                defaultOption={queues.find(q => String(q.key) === String(formData.queueId))}
                                placeholder="Select Queue"
                                boxStyles={styles.selectListBox}
                                inputStyles={{ color: colors.white }}
                                dropdownStyles={styles.selectListDropdown}
                                dropdownTextStyles={{ color: colors.white }}
                                searchicon={<Icon name="search" size={20} color={colors.white} style={{ marginRight: scale(10) }} isFeather={false} />}
                            />
                        ) : loading ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Text style={{ color: colors.red }}>No queues found. Please create a queue first.</Text>
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
