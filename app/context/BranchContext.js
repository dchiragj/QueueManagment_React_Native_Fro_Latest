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

    useEffect(() => {
        if (!token) return;
        loadBranches();
    }, [token]);

    const loadBranches = async () => {
        try {
            const savedBranch = await AsyncStorage.getItem('qflow_selected_branch');
            if (savedBranch) {
                setSelectedBranchId(savedBranch);
            }
            const response = await getBusinessList();
            let list = [];
            if (Array.isArray(response)) {
                list = response;
            } else if (response?.data && Array.isArray(response.data)) {
                list = response.data;
            } else if (Array.isArray(response?.list)) {
                list = response.list;
            }
            setBusinesses(list);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const changeBranch = async (id) => {
        const stringId = String(id);
        setSelectedBranchId(stringId);
        await AsyncStorage.setItem('qflow_selected_branch', stringId);
    };

    const activeBranches = businesses.filter(b =>
        b.isActive == 1 || b.status == 1 || b.isActive === true || b.status === true || b.is_active == 1 || b.is_active === true
    );
    const activeBranch = activeBranches.find(b => Number(b.id) === Number(selectedBranchId));

    return (
        <BranchContext.Provider
            value={{
                businesses,
                activeBranches,
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
