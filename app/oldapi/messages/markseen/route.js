import { connectDb } from "@/helper/db";
import Message from "@/models/messages";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
       
        await connectDb();
        const body = await req.json();
        const { messageIds } = body;

        console.log(messageIds);
        if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
            return NextResponse.json({ status: "error", message: "Invalid message IDs" }, { status: 400 });
        }

        const response = await Message.updateMany({ _id: { $in: messageIds } }, { $set: { seen: 1 } });

        console.log(response);

        return NextResponse.json({ status: "success", message: "Messages marked as seen" }, { status: 200 });
    } catch (error) {
        console.log(error.message );

        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
