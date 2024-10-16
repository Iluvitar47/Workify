'use client';

import { Advertisement } from '@/models/advertisements.model';
import React, { useState, useEffect } from 'react';

const AdvertisementsComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const advertisementsRoute = `${urlApi}/advertisements`;
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const bearer = 'Bearer ';

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

  const renderUsersTable = () => {
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
                  <button className="btn">modifier</button>
                  <button className="btn">supprimer</button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AdvertisementsComponents;
