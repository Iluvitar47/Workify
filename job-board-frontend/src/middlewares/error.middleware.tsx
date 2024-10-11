'use client';

import { useState, useEffect } from 'react';
import React from 'react';

const useFetchData = <T,>(url: string, method: string, body?: object | undefined) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        if (errorData.errors) {
          throw new Error(errorData.errors[0].msg || 'Something went wrong');
        }
        throw new Error(errorData.message || 'Something went wrong');
      }
      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, error };
};

const MiddlewareCheckError = <T,>({ route, method, body, render }: { route: string; method: string, body: object | undefined; render: (data: T) => JSX.Element }) => {
  const { data, error } = useFetchData<T>(route, method, body);

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
      {data && render(data)}
    </div>
  );
};

export default MiddlewareCheckError;
