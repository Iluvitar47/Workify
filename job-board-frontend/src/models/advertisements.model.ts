import type { Company } from './companies.model'


interface Advertisement {
    id: number
    title: string
    description: string
    wages: number
    location: string
    working_times: string
    company_id: number
    created_at: string
    company?: Company 
}

export type { Advertisement }  