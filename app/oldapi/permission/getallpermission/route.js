export const dynamic = "force-dynamic";
import { connectDb } from "@/helper/db";
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
        
        
        // Connect to the database
        await connectDb();

        // Handle the GET request to fetch permissions
        if (req.method === "GET") {
            try {
                const permissions = await Permission.find().lean();
                // Return the response as JSON using NextResponse
                return NextResponse.json({ status: "success", data: permissions }, { status: 200 });
            } catch (error) {
                // Handle error and return the response as JSON using NextResponse
                return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
            }
        }
        
        // If the method is not GET, return a Method Not Allowed error
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });

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
