'use server'

import { cookies } from 'next/headers'

export const setCookie = (name: string, value: string, permission: string) => {
    if (permission === 'admin') {
        console.log('admin')
        cookies().set({
            name,
            value,
            httpOnly: true,
            path: '/dashboard', // only accessible from the dashboard
            expires: new Date(Date.now() + 2600 * 36000)
        })
    } else {
        console.log('not admin')
        cookies().set({
            name,
            value,
            httpOnly: true,
            path: '/', // accessible from the whole website
            expires: new Date(Date.now() + 2600 * 36000)
        })
    }
}

export const getCookie = (name: string) => {
  return cookies().get(name)
}