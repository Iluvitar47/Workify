'use client';

import { Application } from '../models/application.model';
import React, { useState, useEffect } from 'react';

const ApplicationsDashboard: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const applciationsRoute = `${urlApi}/applications`;
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  const updateApplication = async (id: number) => {
    await fetch(`${applciationsRoute}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer + token,
      },
      body: JSON.stringify({ isRead: true }),
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

  const showAppliacation = async (id: number) => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
          <p>{id}</p>
        </div>
      </div>
    );
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
                  <button className="btn">modifier</button>
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
