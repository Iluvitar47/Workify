'use client';

import { Advertisement } from '@/models/advertisements.model';
import React, { useState, useEffect } from 'react';
import Modal from '../components/ModalsDashboard';
import { useRouter } from 'next/navigation';

const AdvertisementsComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const advertisementsRoute = `${urlApi}/advertisements`;
    const updateAdvertisementsRoute = `${urlApi}/advertisements`;
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [formData, setFormData] = useState<Partial<Advertisement>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const bearer = 'Bearer ';
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      await fetch(advertisementsRoute, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearer + token,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Invalid credentials');
          }
          return res.json();
        })
        .then((data) => {
          setAdvertisements(data);
        })
        .catch((err) => {
          setError(err.message);
        });
    };

    fetchData();
  }, []);

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

      if (!advertisement) {
        throw new Error('Advertisement not found');
      }
  
      const requestBody = {
        title: formData.title,
        description: formData.description,
        wages: formData.wages,
        location: formData.location,
        working_times: formData.working_times,
      };

  
      const response = await fetch(`${updateAdvertisementsRoute}/${advertisement.id}`, {
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
        setSuccessMessage('Advertisement updated successfully!');
      } else {
        const updatedAdvertisement = await response.json();
        setAdvertisement(updatedAdvertisement);
        setSuccessMessage('Advertisement updated successfully!');
        router.push('/');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteAdvertisement = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${updateAdvertisementsRoute}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete advertisement');
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error:', err);
      setError((err as Error).message);
    }
  }

  const renderAdvertisementsTable = () => {
    return (
      <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Advertisements</h2>
        <div className="mb-4">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Wages</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Working times</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Created at</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {advertisements.map((advertisement, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{advertisement.id}</td>
                  <td className="border px-4 py-2">{advertisement.title}</td>
                  <td className="border px-4 py-2">{advertisement.wages}</td>
                  <td className="border px-4 py-2">{advertisement.location}</td>
                  <td className="border px-4 py-2">{advertisement.working_times}</td>
                  <td className="border px-4 py-2">{advertisement.company_id}</td>
                  <td className="border px-4 py-2">{advertisement.created_at}</td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setAdvertisement(advertisement); setFormData(advertisement); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deleteAdvertisement(advertisement.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {showModal && 
                <Modal onClose={() => setShowModal(false)}>
                  <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
                      <h2 className="text-2xl font-bold mb-6 text-center">Edit Advertisement</h2>
                      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                      <div className="mb-4">
                        <label className="block text-gray-700">ID:</label>
                        <input
                          type="number"
                          name="id"
                          value={formData.id || ''}
                          disabled
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Title:</label>
                        <input
                            type='text'
                          name="title"
                          value={formData.title || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Description:</label>
                        <textarea
                          name="description"
                          value={formData.description || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Wages:</label>
                        <input
                            type='number'
                          name="wages"
                          value={formData.wages || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Location:</label>
                        <input
                            type='text'
                          name="location"
                          value={formData.location || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Working times:</label>
                        <input
                            type='text'
                          name="working_times"
                          value={formData.working_times || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Company ID:</label>
                        <input
                            disabled
                            type='number'
                          name="company_id"
                          value={formData.company_id || ''}
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
                </Modal>
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      {error && <div className="error">{error}</div>}
      {renderAdvertisementsTable()}
    </>
  );
};

export default AdvertisementsComponents;
