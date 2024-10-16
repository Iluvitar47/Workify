'use client';

import { Application } from '../models/application.model';
import React, { useState, useEffect } from 'react';
import Modal from '../components/ModalsDashboard';

const ApplicationsDashboard: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const applciationsRoute = `${urlApi}/applications`;
  const updateApplicationsRoute = `${urlApi}/applications`;
  const [application, setApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Application>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const bearer = 'Bearer ';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      await fetch(applciationsRoute, {
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
          setApplications(data);
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
      if (!application) {
        throw new Error('Application not found');
      }
  
      const requestBody = {
        message: formData.message,
      };
  
      const response = await fetch(`${updateApplicationsRoute}/${application.id}`, {
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
        setSuccessMessage('Application updated successfully!');
      } else {
        // If a JSON response is expected
        const updatedUser = await response.json();
        setApplication(updatedUser);
        setSuccessMessage('Application updated successfully!');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const renderUsersTable = () => {
    return (
      <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Applications</h2>
        <div className="mb-4">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Read</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Advertisement</th>
                <th className="px-4 py-2">Created at</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{application.id}</td>
                  <td className="border px-4 py-2">{application.isRead}</td>
                  <td className="border px-4 py-2">{application.message}</td>
                  <td className="border px-4 py-2">{application.people_id}</td>
                  <td className="border px-4 py-2">{application.advertisement_id}</td>
                  <td className="border px-4 py-2">{application.created_at}</td>
                    <button className="btn" onClick={() => setShowModal(true)}>modifier</button>
                    {showModal && 
                      <Modal onClose={() => setShowModal(false)}>
                        <div className="flex justify-center items-center min-h-screen bg-gray-100">
                          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
                            <h2 className="text-2xl font-bold mb-6 text-center">Edit Application</h2>
                            {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                            <div className="mb-4">
                              <label className="block text-gray-700">ID:</label>
                              <input
                                type="number"
                                name="id"
                                value={formData.id || '4'}
                                disabled
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700">Message:</label>
                              <textarea
                                name="message"
                                value={formData.message || ''}
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
                  <button className="btn">supprimer</button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal"></div>
      </div>
    );
  };

  return (
    <>
      {error && <div className="error">{error}</div>}
      {renderUsersTable()}
    </>
  );
};

export default ApplicationsDashboard;
