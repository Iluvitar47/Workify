'use client';

import React, { useEffect, useState } from 'react';

type Advertisement = {
    id: number;
    title: string;
    description: string;
    wages: number;
    location: string;
    working_times: string;
    company_id: number;
    created_at: string;
};

const AdvertisementCards: React.FC = () => {
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchAdvertisements = async () => {
            try {
                setTimeout(() => {
                    const fakeData: Advertisement[] = [
                        {
                            id: 1,
                            title: 'Développeur Full Stack',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            wages: 55000,
                            location: 'Paris, France',
                            working_times: 'Temps plein',
                            company_id: 1,
                            created_at: '2024-01-01 10:00:00',
                        },
                        {
                            id: 2,
                            title: 'Designer UX/UI',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            wages: 45000,
                            location: 'Lyon, France',
                            working_times: 'Temps partiel',
                            company_id: 2,
                            created_at: '2024-02-15 15:30:00',
                        },
                        {
                            id: 3,
                            title: 'Designer UX/UI',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            wages: 45000,
                            location: 'Lyon, France',
                            working_times: 'Temps partiel',
                            company_id: 2,
                            created_at: '2024-02-15 15:30:00',
                        },
                    ];

                    setAdvertisements(fakeData);
                    setLoading(false);
                }, 2000);
            } catch {
                setError('Erreur lors du chargement des annonces');
                setLoading(false);
            }
        };

        fetchAdvertisements();
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedIds((prevExpandedIds) =>
            prevExpandedIds.includes(id)
                ? prevExpandedIds.filter((expandedId) => expandedId !== id)
                : [...prevExpandedIds, id]
        );
    };

    if (loading) return <div>Chargement des annonces...</div>;
    if (error) return <div>{error}</div>;
    if (advertisements.length === 0) return <div>Aucune annonce disponible.</div>;

    return (
        <div className="grid grid-flow-row grid-cols-1">
            {advertisements.map((ad) => (
                <div key={ad.id} className="add-card pb-5 my-5 mx-6 sm:mx-12 p-2 sm:p-4 ">
                    <h1 className="text-2xl font-bold">{ad.title}</h1>
                    <p className="mt-2 text-sm text-gray-500"><strong>Lieu :</strong> {ad.location}</p>
                    {expandedIds.includes(ad.id) ? (
                        <>
                            <p className="mt-2 text-sm text-gray-500">
                                <strong>Description :</strong> {ad.description}
                            </p>
                            <p className="mt-2 text-sm text-gray-500"><strong>Salaire :</strong> {ad.wages} €/an</p>
                            <p className="mt-2 text-sm text-gray-500"><strong>Horaires :</strong> {ad.working_times}</p>
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-gray-500">
                            <strong>Description :</strong> {ad.description.substring(0, 100)}...
                        </p>
                    )}
                    <div className='grid grid-cols-6'>
                        <div className='col-span-4'></div>
                        <button
                            className="button button transition-colors hover:underline hover:text-info hover:bg-interact text-fullblack dark:text-fullwhite flex items-center justify-center text-sm p-2 mt-6 col-span-2"
                            onClick={() => toggleExpand(ad.id)}
                        >
                            {expandedIds.includes(ad.id) ? 'Réduire' : 'En savoir plus'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdvertisementCards;
