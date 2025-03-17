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
    return NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    let requiredpermission = '67b46bd87b14d62c9c5850d5';
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page"), 10) || 1; // Default to page 1
    // console.log('page:',page);


    if (!decoded.permissions.includes(requiredpermission)) {
      return NextResponse.json(
        { status: "unauthorized", message: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ Fetch ONLY 100 products (first page)
    const response = await WooCommerc.get("products", {
      per_page: 20, // Max WooCommerce allows per request
      page: page,        // First page only
    });

    const totalproducts = parseInt(response.headers['x-wp-total'] || response.headers['X-WP-Total']) || 0;
    // console.log('Total:', totalproducts);

    // ✅ Handle API errors
    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // ✅ Return the first 100 products
    return NextResponse.json(
      { data: response.data,Total:totalproducts , message: "Fetched first 100 products successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
