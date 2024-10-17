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
      <div className="flex justify-center items-center pb-52 pt-16 bg-ligth dark:bg-dark w-full lg:w-1/2 ">
        <form onSubmit={handleSubmit} className="bg-ligth dark:bg-dark p-6 rounded-md shadow-md w-full max-w-sm add-card">
          <h3 className="text-1xl font-bold mb-4 text-center">Account Informations</h3>
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          {error && <p className="text-green-500 text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-fullblack dark:text-fullwhite">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full text-fullblack p-2 shadow-sm shadow-fullwhite hover:shadow-interact  dark:shadow transition-all rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-fullblack dark:text-fullwhite">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="w-full text-fullblack p-2 shadow-sm shadow-fullwhite hover:shadow-interact  dark:shadow transition-all rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex justify-center text-sm p-2 mt-6 "
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