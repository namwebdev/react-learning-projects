'use client';

import React from 'react';
import { Car } from '@/types';
import { useDealerships } from '@/hooks/use-dealerships';
import TestDriveForm from '../_components/TestDriveForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface TestDrivePageClientProps {
  car: Car;
}

export default function TestDrivePageClient({ car }: TestDrivePageClientProps) {
  const { 
    dealerships, 
    isLoading, 
    error, 
    refetch 
  } = useDealerships();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-6xl mb-6 gradient-title">Book a Test Drive</h1>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dealership information...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-6xl mb-6 gradient-title">Book a Test Drive</h1>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load dealership information: {error}
            <button 
              onClick={refetch}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Book a Test Drive</h1>
      <TestDriveForm car={car} dealerships={dealerships} />
    </div>
  );
} 