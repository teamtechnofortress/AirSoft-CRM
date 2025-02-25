import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import axios from 'axios';



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
  let permissionList = [];
    if (tokenData) {
        userData = await verifyToken(tokenData);
        if(userData){
          permissionList = userData.permissions;
        }
        // console.log(permissionList);
    }

  const token = request.cookies.get('token');

  // Redirect users without authentication trying to access protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/authentication/login', request.nextUrl));
  }

  const protectedRoutes = {
    "/pages/user/adduser": "67b46c707b14d62c9c5850df",  // Add User
    "/pages/user/viewalluser": "67b46c7d7b14d62c9c5850e1",  // View Users
    "/pages/role/addrole": "67b46bf27b14d62c9c5850d7",  // Add Role
    "/pages/role/viewallrole": "67b46c2e7b14d62c9c5850d9",  // View Roles
    "/pages/order/addorder": "67b46cc27b14d62c9c5850e7",  // Add Order
    "/pages/order/viewallorder": "67b46cce7b14d62c9c5850e9",  // View Orders
    "/pages/customer/viewcustomer": "67b70a4f2a60496e39c85761",  // View Customer
  };


  // **🔍 Handle Dynamic Routes for `/pages/user/edituser/[id]`**
  let requiredPermission = protectedRoutes[path] || null;

  // Handle dynamic user edit route (`/pages/user/edituser/[id]`)
  if (path.startsWith("/pages/user/edituser/")) {
    requiredPermission = "67b46c877b14d62c9c5850e3";
  }
  if (path.startsWith("/pages/order/editorder/")) {
    requiredPermission = "67b46cd67b14d62c9c5850eb";
  }
  if (path.startsWith("/pages/role/editrole/")) {
    requiredPermission = "67b46c417b14d62c9c5850db";
  }

  // If the route is protected and the user lacks permission, redirect
  if (requiredPermission && !permissionList.includes(requiredPermission)) {
    console.warn(`Access Denied: ${path}`);
    return NextResponse.redirect(new URL("/unauthorized", request.nextUrl));
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
    '/',
    '/pages/:path*',
    '/authentication/:path*',
  ],
};
