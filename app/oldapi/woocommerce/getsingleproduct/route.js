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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ status: "badrequest", message: "Product ID is required" }, { status: 400 });
    }

    const response = await WooCommerc.get(`products/${id}`);
    // console.log("WooCommerce Product Response:", response.data);

    if (!response || response.status !== 200) {
      return NextResponse.json({ status: 'error', message: "Failed to fetch product" }, { status: 500 });
    }

    return NextResponse.json(
      { data: response.data, message: "Fetched product successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to fetch product", error: error.message },
      { status: 500 }
    );
  }
}
