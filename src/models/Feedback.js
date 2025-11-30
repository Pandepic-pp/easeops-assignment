import {Schema, model} from 'mongoose';

const feedbackSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

const Feedback = model('Feedback', feedbackSchema);
export default Feedback;