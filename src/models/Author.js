import { Schema, model } from "mongoose";

const authorSchema = new Schema({
    name: { type: String, required: true, index: true },
});

const Author = model("Author", authorSchema);
export default Author;