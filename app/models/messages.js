import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageSchema = new Schema({
    message: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    seen: { type: String, default: 0 },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);