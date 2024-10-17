import React from 'react';
import ProfilePersonalInformationComponent from '../../components/ProfilePersonalInformationComponent';
import ProfileAccountInformationComponent from '../../components/ProfileAccountInformationComponent';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export default function Profil() {
  return (
    <>
      <Header />
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <ProfilePersonalInformationComponent />
      <ProfileAccountInformationComponent />
      <Footer />
    </>
  );
}
