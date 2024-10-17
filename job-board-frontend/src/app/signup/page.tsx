'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SignUpComponent from '../../components/SignUpComponent';
import SignUpUserComponent from '@/components/SignUpUserComponent';

const SignUpPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setPeopleToken] = useState(null);

  useEffect(() => { 
    const interval = setInterval(() => {
      const peopleTokenString = localStorage.getItem('people');
      if (peopleTokenString) {
        const parsedPeopleToken = JSON.parse(peopleTokenString);
        setPeopleToken(parsedPeopleToken);
        if (parsedPeopleToken) {
          setCurrentStep(2);
        }
      }
    }, 1000, []);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />
      {currentStep === 1 && (
        <SignUpComponent />
      )}
      {currentStep === 2 && (
        <SignUpUserComponent />
      )}
      <Footer />
    </div>
  );
};

export default SignUpPage;
