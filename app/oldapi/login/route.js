// Correct import
export const dynamic = "force-dynamic";
import { connectDb } from '@/helper/db';
import User from '@/models/User';
import Userrole from "@/models/userrole";
import Permission from "@/models/permission";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';




export async function POST(req, res) {

    try{
    // let hex = require('crypto').randomBytes(64).toString('hex');
    // console.log(hex);
    if (req.method === "POST") {

        const { email, password } = await req.json(); 

        if (!email || !password) {
            return NextResponse.json(
                { status: "error", message: "Email and password are required" },
                { status: 400 }
            );
        }
        await connectDb(); 

        // console.log('Email', email);
        // console.log('Password', password);
        
        let user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ status: "error", message: 'Invalid credentials'  }, { status: 401 });
        } 

        const role = await Userrole.findOne({ _id: user.role }).populate("permissions", "permission").lean();
        const permissionIds = role?.permissions?.map((p) => p._id.toString()) || [];

        // console.log(permissionIds);
        
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role,permissions: permissionIds }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        }); 

        const clearToken = serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Clear the cookie immediately
            path: "/",
        });
        
        const serialized = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        const response = NextResponse.json(
            { status: "Success", token },
            { status: 200 }
        );
        response.headers.set("Set-Cookie", serialized);
        return response;

    } else {
        return NextResponse.json({ status: "error", message: 'Method not allowed'  }, { status: 405 });
    }

    }catch(error){
        return NextResponse.json({ status: "error", message: error  }, { status: 401 });
    }
}
