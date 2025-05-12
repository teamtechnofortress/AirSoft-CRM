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
    let requiredPermission = '67b70a4f2a60496e39c85761';

    if (!decoded.permissions.includes(requiredPermission)) {
      return NextResponse.json(
        { status: "unauthorized", message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page"), 10) || 1; // Default to page 1
    const search = searchParams.get("search") || "";

    // Fetch customers with pagination
    const response = await WooCommerc.get("customers", {
      per_page: 20, // Max WooCommerce allows per request
      search:search,
      role:"all",
    });
    // console.log(response.data);

    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch customers" },
        { status: 500 }
      );
    }

    const totalCustomers = parseInt(response.headers['x-wp-total'] || response.headers['X-WP-Total']) || 0;

    return NextResponse.json(
      { data: response.data, Total: totalCustomers, message: "Fetched customers successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to fetch customers", error: error.message },
      { status: 500 }
    );
  }
}
