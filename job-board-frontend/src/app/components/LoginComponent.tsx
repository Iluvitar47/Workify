'use client';

import React, { useState } from 'react';
import MiddlewareCheckError from '../../middlewares/error.middleware';
import Home from '../pages/Home';

const LoginComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const loginRoute = `${urlApi}/users/login`;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const renderLoginForm = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    );
  };

  return submitted ? (
    <MiddlewareCheckError
      route={loginRoute}
      method="POST"
      body={{ email, password }}
      render={() => <Home/>}
    />
  ) : (
    renderLoginForm()
  );
};

export default LoginComponent;