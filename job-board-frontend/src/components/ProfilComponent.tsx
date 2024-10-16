'use client';

import React, { useEffect, useState } from 'react';
import type { User } from '../models/user.model';

const EditProfileComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const profileRoute = `${urlApi}/users/current`;
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

        const response = await fetch(profileRoute, {
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
  }, [profileRoute]);

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
      if (!token) {
        throw new Error('No authentication token found.');
      }
      if (!user) {
        throw new Error('User not found');
      }
  
      const requestBody = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        experiences: formData.experiences,
        studies: formData.studies,
        skills: formData.skills,
        business_sector: formData.business_sector,
        location: formData.location,
        target_job: formData.target_job,
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
        // Assuming no content or just a success message, handle success directly
        setSuccessMessage('Profile updated successfully!');
      } else {
        // If a JSON response is expected
        const updatedUser = await response.json();
        setUser(updatedUser);
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };
  

  const renderEditProfile = () => {
    if (error) {
      return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    if (!user) {
      return <p className="text-center mt-4">Loading...</p>;
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            name="lastname"
            value={formData.lastname || ''}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Last name must be only alphabetic"
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            pattern="^\+?\d{10,15}$"
            title="Phone number must be valid (e.g., +1234567890)"
            className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mb-4">
            <label className="block text-gray-700">Experiences:</label>
            <textarea
              name="experiences"
              value={formData.experiences || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Studies:</label>
            <textarea
              name="studies"
              value={formData.studies || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Skills:</label>
            <textarea
              name="skills"
              value={formData.skills || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Business Sector:</label>
            <input
              type="text"
              name="business_sector"
              value={formData.business_sector || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Target Job:</label>
            <input
              type="text"
              name="target_job"
              value={formData.target_job || ''}
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

export default EditProfileComponent;