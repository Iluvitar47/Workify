'use client'

import React, { useEffect, useState } from 'react';
import Auth from './pages/Auth';
import auth from '@/hooks/auth.hook';
import Home from './pages/Home';

function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await auth();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Auth/>;
  }
  return <Home/>;
}

export default function Page() {
  return <LoginPage/>;
}
