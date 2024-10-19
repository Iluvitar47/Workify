'use client';

import React, { useState, useEffect } from 'react';
import type { Company } from '../models/companies.model';
import type { Advertisement } from '../models/advertisements.model';
import type { People } from '../models/people.model';
import Modal from './ModalsDashboard';
import { Email } from '@/models/email.model';

const AdvertisementCards: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<People>>({});
  const [token, setToken] = useState<string | null>(null);
  const urlApi = process.env.NEXT_PUBLIC_URL_API;

  // Fetch advertisements
  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await fetch(`${urlApi}/advertisements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch advertisements');
        }
        const data = await response.json();
        setAdvertisements(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred');
        }
      }
    };

    fetchAdvertisements();
  }, [urlApi]); 

  const toggleExpand = (id: number) => {
    setExpandedIds((prevExpandedIds) =>
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter((expandedId) => expandedId !== id)
        : [...prevExpandedIds, id],
    );
  };

  const fetchCompany = async (companyId: number): Promise<Company | null> => {
    try {
      const response = await fetch(`${urlApi}/companies/id/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch company');
      }
      const data = await response.json();
      return data as Company;
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
  };

  const [companies, setCompanies] = useState<{ [key: number]: Company | null }>({});

  useEffect(() => {
    const fetchCompanies = async () => {
      const companyData: { [key: number]: Company | null } = {};
      for (const ad of advertisements) {
        const company = await fetchCompany(ad.company_id);
        companyData[ad.company_id] = company;
      }
      setCompanies(companyData);
    };

    if (advertisements.length > 0) {
      fetchCompanies();
    }
  }, [advertisements]);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleSubmitNotLogin = (id: number) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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

      const responsePeople = await fetch(`${urlApi}/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!responsePeople.ok) {
        throw new Error('Failed to create people');
      }

      const dataPeople = await responsePeople.json();

      const getCompanyEmail = advertisements.find((ad) => ad.id === id)?.company_id;

      const emailMessage: Email = {
        emailReceiver: getCompanyEmail !== undefined ? String(companies[getCompanyEmail]?.email) : '',
        emailSender: String(formData.email),
        subject: `Candidature de ${formData.firstname} ${formData.lastname} pour le poste de ${formData.target_job}`,
        message: `Bonjour, je m'appelle ${formData.firstname} ${formData.lastname} et je vous envoie ma candidature pour le poste de ${formData.target_job} que vous avez posté.
          
          Voici mes informations:
            - Email: ${formData.email}
            - Téléphone: ${formData.phone}
            - Expériences: ${formData.experiences}
            - Etudes: ${formData.studies}
            - Compétences: ${formData.skills}
            - Secteur d'activité: ${formData.business_sector}
            - Poste ciblé: ${formData.target_job}
            - Lieu: ${formData.location}
        `
      };

      const requestBodyApply = {
        message: emailMessage.message,
        advertisement_id: id,
        people_id: dataPeople.people.id,
      }

      const responseApply = await fetch(`${urlApi}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyApply),
      });

      if (!responseApply.ok) {
        throw new Error('Failed to creae application');
      }
  
      if (responseApply.status === 202) {
        setSuccessMessage('You successfully applied to the job!');
      } else {
        setSuccessMessage('You successfully applied to the job!');
        await fetch(`${urlApi}/emails/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailMessage),
        });
    }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmitLogin = (id: number) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const responseCurrent = await fetch(`${urlApi}/users/current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const dataCurrent = await responseCurrent.json();
      const peopleCurrentId = dataCurrent.people_id;

      const responsePeople = await fetch(`${urlApi}/people/id/${peopleCurrentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const dataPeople = await responsePeople.json();

      const requestBody = {
        firstname: dataPeople.firstname,
        lastname: dataPeople.lastname,
        email: dataPeople.email,
        phone: dataPeople.phone,
        experiences: dataPeople.experiences,
        studies: dataPeople.studies,
        skills: dataPeople.skills,
        business_sector: dataPeople.business_sector,
        target_job: dataPeople.target_job,
        location: dataPeople.location,
      }

      const getCompanyEmail = advertisements.find((ad) => ad.id === id)?.company_id;

      const emailMessage: Email = {
        emailReceiver: getCompanyEmail !== undefined ? String(companies[getCompanyEmail]?.email) : '',
        emailSender: String(requestBody.email),
        subject: `Candidature de ${requestBody.firstname} ${requestBody.lastname} pour le poste de ${requestBody.target_job}`,
        message: `Bonjour, je m'appelle ${requestBody.firstname} ${requestBody.lastname} et je vous envoie ma candidature pour le poste de ${requestBody.target_job} que vous avez posté.
          
          Voici mes informations:
            - Email: ${requestBody.email}
            - Téléphone: ${requestBody.phone}
            - Expériences: ${requestBody.experiences}
            - Etudes: ${requestBody.studies}
            - Compétences: ${requestBody.skills}
            - Secteur d'activité: ${requestBody.business_sector}
            - Poste ciblé: ${requestBody.target_job}
            - Lieu: ${requestBody.location}
        `
      };

      const requestBodyApply = {
        message: emailMessage.message,
        advertisement_id: id,
        people_id: dataPeople.id,
      }

      const responseApply = await fetch(`${urlApi}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBodyApply),
      });

      if (!responseApply.ok) {
        throw new Error('Failed to creae application');
      }
  
      if (responseApply.status === 202) {
        setSuccessMessage('You successfully applied to the job!');
      } else {
        setSuccessMessage('You successfully applied to the job!');
        await fetch(`${urlApi}/emails/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailMessage),
        });
    }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderAdvertisementsWithCompanies = (ads: Advertisement[]) => {
    return (
      <div className="grid grid-flow-row grid-cols-1 pt-20 pb-64">
        {ads.map((ad) => (
          <div key={ad.id} className="add-card pb-5 my-5 mx-6 sm:mx-12 p-2 sm:p-4">
            <h1 className="text-2xl font-bold">{ad.title}</h1>
            {/* Fetch company data dynamically */}
            {companies[ad.company_id] ? (
              <h2 className="mt-2 text-xl text-info">{companies[ad.company_id]?.name}</h2>
            ) : null}
            <p className="mt-2 text-base">
              <strong>Lieu :</strong> {ad.location}
            </p>
            {expandedIds.includes(ad.id) ? (
              <>
                <p className="mt-2 text-base">
                  <strong>Description :</strong> {ad.description}
                </p>
                <p className="mt-2 text-base">
                  <strong>Salaire :</strong> {ad.wages} €/an
                </p>
                <p className="mt-2 text-base">
                  <strong>Horaires :</strong> {ad.working_times}
                </p>
                <div className='absolute'>
                <button
                  onClick={() => { setShowModal(true); }}
                  className="button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex items-center justify-center text-sm p-2 mt-6 col-span-2">
                  Postuler
                </button>
                {showModal && 
                  <Modal onClose={() => setShowModal(false)}>
                    <div className="flex justify-center items-center min-h-screen">
                      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
                      {!token ? (
                        <form onSubmit={handleSubmitNotLogin(ad.id)} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md mt-96">
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Firstname:</label>
                            <input
                              type='text'
                              name="firstname"
                              value={formData.firstname || ''}
                              onChange={handleChange}
                              className="w-full sm:w-96   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact "
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Lastname:</label>
                            <input
                              type='text'
                              name="lastname"
                              value={formData.lastname || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Email:</label>
                            <input
                              type='email'
                              name="email"
                              value={formData.email || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Phone:</label>
                            <input
                              type='tel'
                              name="phone"
                              value={formData.phone || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Experiences:</label>
                            <input
                              type='text'
                              name="experiences"
                              value={formData.experiences || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Studies:</label>
                            <input
                              type='text'
                              name="studies"
                              value={formData.studies || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Skills:</label>
                            <input
                              type='text'
                              name="skills"
                              value={formData.skills || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Business sector:</label>
                            <input
                              type='text'
                              name="business_sector"
                              value={formData.business_sector || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Target job:</label>
                            <input
                              type='text'
                              name="target_job"
                              value={formData.target_job || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-dark font-semibold">Location:</label>
                            <input
                              type='text'
                              name="location"
                              value={formData.location || ''}
                              onChange={handleChange}
                              className="w-full   text-dark p-3 border border-interact border-opacity-55 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                            />
                          </div>
                          <button
                            type="submit"
                            className="button  rounded h-10 transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite w-full"
                          >
                            Apply
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleSubmitLogin(ad.id)} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
                          <p>Vous êtes connecté, vous pouvez postuler à cette offre directement, vos informations personnelles transmises seront envoyés au destinataire de l&apos;offre.</p>

                          <button                            
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                          >
                            Apply
                          </button>
                        </form>
                      )}
                    </div>
                  </Modal>
                }
                </div>
              </>
            ) : (
              <p className="mt-2 text-base">
                <strong>Description :</strong> {ad.description.substring(0, 100)}...
              </p>
            )}
            <div className="grid grid-cols-6">
              <div className="col-span-4"></div>
              <button
                className="button button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex items-center justify-center text-sm p-2 mt-6 col-span-2"
                onClick={() => toggleExpand(ad.id)}
              >
                {expandedIds.includes(ad.id) ? 'Réduire' : 'En savoir plus'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {advertisements.length > 0 ? (
        renderAdvertisementsWithCompanies(advertisements)
      ) : (
        <p>Loading advertisements...</p>
      )}
    </div>
  );
};

export default AdvertisementCards;
