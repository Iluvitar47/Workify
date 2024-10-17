'use client';

import React, { useEffect, useState } from 'react';
import type { User } from '../models/user.model';
import type { People } from '../models/people.model';

const ProfilePersonalInformationComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const userRoute = `${urlApi}/users/current`;
  const updateRoute = `${urlApi}/people`;
  const peopleRoute = `${urlApi}/people/id/`;
  const [user, setUser] = useState<User | null>(null);
  const [people, setPeople] = useState<Partial<People>>({});
  const [formData, setFormData] = useState<Partial<People>>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeopleData = async () => {
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

        const peopleResponse = await fetch(peopleRoute + data.people_id, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!peopleResponse.ok) {
          throw new Error('Failed to fetch people data');
        }

        const peopleData = await peopleResponse.json();
        setPeople(peopleData);
        setFormData(peopleData);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchPeopleData();
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
      const currentPeopleID = currentUser ? JSON.parse(currentUser).people_id : null;

      if (!token) {
        throw new Error('No authentication token found.');
      }
      if (!user) {
        throw new Error('User not found');
      }

      if (currentPeopleID !== people.id) {
        throw new Error("Unauthorized action. You cannot modify another user's data.");
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

      const response = await fetch(`${updateRoute}/${user.people_id}`, {
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
        const updatedPeople = await response.json();
        setPeople(updatedPeople);
        setSuccessMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };


  const renderEditProfile = () => {
    if (!people) {
      return <p className="text-center mt-4">Loading...</p>;
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
          <h3 className="text-1xl font-bold mb-4 text-center">Personal Informations</h3>
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          {error && <p className="text-green-500 text-center mb-4">{error}</p>}
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
          <div className='mb-4'>
            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname || ''}
              onChange={handleChange}
              pattern="^[A-Za-z]+$"
              title="Last name must be only alphabetic"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <div className='mb-4'>

            <label className="block text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              pattern="^\+?\d{10,15}$"
              title="Phone number must be valid (e.g., +1234567890)"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

export default ProfilePersonalInformationComponent;