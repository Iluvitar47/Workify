import React from 'react';
import UsersDashboard from '../../components/UsersDashboard';
import AdvertisementDashboard from '../../components/AdvertisementsDashboard';
import CompaniesDashboard from '@/components/CompaniesDashboard';
import ApplicationsDashboard from '@/components/ApplicationsDashboard';

export default function Dashboard() {
  return (
    <>
      <div>
        <h1>Dashboard</h1>
        <UsersDashboard />
        <CompaniesDashboard />
        <AdvertisementDashboard />
        <ApplicationsDashboard />
      </div>
    </>
  );
}
