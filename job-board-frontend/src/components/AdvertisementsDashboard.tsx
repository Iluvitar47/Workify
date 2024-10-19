'use client';

import { Advertisement } from '@/models/advertisements.model';
import React, { useState, useEffect } from 'react';
import Modal from '../components/ModalsDashboard';

const AdvertisementsComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const advertisementsRoute = `${urlApi}/advertisements`;
    const updateAdvertisementsRoute = `${urlApi}/advertisements`;
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [formData, setFormData] = useState<Partial<Advertisement>>({});
  const [formDataAdd, setFormDataAdd] = useState<Partial<Advertisement>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const bearer = 'Bearer ';

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Invalid credentials');
    }
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

  useEffect(() => {
    fetchData();
  }, [refresh]);

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
        setSuccessMessage('L\'offre a été modifiée avec succès!');
      } else {
        const updatedAdvertisement = await response.json();
        setAdvertisement(updatedAdvertisement);
        setSuccessMessage('L\'offre a été modifiée avec succès!');
      }
      setRefresh(!refresh);
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
      setRefresh(!refresh);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found.');
      }
  
      const requestBody = {
        title: formDataAdd.title,
        description: formDataAdd.description,
        wages: formDataAdd.wages,
        location: formDataAdd.location,
        working_times: formDataAdd.working_times,
        company_id: formDataAdd.company_id,
      };
  
      const response = await fetch(`${advertisementsRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

  
      if (!response.ok) {
        throw new Error('Failed to update advertisement data');
      }
  
      if (response.status === 202) {
        setSuccessMessage('L\'offre a été modifiée avec succès!');
      } else {
        setSuccessMessage('L\'offre a été modifiée avec succès!');
      }

        setRefresh(!refresh);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDataAdd({
      ...formDataAdd,
      [name]: value,
    });
  };

  const renderAdvertisementsTable = () => {
    return (
      <div className="flex justify-center items-center flex-col">
        <h2 className="mt-12 mb-6 text-center text-info">Advertisements</h2>
        <div className="mb-4">
          <table >
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Wages</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Working times</th>
                <th className="px-4 py-2">Company ID</th>
                <th className="px-4 py-2">Created at</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className='border-t border-b border-x-dark'>
              {advertisements.map((advertisement, index) => (
                <tr key={index}>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.id}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.title}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.wages}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.location}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.working_times}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.company_id}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{advertisement.created_at}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setAdvertisement(advertisement); setFormData(advertisement); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deleteAdvertisement(advertisement.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {showModal && 
                <Modal onClose={() => setShowModal(false)}>
                  <div className="flex justify-center items-center min-h-screen w-full mt-16">
                    <form onSubmit={handleSubmit} className="bg-fullwhite p-8 rounded-lg shadow-lg   text-dark max-w-md">
                      <h2 className="text-2xl font-bold mb-6 text-center">Edit Advertisement</h2>
                      {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">ID:</label>
                        <input
                          type="number"
                          name="id"
                          value={formData.id || ''}
                          disabled
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Title:</label>
                        <input
                            type='text'
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Description:</label>
                        <textarea
                          name="description"
                          value={formData.description || ''}
                          onChange={handleChange}
                          className="w-96 text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Wages:</label>
                        <input
                            type='number'
                            name="wages"
                            value={formData.wages || ''}
                            onChange={handleChange}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Location:</label>
                        <input
                            type='text'
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Working times:</label>
                        <input
                            type='text'
                          name="working_times"
                          value={formData.working_times || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Company ID:</label>
                        <input
                            disabled
                            type='number'
                          name="company_id"
                          value={formData.company_id || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-interact text-fullblack py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
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
        <button className="btn" onClick={() => { setShowAddModal(true); }}>Add Advertisement</button>
        {showAddModal && 
            <Modal onClose={() => setShowAddModal(false)}>
                <div className="flex justify-center items-center min-h-screen">
                    <form onSubmit={handleSubmitAdd} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add Advertisement</h2>
                        {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Title:</label>
                            <input
                                type='text'
                                name="title"
                                value={formDataAdd.title || ''}
                                onChange={handleChangeAdd}
                                className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Description:</label>
                            <textarea
                                name="description"
                                value={formDataAdd.description || ''}
                                onChange={handleChangeAdd}
                                className="w-96  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Wages:</label>
                            <input
                                type='number'
                                name="wages"
                                value={formDataAdd.wages || ''}
                                onChange={handleChangeAdd}
                                className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Location:</label>
                            <input
                                type='text'
                                name="location"
                                value={formDataAdd.location || ''}
                                onChange={handleChangeAdd}
                                className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Working times:</label>
                            <input
                                type='text'
                                name="working_times"
                                value={formDataAdd.working_times || ''}
                                onChange={handleChangeAdd}
                                className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Company ID:</label>
                            <input
                                type='number'
                                name="company_id"
                                value={formDataAdd.company_id || ''}
                                onChange={handleChangeAdd}
                                className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-interact text-fullblack py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
                        >
                            Add Advertisement
                        </button>
                    </form>
                </div>
            </Modal>
        }
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
