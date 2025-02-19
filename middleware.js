import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';



async function verifyToken(token) {
  try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      return payload; // Returns decoded token data (id, email, role, etc.)
  } catch (error) {
      return null; // Invalid or expired token
  }
}


export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define public routes that do not require authentication
  const isPublicPath = path.startsWith('/authentication');

  // Get the token from cookies
  let tokenData = request.cookies.get('token')?.value;

  let userData = null;
    if (tokenData) {
        userData = await verifyToken(tokenData);
        console.log('User Data', userData);
    }

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
