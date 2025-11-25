import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  authors: [{ type: String }],
  categories: [{ type: String, index: true }],
  tags: [{ type: String, index: true }],
  feedback: [{type: String, default: [] }],
  filename: { type: String, required: true }, 
  filepath: { type: String, required: true }, 
  mimetype: { type: String },
  size: { type: Number },
  thumbnail: { type: String, default: '' }, 
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

bookSchema.index({ title: 'text', description: 'text', tags: 'text', authors: 'text' });

const Book = model('Book', bookSchema);
export default Book;