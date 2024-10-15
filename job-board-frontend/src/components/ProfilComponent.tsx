'use client';

// import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { User } from '../models/user.model';

const ProfileComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const profileRoute = `${urlApi}/users/current`;
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const response = await fetch(profileRoute, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(",response", response);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log(",data", data);
        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchUserData();
  }, [profileRoute]);

  const renderProfile = () => {
    if (error) {
      return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    if (!user) {
      return <p className="text-center mt-4">Loading...</p>;
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
          <div className="mb-4">
            <label className="block text-gray-700">First Name:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.firstname}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.lastname}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.phone}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Experiences:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.experiences}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Studies:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.studies}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Skills:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.skills}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Skills:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.skills}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Business Sector:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.business_sector}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.location}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Target Job:</label>
            <p className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-100">{user.target_job}</p>
          </div>
        </div>
      </div>
    );
  };

  return renderProfile();
};

export default ProfileComponent;