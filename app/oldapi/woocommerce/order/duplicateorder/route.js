// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {

    const body = await req.json();
    const {id} = body;
    // console.log('Request Body:', body);
    // return;

//   console.log('Data', Data);

  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
    response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    return response;
  }
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    

    // Fetch products from the WooCommerce API.
    const order = await WooCommerc.get(`orders/${id}`);
    console.log(order.data);
    // return;
    const orderData = order.data;


    const Data = {
        payment_method: orderData.payment_method || "default_method",
        payment_method_title: orderData.payment_method_title || "Unknown Payment Method", 
        set_paid: false,
        billing: {
          first_name: orderData.billing.first_name || "",
          last_name: orderData.billing.last_name || "",
          address_1: orderData.billing.address_1 || "",
          address_2: orderData.billing.address_2 || "",
          city: orderData.billing.city || "",
          state: orderData.billing.state || "",
          postcode: orderData.billing.postcode || "",
          country: orderData.billing.country || "",
          email: orderData.billing.email || "",
          phone: orderData.billing.phone || "",
        },
        shipping: {
          first_name: orderData.shipping.first_name || "",
          last_name: orderData.shipping.last_name || "",
          address_1: orderData.shipping.address_1 || "",
          address_2: orderData.shipping.address_2 || "",
          city: orderData.shipping.city || "",
          state: orderData.shipping.state || "",
          postcode: orderData.shipping.postcode || "",
          country: orderData.shipping.country || "",
        },
        line_items: orderData.line_items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_lines: orderData.shipping_lines.map((shipping) => ({
          method_id: shipping.method_id || "free_shipping",
          method_title: shipping.method_title || "Free Shipping",
      })),
      };
      
      // console.log(orderData.shipping_lines);
      // console.log(Data);
      // return;
    const response = await WooCommerc.post("orders", Data);

    // console.log("Response", response); 

    // Check if the response is valid.
    if (!response || response.status !== 201) {
      return NextResponse.json(
        { status: 'error', message: "Failed to add order" },
        { status: 500 }
      );
    }

    // Return the fetched data.
    return NextResponse.json(
        { status: 'success', message: "order add successfully" },
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
      { status: 'error', message: "Failed to add order", error: error.message },
      { status: 500 }
    );
  }
}
