import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBusinessList } from '../services/apiService';
import { getAuthUser } from '../utils/localStorageHelpers';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuthUser().then((user) => {
            if (user?.token) {
                setToken(user.token);
            }
        });
    }, []);

    // 2️⃣ Run whenever token changes
    useEffect(() => {
        if (!token) return;

        loadBranches();
    }, [token]);

    const loadBranches = async () => {
        try {
            // Load saved branch from AsyncStorage
            const savedBranch = await AsyncStorage.getItem('qflow_selected_branch');
            if (savedBranch) {
                setSelectedBranchId(savedBranch);
            }

            // Fetch business list
            const response = await getBusinessList();
            const list = response?.data || [];
            setBusinesses(list);
        } catch (error) {
            console.error('Failed to fetch businesses in context', error);
        } finally {
            setLoading(false);
        }
    };

    const changeBranch = async (id) => {
        const stringId = String(id);
        setSelectedBranchId(stringId);
        await AsyncStorage.setItem('qflow_selected_branch', stringId);
    };

    const activeBranch = businesses.find(b => String(b.id) === String(selectedBranchId));

    return (
        <BranchContext.Provider
            value={{
                businesses,
                selectedBranchId,
                activeBranch,
                changeBranch,
                refreshBranches: loadBranches,
                loading,
                setToken
            }}>
            {children}
        </BranchContext.Provider>
    );
};

export const useBranch = () => {
    const context = useContext(BranchContext);
    if (!context) {
        throw new Error('useBranch must be used within a BranchProvider');
    }
    return context;
};
