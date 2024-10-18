'use client';

import { People } from '@/models/people.model';
import React, { useState, useEffect } from 'react';
import Modal from '../components/ModalsDashboard';

const PeopleComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const peopleRoute = `${urlApi}/people`;
    const updatePeopleRoute = `${urlApi}/people`;
  const [people, setPeople] = useState<People | null>(null);
  const [peopleAll, setPeopleAll] = useState<People[]>([]);
  const [formData, setFormData] = useState<Partial<People>>({});
  const [formDataAdd, setFormDataAdd] = useState<Partial<People>>({});
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
    await fetch(peopleRoute, {
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
        setPeopleAll(data);
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

      if (!people) {
        throw new Error('No people selected.');
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
        target_job: formData.target_job,
        location: formData.location,
      };

  
      const response = await fetch(`${updatePeopleRoute}/${people.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

  
      if (!response.ok) {
        throw new Error('Failed to update people data');
      }
  
      if (response.status === 202) {
        setSuccessMessage('People updated successfully!');
      } else {
        const updatedPeople = await response.json();
        setPeople(updatedPeople);
        setSuccessMessage('People updated successfully!');
      }
      setRefresh(!refresh);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deletePeople = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${updatePeopleRoute}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete people');
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
        firstname: formDataAdd.firstname,
        lastname: formDataAdd.lastname,
        email: formDataAdd.email,
        phone: formDataAdd.phone,
        experiences: formDataAdd.experiences,
        studies: formDataAdd.studies,
        skills: formDataAdd.skills,
        business_sector: formDataAdd.business_sector,
        target_job: formDataAdd.target_job,
        location: formDataAdd.location,
      };
  
      const response = await fetch(`${peopleRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

  
      if (!response.ok) {
        throw new Error('Failed to update people data');
      }
  
      if (response.status === 202) {
        setSuccessMessage('People updated successfully!');
      } else {
        setSuccessMessage('People updated successfully!');
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

  const renderPeopleTable = () => {
    return (
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-info mt-12 mb-6 text-center">People</h2>
        <div className="mb-4">
          <table>
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Firstname</th>
                <th className="px-4 py-2">Lastname</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Experiences</th>
                <th className="px-4 py-2">Studies</th>
                <th className="px-4 py-2">Skills</th>
                <th className="px-4 py-2">Business sector</th>
                <th className="px-4 py-2">Target Job</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {peopleAll.map((people, index) => (
                <tr key={index}>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.id}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.firstname}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.lastname}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.email}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.phone}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.experiences}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.studies}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.skills}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.business_sector}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.target_job}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{people.location}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setPeople(people); setFormData(people); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deletePeople(people.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {showModal && 
                <Modal onClose={() => setShowModal(false)}>
                  <div className="flex justify-center items-center min-h-screen pt-80">
                    <form onSubmit={handleSubmit} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                      <h2 className="text-2xl font-bold mb-6 text-center">Edit Advertisement</h2>
                      {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                      <div className="mb-4">
                        <label className="block text-dark">ID:</label>
                        <input
                          name="id"
                          value={formData.id || ''}
                          disabled
                          onChange={handleChange}
                          className="w-full  text-dark p-3 bg-alert_info  bg-opacity-5 rounded-md mt-1 "
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Firstname:</label>
                        <input
                            type='text'
                            name="firstname"
                            value={formData.firstname || ''}
                            onChange={handleChange}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Lastname:</label>
                        <input
                          name="lastname"
                          value={formData.lastname || ''}
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
                        <label className="block text-dark font-semibold">Experiences:</label>
                        <input
                            type='text'
                          name="experiences"
                          value={formData.experiences || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Studies:</label>
                        <input
                            type='text'
                          name="studies"
                          value={formData.studies || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-dark font-semibold">Skills:</label>
                        <input
                            type='text'
                          name="skills"
                          value={formData.skills || ''}
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
                        <label className="block text-dark font-semibold">Target job:</label>
                        <input
                            type='text'
                          name="target_job"
                          value={formData.target_job || ''}
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
        <button className="btn" onClick={() => { setShowAddModal(true); }}>Add People</button>
        {showAddModal && 
            <Modal onClose={() => setShowAddModal(false)}>
                <div className="flex justify-center items-center min-h-screen pt-80">
                    <form onSubmit={handleSubmitAdd} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add People</h2>
                        {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Firstname:</label>
                            <input
                                type='text'
                                name="firstname"
                                value={formDataAdd.firstname || ''}
                                onChange={handleChangeAdd}
                                className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Lastname:</label>
                            <input
                            name="lastname"
                            value={formDataAdd.lastname || ''}
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
                            <label className="block text-dark font-semibold">Experiences:</label>
                            <input
                                type='text'
                            name="experiences"
                            value={formDataAdd.experiences || ''}
                            onChange={handleChangeAdd}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Studies:</label>
                            <input
                                type='text'
                            name="studies"
                            value={formDataAdd.studies || ''}
                            onChange={handleChangeAdd}
                            className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-dark font-semibold">Skills:</label>
                            <input
                                type='text'
                            name="skills"
                            value={formDataAdd.skills || ''}
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
                            <label className="block text-dark font-semibold">Target job:</label>
                            <input
                                type='text'
                            name="target_job"
                            value={formDataAdd.target_job || ''}
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
                        <button
                            type="submit"
                            className="bg-interact text-fullblack py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
                        >
                            Add People
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
      {renderPeopleTable()}
    </>
  );
};

export default PeopleComponents;
