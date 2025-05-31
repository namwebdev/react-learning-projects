'use client';

import { create } from 'zustand';

// Types based on Prisma schema
export interface WorkingHour {
  id: string;
  dealershipId: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dealership {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: WorkingHour[];
  createdAt: Date;
  updatedAt: Date;
}

interface DealershipStore {
  dealerships: Dealership[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDealerships: (dealerships: Dealership[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Helper methods
  getDealershipById: (id: string) => Dealership | undefined;
  getOpenDealerships: () => Dealership[];
  getDealershipsByDay: (day: WorkingHour['dayOfWeek']) => Dealership[];
}

export const useDealershipStore = create<DealershipStore>((set, get) => ({
  dealerships: [],
  isLoading: false,
  error: null,

  setDealerships: (dealerships) => set({ dealerships, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clearError: () => set({ error: null }),

  getDealershipById: (id) => {
    const { dealerships } = get();
    return dealerships.find(dealership => dealership.id === id);
  },

  getOpenDealerships: () => {
    const { dealerships } = get();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() as WorkingHour['dayOfWeek'];
    
    return dealerships.filter(dealership => {
      const todayHours = dealership.workingHours.find(hour => hour.dayOfWeek === today);
      return todayHours?.isOpen || false;
    });
  },

  getDealershipsByDay: (day) => {
    const { dealerships } = get();
    
    return dealerships.filter(dealership => {
      const dayHours = dealership.workingHours.find(hour => hour.dayOfWeek === day);
      return dayHours?.isOpen || false;
    });
  },
})); 