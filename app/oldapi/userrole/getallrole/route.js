export const dynamic = "force-dynamic";
import { connectDb } from "@/helper/db";
import Userrole from "@/models/userrole";
import Permission from "@/models/permission";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mongoose from "mongoose";


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
    if (req.method === "GET") {
        try {
            // console.log("Registered models:", mongoose?.models ? Object.keys(mongoose.models) : "Mongoose not initialized");
            // const roles = await Userrole.find().lean();
            const roles = await Userrole.find().populate("permissions", "permission").lean();
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
    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }
    // return res.status(401).json({ status: "error", message: 'Invalid Token!' });
    return NextResponse.json({ status: "error", message: 'Token Expired!' }, { status: 401 });

  }
  }