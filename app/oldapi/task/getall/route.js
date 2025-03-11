export const dynamic = "force-dynamic";
import { connectDb } from "@/helper/db";
import Task from "@/models/task";
import User from "@/models/User";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mongoose from "mongoose";



export async function GET(req, res) {

  const cookieStore = cookies();
  const token = cookieStore.get('token');
  if (!token) {
      const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
      response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
      return response;
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    // console.log(decoded.permissions);
    let editrequiredpermission = '67c7f7b1f30e5670dab55dc7';
    let addrequiredpermission = '67c7f533f1b6ce51367655af';

    if (!decoded.permissions.includes(editrequiredpermission) && !decoded.permissions.includes(addrequiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }

    await connectDb();
    // console.log("Registered models:", mongoose?.models ? Object.keys(mongoose.models) : "Mongoose not initialized");
    
    if (req.method === "GET") {
      try {
        // const users = await User.find().lean();
        const tasks = await Task.find().populate('crmuser', 'firstname lastname').lean();
        
        // return NextResponse.json({ status: "success", data: users }, { status: 200 });
        const response = NextResponse.json({ status: "success", data: tasks }, { status: 200 });

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

    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }
    
    return NextResponse.json({ status: "error", message: "Invalid Token!" }, { status: 401 });
  }
}
