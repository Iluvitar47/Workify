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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setPermission(null);
    window.location.href = "/";
  }

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

        <div className="flex items-center">
          <svg width="auto" height="25" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg" className=" hidden min-[300px]:block" >
            <path d="M38.8781 0C38.8781 5.11933 37.8725 10.1885 35.9187 14.9181C33.9649 19.6478 31.1012 23.9453 27.491 27.5652C23.8808 31.1851 19.5949 34.0566 14.878 36.0157C10.1611 37.9747 5.10556 38.9831 0 38.9831L1.69942e-06 0H38.8781Z" fill="#F5C800" />
            <path d="M23.3269 39.178C23.3269 37.3095 23.7241 35.4592 24.4959 33.7329C25.2676 32.0066 26.3988 30.438 27.8248 29.1167C29.2508 27.7955 30.9438 26.7474 32.807 26.0323C34.6701 25.3173 36.6671 24.9492 38.6838 24.9492V39.178H23.3269Z" fill="#E71D36" />
          </svg>

          <span className="text-2xl font-bold pl-3 text-info hidden  min-[500px]:block">W</span>
          <span className="text-2xl font-bold  text-dark dark:text-ligth hidden min-[500px]:block">orkif</span>
          <span className="text-2xl font-bold text-interact hidden min-[500px]:block">y</span>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <button className="text-interact hover:underline">
                <a href="/profile">Profile</a>
              </button>
              <button className="text-interact hover:underline">
                <a href="/" onClick={logout}>Logout</a>
              </button>
            </>

          ) :
            (
              <>

                <button className="text-interact hover:underline">
                  <a href="/signup">Sign Up</a>
                </button>
                <button className="text-interact hover:underline">
                  <a href="/login">Login</a>
                </button>
              </>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
