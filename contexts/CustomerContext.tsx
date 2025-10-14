'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CustomerData } from '@/types/api';
import { fetchCustomerByEmail } from '@/services/authService';

interface CustomerContextType {
  customerData: CustomerData | null;
  loading: boolean;
  error: string | null;
  refreshCustomerData: () => Promise<void>;
  clearCustomerData: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');

        if (!token || !email) {
          setError('No authentication data found');
          return;
        }

        const response = await fetchCustomerByEmail(email, token);
        
        if (response.responseCode === 200 && response.data) {
          setCustomerData(response.data);
        } else {
          setError(response.responseMessage || 'Failed to fetch customer data');
        }
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCustomerData = () => {
    setCustomerData(null);
    setError(null);
    setLoading(false);
  };

  // Load customer data on mount and when token/email changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      const userType = localStorage.getItem('userType');
      
      // Only fetch customer data if we have a token, email, and user is a customer
      if (token && email && userType === 'CUSTOMER') {
        refreshCustomerData();
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Listen for custom customer login event and storage changes
  useEffect(() => {
    const handleCustomerLogin = (e: CustomEvent) => {
      if (e.detail?.customerData) {
        setCustomerData(e.detail.customerData);
        setLoading(false);
        setError(null);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userEmail' || e.key === 'token') {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const email = localStorage.getItem('userEmail');
          const userType = localStorage.getItem('userType');
          
          if (token && email && userType === 'CUSTOMER') {
            refreshCustomerData();
          }
        }
      }
    };

    window.addEventListener('customerLogin', handleCustomerLogin as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('customerLogin', handleCustomerLogin as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: CustomerContextType = {
    customerData,
    loading,
    error,
    refreshCustomerData,
    clearCustomerData,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};