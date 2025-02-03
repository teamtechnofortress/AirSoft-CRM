import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    role:{type: Schema.Types.ObjectId, ref: 'Role', required: true},
    emailOtp: { type: String },

},{timestamps: true});

export default mongoose.models.User || mongoose.model('User', UserSchema);