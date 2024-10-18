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
      <div className="flex justify-center items-center min-h-screen bg-ligth dark:bg-dark">
        <form onSubmit={handleSubmit} className="p-6  w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <h3 className="text-1xl font-bold mb-4 text-center">Account informations</h3>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Email'
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="input w-full p-2 text-fullblack "
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex justify-center text-sm p-2 mt-6 h-full"
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

  return renderSignUp();
};

export default SignUpUserComponent;