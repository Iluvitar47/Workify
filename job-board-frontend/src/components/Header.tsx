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
    <header>
      <button>
        <a href="/">Home</a>
      </button>
      {token ? (
        <>
          <button>
            <a href="/profile">Profile</a>
          </button>
          {permission === "admin" ? (
            <>
              <button>
                <a href="/offers">Offers</a>
              </button>
            </>
          ) : null}
        </>
      ) : (
        <button>
          <a href="/login">Login</a>
        </button>
      )}
    </header>
  );
}

export default Header;
