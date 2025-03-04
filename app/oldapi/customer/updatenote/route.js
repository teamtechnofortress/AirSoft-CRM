import { connectDb } from "@/helper/db";
import CustomerNote from "@/models/customernotes";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
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
   

    const body = await req.json();
    const {userid, note,noteid } = body;

    if (!note.trim()) {
      return NextResponse.json(
        { status: "error", message: "Customer ID and note are required" },
        { status: 400 }
      );
    }
    await connectDb();

    const updatedNote = await CustomerNote.findByIdAndUpdate(
        noteid,
        { userid, note },
        { new: true } // Returns the updated document
      );
  
      if (!updatedNote) {
        return NextResponse.json(
          { status: "error", message: "Note not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { status: "success", message: "Note updated successfully" },
        { status: 200 }
      );
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
