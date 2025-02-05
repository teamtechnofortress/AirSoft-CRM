export const dynamic = "force-dynamic";
import { connectDb } from "@/helper/db";
import User from "@/models/User";
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


export async function GET(req,{params}) {
    const { id } = params;

    // console.log('api id:', id);
  // const token = req.cookies.token;

  // if (!token) {
  //   res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
  //   return res.status(401).json({ status: "tokenerror", message: 'Token Missing!' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDb();
    if (req.method === "GET") {
      try {
        const users = await User.find({ _id: id }).lean();

        // const users = await User.find().populate('role', 'role');
        
        // return NextResponse.json({ status: "success", data: users }, { status: 200 });
        const response = NextResponse.json({ status: "success", data: users }, { status: 200 });

        // Set Cache-Control headers to avoid caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

        // return res.status(200).json({ status: "success", data: users });
      } catch (error) {
        return NextResponse.json({ status: "error", message:error.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ status: "error", message: "Method Not Allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error('Error during token verification:', error.message);
    if (error.name === 'TokenExpiredError') {
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
      return NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
    }
    return NextResponse.json({ status: "error", message: "Invalid Token!" }, { status: 401 });
  }
}
