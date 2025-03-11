import { connectDb } from "@/helper/db";
import Task from "@/models/task";
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

    // console.log(decoded.permissions);
    let requiredpermission = '67c7f533f1b6ce51367655af';

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
          const {taskname,priorty,taskdate,taskstatus,taskdescription,taskcomments,crmuser} = body;


          // if (!taskname || !priorty || !taskdate || !taskstatus || !taskdescription || !taskcomments || !crmuser) {
          //     return NextResponse.json({ status: "error", message: "All fields is required" }, { status: 400 });
          // }
          if (!taskdescription || !crmuser) {
              return NextResponse.json({ status: "error", message: "All fields is required" }, { status: 400 });
          }

        //   const user = await User.findOne({ email: email });

        //   if (user) {
        //     return NextResponse.json({ status: "error", message: "Email already Exists." }, { status: 400 });
        //   }
        //   const hashedPassword = await bcrypt.hash(password, 10);
          const newTask = new Task({
             taskname,priorty,taskdate,taskstatus,taskdescription,taskcomments,crmuser,
          });
          await newTask.save();
          return NextResponse.json({ status: "success", message: "Task Add Successfully!" }, { status: 200 });

      } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });

      }
    }else{
      return NextResponse.json({ status: "error", message: 'Method Not Allowed!' }, { status: 401 });
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
