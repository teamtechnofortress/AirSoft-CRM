// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
    response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    return response;
  }
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    let requiredpermission = '67b46cd67b14d62c9c5850eb';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }

    const body = await req.json();
    const {id } = body; 
    // console.log('api hit');

    // Fetch products from the WooCommerce API.
    const response = await WooCommerc.get(`orders/${id}`);
    // console.log(response.data);

    // Check if the response is valid.
    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch order" },
        { status: 500 }
      );
    }

    // Return the fetched data.
    return NextResponse.json(
        { status: "success", data: response.data, message: "Order fetched successfully" },
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
      { status: 'error', message: "Failed to fetch order", error: error.message },
      { status: 500 }
    );
  }
}
