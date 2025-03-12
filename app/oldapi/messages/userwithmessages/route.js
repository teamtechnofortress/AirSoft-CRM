export const dynamic = "force-dynamic";
import { connectDb } from "@/helper/db";
import User from "@/models/User";
import UserRole from "@/models/userrole";
import Message from "@/models/messages";
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
    console.log(decoded);
    // console.log(decoded.permissions);
    let requiredpermission = '67b46c7d7b14d62c9c5850e1';

    if (!decoded.permissions.includes(requiredpermission)) {
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
            const users = await User.find()
            .populate('role', 'role') // Populate role
            .lean();
        
        const unreadMessages = [];
        
        for (const user of users) {
            const userUnreadMessages = await Message.find({
                senderId: user._id,
                receiverId: decoded.id,
                seen: '0' // Only get unseen messages
            })
            .populate('senderId', 'firstname lastname email')
            .lean();
        
            // Add unread count to each user
            user.unreadCount = userUnreadMessages.length;
        
            unreadMessages.push(...userUnreadMessages); // Collect all unseen messages

            console.log(user.unreadCount);
        }
        

        console.log({ users, unreadMessages });
        
        const response = NextResponse.json({
            status: "success",
            data: {
                users: users, // Array of users with unread counts
                messages: unreadMessages // Array of all unseen messages
            }
        }, { status: 200 });

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
