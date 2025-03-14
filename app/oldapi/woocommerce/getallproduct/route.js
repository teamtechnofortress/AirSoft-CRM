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
    let requiredpermission = '67b46bd87b14d62c9c5850d5';

    if (!decoded.permissions.includes(requiredpermission)) {
      return NextResponse.json(
        { status: "unauthorized", message: "Unauthorized" },
        { status: 403, headers: { Location: "/unauthorized" } }
      );
    }

    // Fetch the first page to determine total pages
    const firstPageResponse = await WooCommerc.get("products", { per_page: 100, page: 1 });

    if (!firstPageResponse || firstPageResponse.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const totalProducts = parseInt(firstPageResponse.headers['x-wp-total'], 10) || firstPageResponse.data.length;
    const totalPages = Math.ceil(totalProducts / 100);

    // Create an array of requests for all pages
    const requests = [];
    for (let page = 2; page <= totalPages; page++) {
      requests.push(WooCommerc.get("products", { per_page: 100, page }));
    }

    // Fetch all pages in parallel
    const responses = await Promise.allSettled(requests);

    // Combine all products
    const allProducts = [
      ...firstPageResponse.data,
      ...responses
        .filter(response => response.status === 'fulfilled' && response.value?.status === 200)
        .flatMap(response => response.value.data)
    ];

    return NextResponse.json(
      { data: allProducts, message: "All products fetched successfully" },
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
      { status: 'error', message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}
