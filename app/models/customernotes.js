import mongoose from "mongoose";

const CustomerNoteSchema = new mongoose.Schema({
  customerId: { type: Number, required: true },
  customername: { type: String, required: true },
  note: { type: String, required: true },
  userid: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  
}, { timestamps: true });

const CustomerNote = mongoose.models.CustomerNote || mongoose.model("CustomerNote", CustomerNoteSchema);

export default CustomerNote;
