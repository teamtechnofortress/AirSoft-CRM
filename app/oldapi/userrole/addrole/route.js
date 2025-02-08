import { connectDb } from "@/helper/db";
import Userrole from "@/models/userrole";
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
          const { role, permission } = body;

          if (!role || !permission || permission.length === 0) {
              return NextResponse.json({ status: "error", message: "Role and permissions are required" }, { status: 400 });
          }
          const newRole = new Userrole({
              role,
              permissions: permission // This assumes 'permission' is an array of permission IDs
          });
          await newRole.save();
          return NextResponse.json({status:"success"}, { status: 200 });
      } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });

      }
    }
    return NextResponse.json({message:"Method not allowed"}, { status: 405 });
  } catch (error) {

    console.error('Error during token verification:', error.message);

    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }
    return NextResponse.json({status: "error",message:"Token Expired!"}, { status: 401 });
  }
}
