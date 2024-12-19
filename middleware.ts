import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwtUtils'; // Assume you have a function to verify JWT
import { PAGE_URL } from './constants';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  // If the user is trying to access the login page
  if (url.pathname === PAGE_URL.HOME || url.pathname === PAGE_URL.LOGIN) {
    if (token) {
      try {
        await verifyToken(token);
        // Redirect authenticated users away from the login page
        return NextResponse.redirect(new URL(PAGE_URL.DASHBOARD, request.url));
      } catch (error) {
        // If token verification fails, allow access to the login page
        console.error(error);
      }
    }
    // Allow access to the login page if no token or token verification fails
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL(PAGE_URL.LOGIN, request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL(PAGE_URL.LOGIN, request.url));
  }
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/profile/:path*'], // Add paths to protect
};
