import { connectDb } from "@/helper/db";
import Userrole from "@/models/userrole";
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


export async function GET(req) {

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
            const roles = await Userrole.find().populate("permissions", "permission");
            // return res.status(200).json({ status: "success", data: roles });
            return NextResponse.json({ status: "success", data: roles }, { status: 200 });

        } catch (error) {
            // return res.status(500).json({ status: "error", message: error.message });
            return NextResponse.json({ status: "error", message: error.message }, { status: 500 });

        }
    }
    return NextResponse.json({ status: "error", message: 'Method not allowed' }, { status: 405 });

    // return res.status(405).json({ message: "Method not allowed" });
    
  } catch (error) {
    console.error('Error during token verification:', error.message);
    if (error.name === 'TokenExpiredError') {
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
      // return res.status(401).json({ status: "tokenerror", message: 'Token Expired!' });
      return NextResponse.json({ status: "tokenerror", message: 'Token Expired!' }, { status: 401 });

    }
    // return res.status(401).json({ status: "error", message: 'Invalid Token!' });
    return NextResponse.json({ status: "error", message: 'Token Expired!' }, { status: 401 });

  }
  }