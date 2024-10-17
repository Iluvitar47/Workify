'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignUpComponent from '../../components/SignUpComponent';
import SignUpUserComponent from '@/components/SignUpUserComponent';

export default function Signup() {
  const [peopleToken, setPeopleToken] = useState<string | null>(null);

  // Function to check the token in localStorage
  const checkPeopleToken = () => {
    const people = localStorage.getItem('people');
    setPeopleToken(people);
  };

  useEffect(() => {
    // Initialize the token when the component loads
    checkPeopleToken();

    // Add an event listener to detect changes in localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'people') {
        checkPeopleToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      <Header />
      {peopleToken ? <SignUpUserComponent /> : <SignUpComponent />}
      <Footer />
    </div>
  );
}