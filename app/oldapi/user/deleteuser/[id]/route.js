import { connectDb } from "@/helper/db";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



export async function DELETE(req,{ params }) {
    const { id } = params;

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
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return NextResponse.json(
          { status: "error", message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { status: "success", message: "User deleted successfully" },
        { status: 200 }
      );
        
    } catch (error) {
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
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
