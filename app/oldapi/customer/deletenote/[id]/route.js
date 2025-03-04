import { connectDb } from "@/helper/db";
import UserRole from "@/models/userrole";
import User from "@/models/User";
import jwt from 'jsonwebtoken';
import CustomerNote from "@/models/customernotes";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  const { id } = params;
//   console.log("Deleting role id:", id);

  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
    response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    return response;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    // let requiredpermission = '67b46c477b14d62c9c5850dd';

    // if (!decoded.permissions.includes(requiredpermission)) {
    //     return NextResponse.json(
    //       { status: "unauthorized", message: "Unauthorized" },
    //       { status: 403, headers: { Location: "/unauthorized" } }
    //     );
    // }

    // Connect to the database
    await connectDb();

    // If the role is not in use, delete it.
    const deletednote = await CustomerNote.findByIdAndDelete(id);
    if (!deletednote) {
      return NextResponse.json(
        { status: "error", message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: "success", message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during token verification or deletion:', error.message);

    if (error.name === 'TokenExpiredError') {
      const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
      response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
      return response;
    }

    return NextResponse.json({ status: "error", message: error.message }, { status: 401 });
  }
}
