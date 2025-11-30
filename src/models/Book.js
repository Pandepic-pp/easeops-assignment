import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  authors: [{ type: Schema.Types.ObjectId, ref: 'Author', required: true, index: true }],
  categories: [{type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true}],
  tags: [{type: Schema.Types.ObjectId, ref: 'Tag', required: true, index: true}],
  feedback: [{type: Schema.Types.ObjectId, ref: 'Feedback', required: true, index: true}],
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