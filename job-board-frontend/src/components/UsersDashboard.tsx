'use client';

import { User } from '@/models/user.model';
import React, { useState } from 'react';

const UsersComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const usersRoute = `${urlApi}/users`;
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    await fetch(usersRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer' + token,
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
          console.log(users);
        })
        .catch((err) => {
          setError(err.message);
        });
    };
    fetchData();

  const renderUsersTable = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.permission}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.first_name}</td>
                  <td className="border px-4 py-2">{user.last_name}</td>
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
