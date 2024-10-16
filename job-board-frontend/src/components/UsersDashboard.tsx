'use client';

import { User } from '@/models/user.model';
import React, { useState, useEffect } from 'react';

const UsersComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const usersRoute = `${urlApi}/users`;
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const bearer = 'Bearer ';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Invalid credentials');
      }
      await fetch(usersRoute, {
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
          setUsers(data);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Users</h2>
        <div className="mb-4">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Permission</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Firstname</th>
                <th className="px-4 py-2">Lastname</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.permission}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.firstname}</td>
                  <td className="border px-4 py-2">{user.lastname}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
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

export default UsersComponents;
