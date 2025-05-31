import { getCarById } from '@/actions/car.action';
import { notFound } from 'next/navigation';
import React from 'react'
import TestDrivePageClient from './TestDrivePageClient';

async function TestDrivePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const res = await getCarById(id);

  if (!res.success || !("data" in res) || !res.data) {
    return notFound();
  }

  const car = res.data;

  return <TestDrivePageClient car={car} />;
}

export default TestDrivePage