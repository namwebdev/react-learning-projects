'use client';

import { useEffect } from 'react';
import { useDealershipStore } from './use-dealership-store';
import { getDealerships } from '@/actions/dealership.action';

/**
 * Custom hook để quản lý dealership data với Zustand
 * 
 * @example
 * ```tsx
 * function DealershipList() {
 *   const { 
 *     dealerships, 
 *     isLoading, 
 *     error,
 *     getOpenDealerships,
 *     getDealershipsByDay 
 *   } = useDealerships();
 * 
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   const openToday = getOpenDealerships();
 *   const mondayDealerships = getDealershipsByDay('MONDAY');
 * 
 *   return (
 *     <div>
 *       <h2>All Dealerships ({dealerships.length})</h2>
 *       <h3>Open Today ({openToday.length})</h3>
 *       <h3>Open on Monday ({mondayDealerships.length})</h3>
 *     </div>
 *   );
 * }
 * ```
 */
export const useDealerships = () => {
  const {
    dealerships,
    isLoading,
    error,
    setDealerships,
    setLoading,
    setError,
    clearError,
    getDealershipById,
    getOpenDealerships,
    getDealershipsByDay,
  } = useDealershipStore();

  const fetchDealerships = async () => {
    try {
      setLoading(true);
      clearError();
      
      const data = await getDealerships();
      setDealerships(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dealerships';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if no data exists
  useEffect(() => {
    if (dealerships.length === 0 && !isLoading) {
      fetchDealerships();
    }
  }, []);

  return {
    // Data
    dealerships,
    isLoading,
    error,
    
    // Actions
    fetchDealerships,
    refetch: fetchDealerships,
    clearError,
    
    // Helper methods
    getDealershipById,
    getOpenDealerships,
    getDealershipsByDay,
  };
}; 