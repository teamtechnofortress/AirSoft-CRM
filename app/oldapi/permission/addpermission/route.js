import { connectDb } from "@/helper/db";
import Permission from "@/models/permission";
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


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
     await connectDb();


    // const permission = "deletecustomer";

    // const u = new Permission({ permission });
    // await u.save();

    return NextResponse.json({ status: "success", message: `Your permission ${permission} has been created!` }, { status: 200 });

  } catch (error) {

    console.error('Error during token verification:', error.message);

    if(error.name === 'TokenExpiredError'){
      const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
      response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
      return response;
    }

    return NextResponse.json({ status: "error", message: 'Invalid Token!' }, { status: 401 });
  }
}
