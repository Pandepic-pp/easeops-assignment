import { Schema, model } from 'mongoose';

const bookmarkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  page: { type: Number, default: 1 },    
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Bookmark = model('Bookmark', bookmarkSchema);
export default Bookmark;
