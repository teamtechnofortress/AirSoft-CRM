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

    if (!decoded.permissions.includes(requiredpermission)) {
      return NextResponse.json(
        { status: "unauthorized", message: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ Step 1: Fetch first page to determine total pages
    const firstResponse = await WooCommerc.get("products", { per_page: 50, page: 1 });

    if (!firstResponse || firstResponse.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const totalProducts = parseInt(firstResponse.headers['x-wp-total'], 10) || firstResponse.data.length;
    const totalPages = Math.ceil(totalProducts / 50);

    // ✅ Step 2: Fetch all remaining pages in parallel
    const requests = [];
    for (let page = 2; page <= totalPages; page++) {
      requests.push(WooCommerc.get("products", { per_page: 50, page }));
    }

    const responses = await Promise.allSettled(requests);

    // ✅ Step 3: Merge all responses into one array
    const allProducts = [
      ...firstResponse.data,
      ...responses
        .filter(res => res.status === "fulfilled" && res.value.status === 200)
        .flatMap(res => res.value.data)
    ];

    return NextResponse.json(
      { data: allProducts, message: "All products fetched successfully" },
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
