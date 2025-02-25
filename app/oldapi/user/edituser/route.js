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

    let requiredpermission = '67b46c877b14d62c9c5850e3';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }
    
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
    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }
    return NextResponse.json({ status: "error", message: 'Invalid Token!' }, { status: 401 });
  }
}
