// called on the admin page to check if the user is an admin

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/dashboard' &&
    JSON.parse(localStorage.getItem('user') ?? '').permission !== 'admin'
  ) {
    return NextResponse.redirect('/');
  }
}
