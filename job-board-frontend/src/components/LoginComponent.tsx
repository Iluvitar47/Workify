'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const loginRoute = `${urlApi}/users/login`;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(loginRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Invalid credentials');
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          const permission = JSON.parse(user).permission;
          if (permission === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/offers');
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const renderLoginForm = () => {
    return (
      <div className="flex justify-center items-center pb-32 pt-32 bg-gray-100">
        <form onSubmit={handleSubmit} className="p-6 rounded-md shadow-md w-full max-w-sm add-card">
          <h2 className="text-2xl mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label className="block text-fullblack dark:text-fullwhite">Email:</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-fullblack p-2 shadow-sm shadow-fullwhite hover:shadow-interact dark:shadow transition-all rounded mt-1 "
            />
          </div>
          <div className="mb-4">
            <label className="block text-fullblack dark:text-fullwhite">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-fullblack p-2 shadow-sm shadow-fullwhite hover:shadow-interact  dark:shadow transition-all rounded mt-1 "
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    );
  };

  return renderLoginForm();
};
export default LoginComponent;
