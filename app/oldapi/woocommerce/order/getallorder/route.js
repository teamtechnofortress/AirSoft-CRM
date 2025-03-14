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
    let requiredpermission = '67b46cce7b14d62c9c5850e9';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }
    
    // Fetch all orders by handling pagination
    const allOrders = [];
    let page = 1;

    while (true) {
      const response = await WooCommerc.get("orders", {
        per_page: 100, // Fetch max orders per request
        page: page
      });

      if (!response || response.status !== 200) {
        return NextResponse.json(
          { status: 'error', message: "Failed to fetch orders" },
          { status: 500 }
        );
      }

      if (response.data.length === 0) break; // Stop when no more orders to fetch

      allOrders.push(...response.data);
      page++; // Move to the next page
    }

    // Return all orders
    return NextResponse.json(
      { data: allOrders, message: "All orders fetched successfully" },
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
      { status: 'error', message: "Failed to fetch orders", error: error.message },
      { status: 500 }
    );
  }
}
