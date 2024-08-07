import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/authJWT';

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;
  const decodedToken = await verifyToken(request);
  // Define routes that require authentication
  const protectedRoutes = ['/links/save','/links/delete-link'];

  // If the user is not authenticated and trying to access a protected route
  if (!decodedToken && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and trying to access login or signup
  
  if (decodedToken && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/links', '/login', '/signup'],
};