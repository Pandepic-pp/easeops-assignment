import { Router } from "express";
import { getAuthors, addAuthor, updateAuthor, deleteAuthor } from "../controllers/authorController.js";

const router = Router();

router.get('/', getAuthors);
router.post('/', addAuthor);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

export { router };