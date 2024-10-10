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
    company?: Company; 
};

type Company = {
    id: number;
    name: string;
    email: string;
    phone: string;
    business_sector: string;
    location: string;
    employees: number;
    description: string;
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
                    const fakeCompanies: Company[] = [
                        {
                            id: 1,
                            name: 'Mediamétrie',
                            email: 'contact@techinnovators.com',
                            phone: '0123456789',
                            business_sector: 'Technologie',
                            location: 'Paris, France',
                            employees: 200,
                            description: 'Mediametrie is the leader in audience measurement in France.',
                        },
                        {
                            id: 2,
                            name: 'La gendarmerie nationale',
                            email: 'contact@designpros.com',
                            phone: '0987654321',
                            business_sector: 'Design',
                            location: 'Lyon, France',
                            employees: 50,
                            description: 'La gendarmerie nationale is a French law enforcement agency.',
                        },
                    ];

                    const fakeData: Advertisement[] = [
                        {
                            id: 1,
                            title: 'Développeur Full Stack',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit... Lorem ipsum dolor sit amet, consectetur adipiscing elit... Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                            wages: 55000,
                            location: 'Levallois-Perret, France',
                            working_times: 'Temps plein',
                            company_id: 1,
                            created_at: '2024-01-01 10:00:00',
                            company: fakeCompanies.find(company => company.id === 1), 
                        },
                        {
                            id: 2,
                            title: 'Designer UX/UI',
                            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit... Lorem ipsum dolor sit amet, consectetur adipiscing elit... Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                            wages: 45000,
                            location: 'Lyon, France',
                            working_times: 'Temps partiel',
                            company_id: 2,
                            created_at: '2024-02-15 15:30:00',
                            company: fakeCompanies.find(company => company.id === 2), 
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
                    {ad.company && (
                        <h2 className="mt-2 text-xl text-info">
                            {ad.company.name} 
                        </h2>
                    )}
                    <p className="mt-2 text-base"><strong>Lieu :</strong> {ad.location}</p>
                    {expandedIds.includes(ad.id) ? (
                        <>
                            <p className="mt-2 text-base">
                                <strong>Description :</strong> {ad.description}
                            </p>
                            <p className="mt-2 text-base"><strong>Salaire :</strong> {ad.wages} €/an</p>
                            <p className="mt-2 text-base"><strong>Horaires :</strong> {ad.working_times}</p>
                        </>
                    ) : (
                        <p className="mt-2 text-base">
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
