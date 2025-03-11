import { connectDb } from "@/helper/db";
import Task from "@/models/task";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



export async function DELETE(req,{ params }) {
    const { id } = params;

    // console.log('delete api:',id);

    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
        const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    let requiredpermission = '67c7f7b9f30e5670dab55dc9';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }
    
    await connectDb();
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return NextResponse.json({ status: "error", message: "Task not found" }, { status: 404 });
        }

      return NextResponse.json(
        { status: "success", message: "Task deleted successfully" },
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
