'use client';

import { Company } from '../models/companies.model';
import React, { useState, useEffect } from 'react';

const CompaniesDashboard: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const companiesRoute = `${urlApi}/companies`;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const renderUsersTable = () => {
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

export default CompaniesDashboard;
