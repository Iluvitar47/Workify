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
  const [formDataAdd, setFormDataAdd] = useState<Partial<Application>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const bearer = 'Bearer ';

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Invalid credentials');
    }
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
        throw new Error('Failed to update application data');
      }
  
      if (response.status === 202) {
        setSuccessMessage('Application updated successfully!');
      } else {
        const updatedApplication = await response.json();
        setApplication(updatedApplication);
        setSuccessMessage('Application updated successfully!');

        useEffect(() => {
          const interval = setInterval(() => {
              fetchData();
          }, 1000, []);
      
          return () => clearInterval(interval);
        }, []);
      }
      setRefresh(!refresh);
  } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteApplication = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${updateApplicationsRoute}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      setShowModal(false);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error:', err);
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
        isRead: formDataAdd.isRead,
        message: formDataAdd.message,
        people_id: formDataAdd.people_id,
        advertisement_id: formDataAdd.advertisement_id
      };

      if (requestBody.isRead !== "true" && requestBody.isRead !== "false") {
        throw new Error('Must be true or false');
      } else {
        if (requestBody.isRead === "true") {
          requestBody.isRead = true;
        }
        if (requestBody.isRead === "false") {
          requestBody.isRead = false;
        }
      }
  
      const response = await fetch(`${applciationsRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

  
      if (!response.ok) {
        throw new Error('Failed to update application data');
      }
  
      if (response.status === 202) {
        setSuccessMessage('Application updated successfully!');
      } else {
        setSuccessMessage('Application updated successfully!');
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

  const renderApplicationsTable = () => {
    return (
      <div className="flex justify-center items-center flex-col">
        <h2 className="mt-12 mb-6 text-center text-info">Applications</h2>
        <div className="mb-4">
          <table >
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
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
                  <td className="border-t border-b border-x-dark px-4 py-2">{application.id}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{application.message}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{application.people_id}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{application.advertisement_id}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{application.created_at}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setApplication(application); setFormData(application); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deleteApplication(application.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {showModal && 
                <Modal onClose={() => setShowModal(false)}>
                  <div className="flex justify-center items-center min-h-screen">
                    <form onSubmit={handleSubmit} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                      <h2 className="text-2xl font-bold mb-6 text-center">Edit Application</h2>
                      {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                      <div className="mb-4">
                        <label className="block text-dark">ID:</label>
                        <input
                          name="id"
                          value={formData.id || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 bg-alert_info  bg-opacity-5 rounded-md mt-1 "
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Message:</label>
                        <textarea
                          name="message"
                          value={formData.message || ''}
                          onChange={handleChange}
                          className="w-96  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark">People ID:</label>
                        <input
                          disabled
                          name="people_id"
                          value={formData.people_id || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 bg-alert_info  bg-opacity-5 rounded-md mt-1 "
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark">Advertisement ID:</label>
                        <input
                          disabled
                          name="advertisement_id"
                          value={formData.advertisement_id || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 bg-alert_info  bg-opacity-5 rounded-md mt-1 "
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
        <button className="btn" onClick={() => { setShowAddModal(true); }}>Add Application</button>
        {showAddModal && 
            <Modal onClose={() => setShowAddModal(false)}>
                <div className="flex justify-center items-center min-h-screen">
                    <form onSubmit={handleSubmitAdd} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add Application</h2>
                        {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                        <div className="mb-4">
                          <label className="block text-dark font-semibold">Message:</label>
                          <textarea
                            name="message"
                            value={formDataAdd.message || ''}
                            onChange={handleChangeAdd}
                            className="w-96  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-dark font-semibold">People ID:</label>
                          <input
                            type='number'
                            name="people_id"
                            value={formDataAdd.people_id || ''}
                            onChange={handleChangeAdd}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-dark font-semibold">Advertisement ID:</label>
                          <input
                            type='number'
                            name="advertisement_id"
                            value={formDataAdd.advertisement_id || ''}
                            onChange={handleChangeAdd}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                          />
                        </div>
                        <button
                            type="submit"
                            className="bg-interact text-fullblack py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
                        >
                            Add Application
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
      {renderApplicationsTable()}
    </>
  );
};

export default ApplicationsDashboard;
