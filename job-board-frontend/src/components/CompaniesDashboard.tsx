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
  const [formDataAdd, setFormDataAdd] = useState<Partial<Company>>({});
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const bearer = 'Bearer ';

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

      setRefresh(!refresh);
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
        name: formDataAdd.name,
        email: formDataAdd.email,
        phone: formDataAdd.phone,
        business_sector: formDataAdd.business_sector,
        location: formDataAdd.location,
        employees: formDataAdd.employees,
        description: formDataAdd.description,
      };
  
      const response = await fetch(`${companiesRoute}`, {
        method: 'POST',
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
        setSuccessMessage('User updated successfully!');
      } else {
        setSuccessMessage('User updated successfully!');
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

  const renderCompaniesTable = () => {
    return (
      <div className="flex justify-center items-center flex-col ">
        <h2 className=" mb-6 mt-12 text-center text-info">Companies</h2>
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
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className='border-t border-b border-x-dark'>
              {companies.map((company, index) => (
                <tr key={index}>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.id}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.name}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.email}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.phone}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.business_sector}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.location}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">{company.employees}</td>
                  <td className="border-t border-b border-x-dark px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setCompany(company); setFormData(company); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deleteCompany(company.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {showModal && 
                <Modal onClose={() => setShowModal(false)}>
                  <div className="flex justify-center items-center min-h-screen pt-20">
                    <form onSubmit={handleSubmit} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                      <h2 className="text-2xl font-bold mb-6 text-center">Edit Application</h2>
                      {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                      <div className="mb-4">
                        <label className="block text-dark ">ID:</label>
                        <input
                          name="id"
                          value={formData.id || ''}
                          disabled
                          onChange={handleChange}
                          className="w-full  text-dark p-3 bg-alert_info  bg-opacity-5 rounded-md mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Name:</label>
                        <textarea
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Email:</label>
                        <input
                          type='email'
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Phone:</label>
                        <input
                          type='tel'
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Business sector:</label>
                        <input
                          type='text'
                          name="business_sector"
                          value={formData.business_sector || ''}
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
                        <label className="block text-dark font-semibold">Employees:</label>
                        <input
                          type='number'
                          name="employees"
                          value={formData.employees || ''}
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
                          className="w-96  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
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
        <button className="btn" onClick={() => { setShowAddModal(true); }}>Add Company</button>
        {showAddModal && 
            <Modal onClose={() => setShowAddModal(false)}>
                <div className="flex justify-center items-center min-h-screen">
                    <form onSubmit={handleSubmitAdd} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add Company</h2>
                        {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Name:</label>
                        <textarea
                          name="name"
                          value={formDataAdd.name || ''}
                          onChange={handleChangeAdd}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Email:</label>
                        <input
                          type='email'
                          name="email"
                          value={formDataAdd.email || ''}
                          onChange={handleChangeAdd}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Phone:</label>
                        <input
                          type='tel'
                          name="phone"
                          value={formDataAdd.phone || ''}
                          onChange={handleChangeAdd}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Business sector:</label>
                        <input
                          type='text'
                          name="business_sector"
                          value={formDataAdd.business_sector || ''}
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
                        <label className="block text-dark font-semibold">Employees:</label>
                        <input
                          type='number'
                          name="employees"
                          value={formDataAdd.employees || ''}
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
                        <button
                            type="submit"
                            className="bg-interact text-fullblack py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
                        >
                            Add Company
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
      {renderCompaniesTable()}
    </>
  );
};

export default CompaniesDashboard;
