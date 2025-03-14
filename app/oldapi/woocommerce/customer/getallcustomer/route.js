// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) {
      const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
      response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
      return response;
  }
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    let requiredpermission = '67b70a4f2a60496e39c85761';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }

    // Fetch all customers by handling pagination
    const allCustomers = [];
    let page = 1;

    while (true) {
      const response = await WooCommerc.get("customers", {
        per_page: 100, // Fetch maximum customers per request
        page: page
      });

      if (!response || response.status !== 200) {
        return NextResponse.json(
          { status: 'error', message: "Failed to fetch customers" },
          { status: 500 }
        );
      }

      if (response.data.length === 0) break; // Stop when no more customers to fetch

      allCustomers.push(...response.data);
      page++; // Move to the next page
    }

    // Return all customers
    return NextResponse.json(
      { data: allCustomers, message: "All customers fetched successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);

    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to fetch customers", error: error.message },
      { status: 500 }
    );
  }
}
