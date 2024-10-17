import React from 'react';
import ProfilePersonalInformationComponent from '../../components/ProfilePersonalInformationComponent';
import ProfileAccountInformationComponent from '../../components/ProfileAccountInformationComponent';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export default function Profil() {
  return (
    <>
      <Header />
      <h2 className="text-2xl font-bold mt-16 text-center">Edit Profile</h2>
      <div className='justify-center lg:flex items-start '>
      <ProfilePersonalInformationComponent />
      <ProfileAccountInformationComponent />
      </div>
      <Footer />
    </>
  );
}
