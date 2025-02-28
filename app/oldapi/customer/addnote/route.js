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
   

    await connectDb();
    const body = await req.json();
    const { customerId, note } = body;

    if (!customerId || !note.trim()) {
      return NextResponse.json(
        { status: "error", message: "Customer ID and note are required" },
        { status: 400 }
      );
    }

    const newNote = new CustomerNote({ customerId, note });
    await newNote.save();

    return NextResponse.json({ status: "success", message: "Note added successfully" }, { status: 201 });
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
