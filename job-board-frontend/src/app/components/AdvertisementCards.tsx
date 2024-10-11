'use client';

import React, { useState } from 'react';
import type { Company } from '../../models/companies.model';
import type { Advertisement } from '../../models/advertisements.model';
import MiddlewareComponent from '../../middlewares/error.middleware';

const AdvertisementCards: React.FC = () => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const route = 'http://localhost:5558/api/v1/advertisements'; // API route for fetching advertisements (not created yet)

  const toggleExpand = (id: number) => {
    setExpandedIds((prevExpandedIds) =>
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter((expandedId) => expandedId !== id)
        : [...prevExpandedIds, id]
    );
  };

  const renderAdvertisements = (data: Advertisement[]) => {
    const advertisements = data as Advertisement[];

    if (advertisements.length === 0) return <div>Aucune annonce disponible.</div>;

    return (
      <div className="grid grid-flow-row grid-cols-1">
        {advertisements.map((ad) => (
          <div key={ad.id} className="add-card pb-5 my-5 mx-6 sm:mx-12 p-2 sm:p-4">
            <h1 className="text-2xl font-bold">{ad.title}</h1>
            {ad.company && (
              <h2 className="mt-2 text-xl text-info">{(ad.company as Company).name}</h2>
            )}
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
    <MiddlewareComponent route={route} render={renderAdvertisements} />
  );
};

export default AdvertisementCards;
