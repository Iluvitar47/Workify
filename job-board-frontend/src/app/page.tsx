'use client'

import React from 'react';
import Home from './pages/Home';
import auth from '../hooks/auth.hook';

export default function Page() {
  auth();
  return (
    <>
    <div>
      <Home/>
    </div>
    </>
  );
}
