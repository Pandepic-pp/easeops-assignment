import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    darkMode: { type: Boolean, default: false },
    pageView: { type: String, enum: ['single', 'double'], default: 'single' },
  }
}, { timestamps: true });

const User = model('User', userSchema);
export default User;
