// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST(req) {

    const body = await req.json();
    const { status, id, set_paid } = body;

    const data = {
      status: status,
    };
    
    if (typeof set_paid !== 'undefined') {
      data.set_paid = set_paid;
    }

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
    

    // Fetch products from the WooCommerce API.
    const response = await WooCommerc.put(`orders/${id}`, data);

    // console.log("Response", response.data);
    // const pdfBytes = await genratepdf(response.data);
    // return new NextResponse(pdfBytes, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': 'attachment; filename="invoice.pdf"', // triggers download
    //   },
    // });

    // Check if the response is valid.
    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to change order status" },
        { status: 500 }
      );
    }

    if (data.set_paid === true) {
      return NextResponse.json(
          { status: 'success', message: "Quote converted to order successfully" },
          { status: 200 }
      );
    }

    return NextResponse.json(
        { status: 'success', message: "order status chnage successfully" },
        { status: 200 }
    );
      
    
  } catch (error) {
    console.error("Error:", error);
    console.error('Error during:', error.message);

    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to chnage order status", error: error.message },
      { status: 500 }
    );
  }
}
