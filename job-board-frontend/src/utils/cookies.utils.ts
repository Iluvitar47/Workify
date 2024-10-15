'use server';

import { cookies } from 'next/headers';

export const setCookie = (name: string, value: string) => {
  cookies().set({
    name,
    value,
    httpOnly: true,
    path: '/',
    expires: new Date(Date.now() + 2600 * 36000),
  });
};

export const getCookie = (name: string) => {
  return cookies().get(name);
};
