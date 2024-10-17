'use client';

import { Company } from '../models/companies.model';
import React, { useState, useEffect } from 'react';
import Modal from './ModalsDashboard';

const CompaniesDashboard: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const companiesRoute = `${urlApi}/companies`;
  const updateCompaniesRoute = `${urlApi}/companies`;
  const [company, setCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [showModal, setShowModal] = useState(false);
  const bearer = 'Bearer ';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Invalid credentials');
      }

      await fetch(companiesRoute, {
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
          setCompanies(data);
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
      
      if (!company) {
        throw new Error('Company not found');
      }

      const requestBody = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business_sector: formData.business_sector,
        location: formData.location,
        employees: formData.employees,
        description: formData.description,
      };

      const response = await fetch(`${updateCompaniesRoute}/${company.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearer + token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      if (response.status === 202) {
        setSuccessMessage('Company updated successfully!');
      } else {
        const updatedCompany = await response.json();
        setCompany(updatedCompany);
        setSuccessMessage('Company updated successfully!');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteCompany = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${updateCompaniesRoute}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete company');
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error:', err);
      setError((err as Error).message);
    }
  };

  const renderCompaniesTable = () => {
    return (
      <div className="flex justify-center items-center flex-col min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Companies</h2>
        <div className="mb-4">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Business Sector</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Employees</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{company.id}</td>
                  <td className="border px-4 py-2">{company.name}</td>
                  <td className="border px-4 py-2">{company.email}</td>
                  <td className="border px-4 py-2">{company.phone}</td>
                  <td className="border px-4 py-2">{company.business_sector}</td>
                  <td className="border px-4 py-2">{company.location}</td>
                  <td className="border px-4 py-2">{company.employees}</td>
                  <td className="border px-4 py-2">{company.description}</td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setCompany(company); setFormData(company); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deleteCompany(company.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
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
                          value={formData.id || ''}
                          disabled
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Name:</label>
                        <textarea
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input
                          type='email'
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Phone:</label>
                        <input
                          type='tel'
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Business sector:</label>
                        <input
                          type='text'
                          name="business_sector"
                          value={formData.business_sector || ''}
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
                        <label className="block text-gray-700">Employees:</label>
                        <input
                          type='number'
                          name="employees"
                          value={formData.employees || ''}
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
      {renderCompaniesTable()}
    </>
  );
};

export default CompaniesDashboard;
