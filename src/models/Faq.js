import {Schema, model} from 'mongoose';

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

const Faq = model('Faq', faqSchema);
export default Faq;