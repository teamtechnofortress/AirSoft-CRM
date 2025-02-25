// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) {
      const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
      response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
      return response;
  }
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    let requiredpermission = '67b81fa41821f665a7493728';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }

    const {id} = await req.json();
    console.log(id);
    
    // const custom = await WooCommerc.get(`customers/${id}`);
    // console.log(custom);
    // console.log(custom.data);
    // return;
    const response = await WooCommerc.delete(`customers/${id}`, {
        force: true // Ensures permanent deletion
    });

    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to delete customer" },
        { status: 500 }
      );
    }

    // Return the fetched data.
    return NextResponse.json(
      { data: response.data, message: "Customer deleted successfully!" },
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
      { status: 'error', message: "Failed to delete customer", error: error.message },
      { status: 500 }
    );
  }
}
