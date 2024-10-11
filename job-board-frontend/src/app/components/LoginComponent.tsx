'use client';

import React, { useState } from 'react';
import MiddlewareCheckError from '../../middlewares/error.middleware';

const LoginComponent: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const loginRoute = `${urlApi}/users/login`;
  console.log(loginRoute);
  const [email, setEmail] = useState<string>('admin@admin.fr');
  const [password, setPassword] = useState<string>('superadmin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const renderLoginForm = () => {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  };

  return (
    <MiddlewareCheckError
      route={loginRoute}
      method='POST'
      body={{ email, password }}
      render={() => renderLoginForm()}
    />
  );
};

export default LoginComponent;