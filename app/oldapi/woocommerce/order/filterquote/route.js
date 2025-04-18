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
    let requiredPermission = '67b46cce7b14d62c9c5850e9';

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const search = searchParams.get("search") || "";
    // console.log('page:', page);
    // console.log('page:', search);

    if (!decoded.permissions.includes(requiredPermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }
    
    const response = await WooCommerc.get("orders", {
      per_page: 20,
      page: page,
      search:search,
      status:'quotation',
    });

    const totalorders = parseInt(response.headers['x-wp-total'] || response.headers['X-WP-Total']) || 0;

    return NextResponse.json(
      { data: response.data,Total:totalorders, message: "All Quotation fetched successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);

    if (error.name === 'TokenExpiredError') {
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to fetch quotation", error: error.message },
      { status: 500 }
    );
  }
}
