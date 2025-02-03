import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema({
  role: { type: String, required: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permissions" }], // Ensure the 'ref' matches the model name
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model("Role", roleSchema);
