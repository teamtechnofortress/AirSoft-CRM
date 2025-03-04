export const dynamic = "force-dynamic";
import { connectDb } from "@/helper/db";
import Userrole from "@/models/userrole";
import Permission from "@/models/permission";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token');
        
        if (!token) {
            const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
            response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
            return response;
        }
        
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        
        const userid = decoded.id;
        const userRole = decoded.role;
        // console.log("User Role:", userRole);

        // return;

        // Connect to the database
        await connectDb();

        // Fetch permissions from database
        // const permissions = await Permission.find();
        // const permissions = await Userrole.find().lean();
        const role = await Userrole.findOne({ _id: userRole }).populate("permissions", "permission").lean();
        // console.log(role);

        // Return JSON response
        return NextResponse.json(
            { status: "success", data: { ...role, userid } },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error during token verification:', error.message);

        if(error.name === 'TokenExpiredError'){
            const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
            response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
            return response;
        }
        // Invalid token handling
        return NextResponse.json({ status: "error", message: 'Invalid Token!' }, { status: 401 });
    }
}
