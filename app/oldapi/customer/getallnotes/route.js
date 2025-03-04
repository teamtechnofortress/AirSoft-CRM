import { connectDb } from "@/helper/db";
import CustomerNote from "@/models/customernotes";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    const response = NextResponse.json(
      { status: "tokenerror", message: "Token Missing!" },
      { status: 401 }
    );
    response.headers.set("Set-Cookie", `token=; Max-Age=0; Path=/; HttpOnly`);
    return response;
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
   
    await connectDb();
    const notes = await CustomerNote.find();

    const response = NextResponse.json({ status: "success", data: notes }, { status: 200 });
    // Set Cache-Control headers to avoid caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
    
  } catch (error) {
    console.error("Error adding note:", error.message);

    if (error.name === "TokenExpiredError") {
      const response = NextResponse.json(
        { status: "tokenerror", message: "Token Expired!" },
        { status: 401 }
      );
      response.headers.set("Set-Cookie", `token=; Max-Age=0; Path=/; HttpOnly`);
      return response;
    }

    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
