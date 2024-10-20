import React from 'react';
import LoginComponent from '../../components/LoginComponent';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Auth() {
  return (
    <>
      <Header />
      <LoginComponent />
      <div className=' fixed bottom-0 right-0 left-0'>
      <Footer />
      </div>
    </>
  );
}
