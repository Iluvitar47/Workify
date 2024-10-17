'use client';

import { useRouter } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';
import type { User } from '../models/user.model';
import type { People } from '../models/people.model';

const SignUpUserComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const signUpRoute = `${urlApi}/users`;
  const [formData, setFormData] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const peopleTokenString = localStorage.getItem('people');
    if (peopleTokenString) {
      const peopleToken: People = JSON.parse(peopleTokenString);
      setFormData((prevData) => ({
        ...prevData,
        email: peopleToken.email,
        people_id: peopleToken.id,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit= (e: React.FormEvent) => {
    e.preventDefault();
    fetch(signUpRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unable to create account');
        }
        return res;
      })
      .then(() => {
        localStorage.removeItem('people');
        router.push('/login');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const renderSignUp = () => {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <h3 className="text-1xl font-bold mb-4 text-center">Account informations</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  return renderSignUp();
};

export default SignUpUserComponent;