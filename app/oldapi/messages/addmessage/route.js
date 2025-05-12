import { connectDb } from "@/helper/db";
import Message from "@/models/messages";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDb();
        const body = await req.json();
        const { message, senderId, receiverId } = body;
        // console.log(message,senderId,receiverId);

        if (!message || !senderId || !receiverId) {
            return NextResponse.json({ status: "error", message: "All fields are required" }, { status: 400 });
        }

        const newMessage = new Message({
            message,
            senderId,
            receiverId,
            seen: 0
        });

        await newMessage.save();

        return NextResponse.json({ status: "success", message: "Message sent successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
