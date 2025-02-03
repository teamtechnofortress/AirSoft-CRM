import mongoose from "mongoose";

const { Schema } = mongoose;

const permissionsSchema = new Schema({
  permission: { type: String, required: true },
}, { timestamps: true });

// Export the model as 'permissions' (matching the ref in roleSchema)
export default mongoose.models.permissions || mongoose.model("permissions", permissionsSchema);
