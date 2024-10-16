'use client';

import React from 'react';
import UsersDashboard from '../../components/UsersDashboard';
import AdvertisementDashboard from '../../components/AdvertisementsDashboard';
import CompaniesDashboard from '@/components/CompaniesDashboard';
import ApplicationsDashboard from '@/components/ApplicationsDashboard';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Dashboard() {
  return (
    <>
      <div>
        <Header/>
        <h1>Dashboard</h1>
        <UsersDashboard />
        <CompaniesDashboard />
        <AdvertisementDashboard />
        <ApplicationsDashboard />
        <Footer />
      </div>
    </>
  );
}
