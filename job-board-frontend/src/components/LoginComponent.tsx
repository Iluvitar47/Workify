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
            className="w-full button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex justify-center text-sm p-2 mt-6 "
          >
            Submit
          </button>
          {error &&
            <div className='flex items-center rounded-lg bg-alert_info bg-opacity-10 h-full" role="alert"'>
              <svg className="flex-shrink-0 inline w-4 h-full me-3 text-alert_info" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <p className="text-alert_info text-center mb-4">{error}</p>
            </div>
          }
        </form>
      </div>
    );
  };

  return renderLoginForm();
};
export default LoginComponent;
