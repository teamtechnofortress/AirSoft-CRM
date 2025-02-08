import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define public routes that do not require authentication
  const isPublicPath = path.startsWith('/authentication');

  // Get the token from cookies
  const token = request.cookies.get('token');

  // Redirect users without authentication trying to access protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/authentication/login', request.nextUrl));
  }
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }


  // Allow the request to proceed
  return NextResponse.next();
}

// Middleware configuration to apply protection to certain routes
export const config = {
  matcher: [
    '/', // Protect dashboard and its subpages
    '/pages/:path*',     // Protect all pages
    '/authentication/:path*',     // Protect all pages
  ],
};
