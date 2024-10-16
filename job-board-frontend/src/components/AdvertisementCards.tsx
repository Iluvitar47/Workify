'use client';

import React, { useState, useEffect } from 'react';
import type { Company } from '../models/companies.model';
import type { Advertisement } from '../models/advertisements.model';

const AdvertisementCards: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
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
        : [...prevExpandedIds, id]
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
      console.error(`Error fetching company with id ${companyId}:`, err);
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

  const renderAdvertisementsWithCompanies = (ads: Advertisement[]) => {
    return (
      <div className="grid grid-flow-row grid-cols-1">
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
