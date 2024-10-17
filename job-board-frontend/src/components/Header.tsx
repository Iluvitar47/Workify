'use client';

import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    const user = localStorage.getItem("user");
    const permission = user ? JSON.parse(user).permission : null;
    setPermission(permission);
  }, []);

  return (
    <header className="bg-fullwhite dark:bg-fullblack h-20 flex items-center px-4">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="text-interact hover:underline">
            <a href="/">Home</a>
          </button>
          {permission === "admin" && (
            <button className="text-interact hover:underline">
              <a href="/offers">Offers</a>
            </button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <button className="text-interact hover:underline">
              <a href="/profile">Profile</a>
            </button>
          ) : (
            <>
              <button className="text-interact hover:underline">
                <a href="/login">Login</a>
              </button>
              <button className="text-interact hover:underline">
                <a href="/signup">Sign Up</a>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
