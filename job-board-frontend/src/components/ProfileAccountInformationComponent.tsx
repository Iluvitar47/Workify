'use client';

import React, { useEffect, useState } from 'react';
import type { User } from '../models/user.model';

const ProfileAccountInformationComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const userRoute = `${urlApi}/users/current`;
  const updateRoute = `${urlApi}/users`;
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found.');
        }

        const response = await fetch(userRoute, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
        setFormData(data);
        console.log('data', data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchUserData();
  }, [userRoute]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const currentUser = localStorage.getItem('user');
      const currentUserID = currentUser ? JSON.parse(currentUser).id : null;
      console.log('currentPeopleID', currentUserID);

      if (!token) {
        throw new Error('No authentication token found.');
      }
      if (!user) {
        throw new Error('User not found');
      }

      if (currentUserID !== user.id) {
        throw new Error("Unauthorized action. You cannot modify another user's data.");
      }

      const requestBody = {
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(`${updateRoute}/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      if (response.status === 202) {
        setSuccessMessage('Profile updated successfully!');
      } else {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };


  const renderEditProfile = () => {
    if (!user) {
      return <p className="text-center mt-4">Loading...</p>;
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
          <h3 className="text-1xl font-bold mb-4 text-center">Account Informations</h3>
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          {error && <p className="text-green-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    );
  };

  return renderEditProfile();
};

export default ProfileAccountInformationComponent;