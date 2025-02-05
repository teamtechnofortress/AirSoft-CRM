import { connectDb } from "@/helper/db";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';



export async function POST(req, res) {

  // const token = req.cookies.token;

  // if (!token) {
  //   res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
  //   return res.status(401).json({ status: "tokenerror", message: 'Token Missing!' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDb();
    if (req.method === "POST") {
      try {
          const body = await req.json(); 

          const {id,firstname,lastname,email,password,phone,role} = body;

          if (!id) {
            return NextResponse.json(
              { status: "error", message: "User ID is required" },
              { status: 400 }
            );
          }

          if (!email) {
            return NextResponse.json({ status: "error", message: "Email is required" }, { status: 400 });
          }


          const user = await User.findById(id);
          
          if (!user) {
            return NextResponse.json(
                { status: "error", message: "User Not Exists!" },
                { status: 400 }
            );
          }

          let hashedPassword = user.password; // Keep existing password if not provided
          if (password) {
           hashedPassword = await bcrypt.hash(password, 10);
          }

          await User.findByIdAndUpdate(
            id,
            { firstname, lastname, email, password: hashedPassword, phone, role },
            { new: true } // Return updated user
          );
      
          return NextResponse.json(
            { status: "success", message: "User Updated Successfully!" },
            { status: 200 }
          );
          
      } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });

      }
    }
  } catch (error) {
    console.error('Error during token verification:', error.message);
    if (error.name === 'TokenExpiredError') {
      res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
      return NextResponse.json({ status: "tokenerror", message: 'Token Expired!' }, { status: 401 });
    }
    return NextResponse.json({ status: "error", message: 'Invalid Token!' }, { status: 401 });
  }
}
