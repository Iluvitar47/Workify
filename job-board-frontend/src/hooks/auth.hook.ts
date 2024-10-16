'use client'

import { getCookie } from '../utils/cookies.utils'
import type { Token } from '../models/token.model'

export default async function auth() {
    const token = await getCookie('token') as Token
        if (!token) {
        return false
    } else {
        return true
    }
}