'use client'

import React, { useEffect, useState } from 'react';
import Offers from './offers/page';
import Dashboard from './dashboard/page';

export default function Page() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const permission = user ? JSON.parse(user).permission : null;

    setToken(token);
    setPermission(permission);
  }, []);
  if (token) {
    if (permission === 'admin') {
      return <Dashboard/>;
    }
    return <Offers/>;
  } else {
    return <Offers/>;
  }
}