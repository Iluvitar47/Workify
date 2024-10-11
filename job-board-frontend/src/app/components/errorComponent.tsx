'use client';

import { useState, useEffect } from 'react';
import React from 'react';


const ErrorComponent = () => {
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5558/api/v1/users');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.json();
      console.log('Data received: ', data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {error && (
        <div style={{ display: 'block', color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default ErrorComponent;
