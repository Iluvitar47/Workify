import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import Offers from './Offers';
import adminPermission from '@/hooks/adminPermission.hook';
// import { getCookie } from '@/utils/cookies.utils';
import MiddlewareCheckError from '@/middlewares/error.middleware';
import type { User } from '@/models/user.model';

export function getCurrentPermission() {
    const urlApi = process.env.NEXT_PUBLIC_API_URL;
    const getCurrentRoute = `${urlApi}/users/current`;
    // const token = getCookie('token');

    // return (
    //     <MiddlewareCheckError
    //         route={getCurrentRoute}
    //         method='GET'
    //         body={undefined}
    //         render={(currentUser: User) => {
    //             const userPermission = currentUser as User;
    //             return userPermission.permission;
    //         }}
    //     />
    // );

    return (
        <MiddlewareCheckError
          route={getCurrentRoute}
          method="GET"
          body={undefined}
          render={(currentUser) => { const userPermission = currentUser as User; return userPermission.permission; }}
        />
    )
}

export function getPermission(permission: string): boolean {
    if (permission === 'admin') {
        return true;
    }
    return false;
}

export function AdminPage() {
    const [isAdmin, setisAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            const permission = await getCurrentPermission();
          const authenticated = await adminPermission(permission);
          setisAdmin(authenticated);
          setLoading(false);
        };
    
        checkAdmin();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return <Offers/>;
    }
    return <Dashboard/>;
}

export default function Home() {
  return (
    <>
        <AdminPage/>
    </>
  );
}
