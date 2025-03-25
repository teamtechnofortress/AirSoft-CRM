// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const searchParams = req.nextUrl.searchParams;
  const date_min = searchParams.get("date_min");
  const date_max = searchParams.get("date_max");
  console.log(date_min);

  if (!token) {
    const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
    response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    return response;
  }
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    

    // Fetch products from the WooCommerce API.
    const response = await WooCommerc.get("reports/sales", {
      date_min,
      date_max,
    });

    // console.log(response.data);
    // Check if the response is valid.
    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    // Return the fetched data.
    return NextResponse.json(

      { data: response.data, message: "Total Sale fetched successfully" },
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
      { status: 'error', message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
