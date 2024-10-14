'use client'

// import { redirect } from 'next/navigation'
import { getCookie } from '../utils/cookies.utils'
import type { Token } from '../models/token.model'

import { useRouter } from 'next/router'
import { useEffect } from 'react'

// export default async function auth() {
//     const token = await getCookie('token') as Token
//     console.log('auth middleware', token)
//     if (token === undefined) {
//         redirect('/login')
//     } else if (token.path === '/dashboard') {
//         redirect('/dashboard')
//     } else {
//         redirect('/')
//     }
// }

export default function useAuthRedirect() {
    const router = useRouter()
  
    useEffect(() => {
        (async () => {
            const token = await getCookie('token') as Token
      
            if (!token) {
                router.push('/login')
            } else if (token.path === '/dashboard') {
                router.push('/dashboard')
            } else {
                router.push('/')
            }
        })();
    }, [router])
}