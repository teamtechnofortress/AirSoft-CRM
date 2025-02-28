import mongoose from "mongoose";

const CustomerNoteSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  note: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.customernote || mongoose.model("CustomerNote", CustomerNoteSchema);
