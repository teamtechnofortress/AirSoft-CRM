export const dynamic = "force-dynamic";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';




export function GET(req, res) {

    // const cookieStore = cookies();
    // const token = cookieStore.get('token');

    // if (!token) {
    //     const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
    //     response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    //     return response;
    // }

    try {
        // const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        if (req.method === 'GET') {
            const response = NextResponse.json({ status: "success", message: "Logout successful" });
            response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
            return response;
        }else{
           const response = NextResponse.json({status:"error", message: 'Method not allowed' },{status: 405});
           return response;
        }
        
    } catch (error) {
        console.error('Error during token verification:', error.message);

        if(error.name === 'TokenExpiredError'){
            const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
            response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
            return response;
        }

        const response = NextResponse.json(
            { status: "error", message: error.message},
            { status: 401 }
        );
        return response;
    }
    
  }
  