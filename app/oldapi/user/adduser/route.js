import { connectDb } from "@/helper/db";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



export async function POST(req, res) {

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

    if (req.method === "POST") {
      try {
          const body = await req.json(); 
          const {firstname,lastname,email,password,phone,role} = body;
          if (!password) {
              return NextResponse.json({ status: "error", message: "Password is required" }, { status: 400 });
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
              firstname,
              lastname,
              email,
              password:hashedPassword,
              phone,
              role
          });
          await newUser.save();
          return NextResponse.json({ status: "success", message: "User Add Successfully!" }, { status: 200 });

      } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });

      }
    }else{
      return NextResponse.json({ status: "error", message: 'Method Not Allowed!' }, { status: 401 });
    }

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
