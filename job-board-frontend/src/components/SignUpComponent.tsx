'use client';

// import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';
import type { People } from '../models/people.model';

const SignUpComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const signUpRoute = `${urlApi}/people`;
  const [formData, setFormData] = useState<Partial<People>>({});
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
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
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('people', JSON.stringify(data.people));
      })
      .catch((err) => {
        setError(err.message);
      });
      // router.push('/signup');
    };

  const renderSignUp = () => {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={handleSubmit} className="p-6  w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <h3 className="text-1xl font-bold mb-4 text-center">Personal informations</h3>
          <div className="mb-4">
            <input
              type="text"
              name="firstname"
              value={formData.firstname || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack"
              placeholder='First Name'
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="lastname"
              value={formData.lastname || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Last Name'
            />
          </div>
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
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Phone'
            />
          </div>
          <div className="mb-4">
            <textarea
              name="experiences"
              value={formData.experiences || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Experiences'
            />
          </div>
          <div className="mb-4">
            <textarea
              name="studies"
              value={formData.studies || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Studies'
            />
          </div>
          <div className="mb-4">
            <textarea
              name="skills"
              value={formData.skills || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Skills'
            />
          </div>
          <div className="mb-4">
            <textarea
              name="business_sector"
              value={formData.business_sector || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Business Sector'
            />
          </div>
          <div className="mb-4">
            <textarea
              name="target_job"
              value={formData.target_job || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Target Job'
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="input w-full  text-fullblack "
              placeholder='Location'
            />
          </div>
          <button
            type="submit"
            className="w-full button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex justify-center text-sm  mt-6 h-full"
          >
            Submit
          </button>
          {error && <p className="text-info text-center mt-4">{error}</p>}
        </form>
      </div>
    );
  };

  return renderSignUp();
};

export default SignUpComponent;