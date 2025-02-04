// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req) {
  // If you need to handle tokens, you can extract cookies like this:
  // const token = req.cookies.get('token')?.value;
  
  try {
    // Uncomment and adjust the token verification logic if needed.
    // if (!token) {
    //   return NextResponse.json(
    //     { status: "tokenerror", message: 'Token Missing!' },
    //     { status: 401 }
    //   );
    // }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch products from the WooCommerce API.
    const response = await WooCommerc.get("products");

    // Check if the response is valid.
    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Return the fetched data.
    return NextResponse.json(
      { data: response.data, message: "Products fetched successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);

    // If the error is due to an expired token, clear the token cookie.
    if (error.name === 'TokenExpiredError') {
      const res = NextResponse.json(
        { status: 'tokenerror', message: "Token Expired!" },
        { status: 401 }
      );
      // Setting cookies in NextResponse:
      res.cookies.set('token', '', { maxAge: 0, path: '/', httpOnly: true });
      return res;
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
