import {Schema, model} from "mongoose";

const tokenSchema = new Schema({
    email: { type: String, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

const Token = model('Token', tokenSchema);

export default Token;