import { connectDb } from "@/helper/db";
import Message from "@/models/messages";
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectDb();
        const { searchParams } = new URL(req.url);
        const senderId = searchParams.get("senderId");
        const receiverId = searchParams.get("receiverId");

        if (!senderId || !receiverId) {
            return NextResponse.json({ status: "error", message: "Sender and receiver IDs are required" }, { status: 400 });
        }

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });
        // console.log(messages);
        return NextResponse.json({ status: "success", messages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
