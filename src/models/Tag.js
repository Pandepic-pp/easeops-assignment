import {Schema, model} from 'mongoose';

const tagSchema = new Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Tag = model('Tag', tagSchema);
export default Tag;