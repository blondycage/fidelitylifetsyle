'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { VendorData } from '@/types/api';
import { fetchVendorByEmail } from '@/services/authService';

interface VendorContextType {
  vendorData: VendorData | null;
  loading: boolean;
  error: string | null;
  refreshVendorData: () => Promise<void>;
  clearVendorData: () => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};

interface VendorProviderProps {
  children: ReactNode;
}

export const VendorProvider: React.FC<VendorProviderProps> = ({ children }) => {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshVendorData = useCallback(async () => {
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

        const response = await fetchVendorByEmail(email, token);
        
        if (response.responseCode === 200 && response.data) {
          setVendorData(response.data);
        } else {
          setError(response.responseMessage || 'Failed to fetch vendor data');
        }
      }
    } catch (err) {
      console.error('Error fetching vendor data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearVendorData = () => {
    setVendorData(null);
    setError(null);
    setLoading(false);
  };

  // Load vendor data on mount and when token/email changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      const userType = localStorage.getItem('userType');
      
      // Only fetch vendor data if we have a token, email, and user is a vendor
      if (token && email && userType === 'VENDOR') {
        refreshVendorData();
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Listen for custom vendor login event and storage changes
  useEffect(() => {
    const handleVendorLogin = (e: CustomEvent) => {
      if (e.detail?.vendorData) {
        setVendorData(e.detail.vendorData);
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
          
          if (token && email && userType === 'VENDOR') {
            refreshVendorData();
          }
        }
      }
    };

    window.addEventListener('vendorLogin', handleVendorLogin as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('vendorLogin', handleVendorLogin as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: VendorContextType = {
    vendorData,
    loading,
    error,
    refreshVendorData,
    clearVendorData,
  };

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  );
};